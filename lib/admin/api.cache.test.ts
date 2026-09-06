import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * The cache's own rules are covered in responseCache.test.ts. These tests
 * cover the wiring — whether api() actually consults it, actually empties it
 * on a write, and actually refuses to store a failure. That is where a bug
 * would cost an operator a lost edit, so it is worth the fetch stub.
 */

// api() is browser-only by design: isBrowser() gates the cache so that a
// module-level Map can never be shared between two people's requests on the
// server. These stubs are what make the browser path reachable from Node.
const store = new Map<string, string>();
const localStorageStub = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};

let fetchCalls: { url: string; method: string }[] = [];

function respond(status: number, body: unknown) {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
  } as unknown as Response;
}

beforeEach(async () => {
  store.clear();
  fetchCalls = [];
  // @ts-expect-error — deliberately faking just enough of the browser
  globalThis.window = { location: { origin: "http://localhost" } };
  // @ts-expect-error — same
  globalThis.localStorage = localStorageStub;

  const { responseCache, Tokens } = await import("./api");
  responseCache.clear();
  Tokens.set("test-access-token");
  responseCache.clear(); // Tokens.set clears it too; start from a known state
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

describe("api() response caching", () => {
  it("asks the network once for two identical GETs", async () => {
    const { api } = await import("./api");
    stubFetch(() => respond(200, { results: [{ id: 1 }] }));

    const a = await api("/content/faculty/");
    const b = await api("/content/faculty/");

    expect(a).toEqual({ results: [{ id: 1 }] });
    expect(b).toEqual(a);
    expect(fetchCalls.filter((c) => c.method === "GET")).toHaveLength(1);
  });

  it("treats different query strings as different requests", async () => {
    const { api } = await import("./api");
    stubFetch((url) => respond(200, { page: url.includes("page=2") ? 2 : 1 }));

    await api("/submissions/apply/", { searchParams: { page: 1 } });
    await api("/submissions/apply/", { searchParams: { page: 2 } });

    expect(fetchCalls).toHaveLength(2);
  });

  it("goes back to the network after a write", async () => {
    // The one that matters most: an operator saves an edit and must see it.
    const { api } = await import("./api");
    let version = "before";
    stubFetch((_url, init) => {
      if ((init.method ?? "GET") !== "GET") {
        version = "after";
        return respond(200, { ok: true });
      }
      return respond(200, { value: version });
    });

    expect(await api("/content/events/")).toEqual({ value: "before" });
    await api("/content/events/3/", { method: "PATCH", body: { title: "x" } });
    expect(await api("/content/events/")).toEqual({ value: "after" });
  });

  it("empties the cache for endpoints the write did not touch", async () => {
    // A PATCH on one alumnus changes the dashboard counters too. The cache
    // does not try to work out which keys are affected — it drops all of them.
    const { api } = await import("./api");
    stubFetch(() => respond(200, { ok: true }));

    await api("/content/alumni/");
    await api("/submissions/summary/");
    expect(fetchCalls.filter((c) => c.method === "GET")).toHaveLength(2);

    await api("/content/alumni/7/", { method: "PATCH", body: {} });

    await api("/content/alumni/");
    await api("/submissions/summary/");
    expect(fetchCalls.filter((c) => c.method === "GET")).toHaveLength(4);
  });

  it("still empties the cache when the write FAILS", async () => {
    // A rejected write leaves the server in a state we did not predict
    // either. Keeping the old copy would be a guess; refetching is not.
    const { api, ApiError } = await import("./api");
    stubFetch((_url, init) =>
      (init.method ?? "GET") === "GET"
        ? respond(200, { value: 1 })
        : respond(500, { detail: "boom" }),
    );

    await api("/content/events/");
    await expect(
      api("/content/events/3/", { method: "PATCH", body: {} }),
    ).rejects.toBeInstanceOf(ApiError);

    await api("/content/events/");
    expect(fetchCalls.filter((c) => c.method === "GET")).toHaveLength(2);
  });

  it("never stores a failed read", async () => {
    const { api } = await import("./api");
    let fail = true;
    stubFetch(() => (fail ? respond(503, { detail: "down" }) : respond(200, { ok: true })));

    await expect(api("/content/events/")).rejects.toThrow();
    fail = false;
    // If the 503 had been cached, this would return the error body instead.
    expect(await api("/content/events/")).toEqual({ ok: true });
  });

  it("drops everything when the operator signs out", async () => {
    // Otherwise the next person to use this browser could be served the
    // previous operator's lead list.
    const { api, Tokens } = await import("./api");
    stubFetch(() => respond(200, { secret: "operator A's leads" }));

    await api("/submissions/apply/");
    expect(fetchCalls).toHaveLength(1);

    Tokens.clear();

    await api("/submissions/apply/");
    expect(fetchCalls).toHaveLength(2);
  });

  it("drops everything when a different operator signs in", async () => {
    const { api, Tokens } = await import("./api");
    stubFetch(() => respond(200, { ok: true }));

    await api("/auth/me/");
    expect(fetchCalls).toHaveLength(1);

    Tokens.set("a-different-operators-token");

    await api("/auth/me/");
    expect(fetchCalls).toHaveLength(2);
  });
});
