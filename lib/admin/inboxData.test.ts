import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * These cover the page-walking that the Overview was missing.
 *
 * The backend caps a list response at about 25 rows however many are asked
 * for, and hands back a `next` link for the rest. A caller that fetches once
 * sees only the newest 25 — which is what the Overview did, so it counted
 * leads from a fraction of the data and reported them as the whole.
 *
 * The stubs mirror lib/admin/api.cache.test.ts: api() is browser-only by
 * design, so window and localStorage have to exist to reach its real path.
 */

const store = new Map<string, string>();
let fetchCalls: string[] = [];

function page(results: unknown[], next: string | null) {
  return { count: 0, next, previous: null, results };
}

function rows(prefix: string, n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    name: `${prefix}-${i}`,
    phone: String(9000000000 + i),
  }));
}

beforeEach(async () => {
  store.clear();
  fetchCalls = [];
  // @ts-expect-error — deliberately faking just enough of the browser
  globalThis.window = { location: { origin: "http://localhost" } };
  // @ts-expect-error — same
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  };
  const { responseCache } = await import("./api");
  responseCache.clear();
});

afterEach(() => {
  // @ts-expect-error — put the environment back
  delete globalThis.window;
  // @ts-expect-error — same
  delete globalThis.localStorage;
  vi.restoreAllMocks();
});

/** Serve `pages` in order for any request, recording the URLs asked for. */
function stubPages(pages: unknown[]) {
  let i = 0;
  vi.stubGlobal("fetch", async (url: string) => {
    fetchCalls.push(String(url));
    const body = pages[Math.min(i, pages.length - 1)];
    i += 1;
    return {
      status: 200,
      ok: true,
      text: async () => JSON.stringify(body),
    } as unknown as Response;
  });
}

describe("fetchAllPages", () => {
  it("keeps asking while the API says there is more", async () => {
    const { fetchAllPages } = await import("./inboxData");
    stubPages([
      page(rows("a", 25), "http://x/?page=2"),
      page(rows("b", 25), "http://x/?page=3"),
      page(rows("c", 3), null),
    ]);

    const all = await fetchAllPages("/submissions/apply/");

    expect(all).toHaveLength(53); // the exact shape of the 1 Jun 2026 bug
    expect(fetchCalls).toHaveLength(3);
  });

  it("stops after one request when there is no next page", async () => {
    const { fetchAllPages } = await import("./inboxData");
    stubPages([page(rows("a", 4), null)]);

    expect(await fetchAllPages("/submissions/visit/")).toHaveLength(4);
    expect(fetchCalls).toHaveLength(1);
  });

  it("asks for successive page numbers", async () => {
    const { fetchAllPages } = await import("./inboxData");
    stubPages([
      page(rows("a", 25), "next"),
      page(rows("b", 25), "next"),
      page(rows("c", 1), null),
    ]);

    await fetchAllPages("/submissions/contact/");

    expect(fetchCalls[0]).toContain("page=1");
    expect(fetchCalls[1]).toContain("page=2");
    expect(fetchCalls[2]).toContain("page=3");
  });

  it("still requests a large page size, so a raised backend cap collapses the walk", async () => {
    const { fetchAllPages } = await import("./inboxData");
    stubPages([page(rows("a", 2), null)]);

    await fetchAllPages("/submissions/apply/");

    expect(fetchCalls[0]).toContain("page_size=500");
  });

  it("accepts a bare array from an endpoint that is not paginated", async () => {
    const { fetchAllPages } = await import("./inboxData");
    stubPages([rows("f", 6)]);

    expect(await fetchAllPages("/submissions/follow-ups/")).toHaveLength(6);
    expect(fetchCalls).toHaveLength(1);
  });

  it("gives up rather than looping forever on an API that always says 'more'", async () => {
    const { fetchAllPages } = await import("./inboxData");
    stubPages([page(rows("a", 1), "always-another-page")]);

    const all = await fetchAllPages("/submissions/apply/");

    expect(fetchCalls).toHaveLength(100);
    expect(all).toHaveLength(100);
  });
});

/**
 * fetchInbox hits five endpoints, and the follow-ups one returns a different
 * shape from the four submission ones. A single canned response for all of
 * them is not a valid fixture — it made the first draft of the test below
 * fail on a missing `createdAt`, which was the fixture's fault and not the
 * code's.
 */
function stubByPath(followUps: unknown[], submissions: unknown[]) {
  vi.stubGlobal("fetch", async (url: string) => {
    fetchCalls.push(String(url));
    const body = String(url).includes("follow-ups")
      ? page(followUps, null)
      : page(submissions, null);
    return {
      status: 200,
      ok: true,
      text: async () => JSON.stringify(body),
    } as unknown as Response;
  });
}

describe("fetchInbox", () => {
  it("tags every row with the form it came from", async () => {
    const { fetchInbox } = await import("./inboxData");
    stubByPath([], rows("x", 2));

    const { merged } = await fetchInbox();

    // Two rows from each of the four submission endpoints.
    expect(merged).toHaveLength(8);
    expect(new Set(merged.map((r) => r.kind))).toEqual(
      new Set(["apply", "contact", "enquiry", "visit"]),
    );
  });

  it("groups follow-ups by normalised phone, newest first", async () => {
    const { fetchInbox } = await import("./inboxData");
    stubByPath(
      [
        { id: 1, leadKey: "+919876543210", createdAt: "2026-06-01T00:00:00Z" },
        { id: 2, leadKey: "9876543210", createdAt: "2026-06-03T00:00:00Z" },
        { id: 3, leadKey: "09876543210", createdAt: "2026-06-02T00:00:00Z" },
      ],
      [],
    );

    const { byKey } = await fetchInbox();

    // +91, bare and 0-prefixed are the same person.
    expect(byKey["9876543210"].map((f) => f.id)).toEqual([2, 3, 1]);
  });
});
