import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * What happens when a session dies.
 *
 * Found from a screenshot rather than a test: an operator's token expired with
 * the tab open, every request 401'd, the refresh 401'd too — and the dashboard
 * carried on showing "0 new · 0 leads" as though that were the data. Nothing
 * sent them to the login screen, and six separate refresh attempts went out for
 * the one dead session.
 *
 * These pin both halves. They stub window.location because api() is browser-only
 * by design and the redirect is the behaviour under test.
 */

const store = new Map<string, string>();
let fetchCalls: { url: string; method: string }[] = [];
let replaced: string[] = [];

function respond(status: number, body: unknown) {
  // Both readers are needed: api() reads the body with text(), the refresh
  // path with json(). A fake that only has text() passes every test here
  // except the one that actually exercises a successful refresh.
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
    json: async () => body,
  } as unknown as Response;
}

/**
 * Just enough of window for api() to take its browser path. An explicit cast
 * rather than @ts-expect-error: the error lands on the nested `location`
 * property, not the assignment, so a directive above the statement is reported
 * as unused and the real complaint survives.
 */
function setLocation(pathname: string) {
  (globalThis as unknown as { window: unknown }).window = {
    location: {
      origin: "http://localhost",
      pathname,
      replace: (url: string) => void replaced.push(url),
    },
  };
}

beforeEach(async () => {
  store.clear();
  fetchCalls = [];
  replaced = [];
  setLocation("/admin/dashboard/inbox");
  // @ts-expect-error — same
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  };
  vi.resetModules(); // the "already ending" latch is module state
  const { responseCache, Tokens } = await import("./api");
  responseCache.clear();
  Tokens.set("expired-access-token", "some-refresh-token");
});

afterEach(() => {
  // @ts-expect-error — put the environment back
  delete globalThis.window;
  // @ts-expect-error — same
  delete globalThis.localStorage;
  vi.restoreAllMocks();
});

function stubFetch(handler: (url: string, init: RequestInit) => Response) {
  vi.stubGlobal("fetch", async (url: string, init: RequestInit = {}) => {
    fetchCalls.push({ url: String(url), method: init.method ?? "GET" });
    return handler(String(url), init);
  });
}

/** Every request 401s and the refresh is refused — a fully dead session. */
function stubDeadSession() {
  stubFetch((url) =>
    url.includes("/auth/refresh/")
      ? respond(401, { detail: "Token is invalid or expired" })
      : respond(401, { detail: "Authentication credentials were not provided." }),
  );
}

describe("a session the server has stopped accepting", () => {
  it("sends the operator to the login screen", async () => {
    const { api } = await import("./api");
    stubDeadSession();

    await expect(api("/submissions/apply/")).rejects.toThrow();

    expect(replaced).toEqual(["/admin"]);
  });

  it("clears the tokens on the way out", async () => {
    const { api, Tokens } = await import("./api");
    stubDeadSession();

    await expect(api("/submissions/apply/")).rejects.toThrow();

    expect(Tokens.access()).toBeNull();
    expect(Tokens.refresh()).toBeNull();
  });

  it("refreshes once for a burst of requests, not once each", async () => {
    // The Inbox fires five endpoints at once; the layout adds a sixth.
    const { api } = await import("./api");
    stubDeadSession();

    await Promise.allSettled([
      api("/submissions/apply/"),
      api("/submissions/contact/"),
      api("/submissions/enquiry/"),
      api("/submissions/visit/"),
      api("/submissions/follow-ups/"),
      api("/auth/me/"),
    ]);

    const refreshes = fetchCalls.filter((c) => c.url.includes("/auth/refresh/"));
    expect(refreshes).toHaveLength(1);
  });

  it("navigates once for a burst, not once per failed request", async () => {
    const { api } = await import("./api");
    stubDeadSession();

    await Promise.allSettled([
      api("/submissions/apply/"),
      api("/submissions/contact/"),
      api("/submissions/enquiry/"),
    ]);

    expect(replaced).toEqual(["/admin"]);
  });

  it("does not redirect when already on the login screen", async () => {
    // Otherwise the login page would reload itself in a loop.
    setLocation("/admin");
    const { api } = await import("./api");
    stubDeadSession();

    await expect(api("/submissions/apply/")).rejects.toThrow();

    expect(replaced).toEqual([]);
  });

  it("gives up immediately when there is no refresh token at all", async () => {
    const { api, Tokens } = await import("./api");
    Tokens.clear();
    store.set("bipe.access", "expired-access-token"); // access but no refresh
    stubDeadSession();

    await expect(api("/submissions/apply/")).rejects.toThrow();

    expect(fetchCalls.filter((c) => c.url.includes("/auth/refresh/"))).toHaveLength(0);
    expect(replaced).toEqual(["/admin"]);
  });
});

describe("a session that can still be refreshed", () => {
  it("retries the request and stays put", async () => {
    const { api } = await import("./api");
    let refreshed = false;
    stubFetch((url, init) => {
      if (url.includes("/auth/refresh/")) {
        refreshed = true;
        return respond(200, { access: "a-fresh-token" });
      }
      return refreshed
        ? respond(200, { results: [{ id: 1 }] })
        : respond(401, { detail: "expired" });
    });

    expect(await api("/submissions/apply/")).toEqual({ results: [{ id: 1 }] });
    expect(replaced).toEqual([]); // no sign-out — the session recovered
  });
});
