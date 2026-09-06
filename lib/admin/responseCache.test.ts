import { describe, it, expect } from "vitest";
import { ResponseCache } from "./responseCache";

/** A cache with a controllable clock, so nothing here has to sleep. */
function withClock(ttlMs = 1000, maxEntries = 60) {
  let t = 0;
  const cache = new ResponseCache(ttlMs, maxEntries, () => t);
  return { cache, advance: (ms: number) => { t += ms; } };
}

describe("ResponseCache", () => {
  it("returns a miss for a key it has never seen", () => {
    const { cache } = withClock();
    expect(cache.get("/content/faculty/")).toEqual({ hit: false });
  });

  it("serves back what was stored", () => {
    const { cache } = withClock();
    cache.set("/content/faculty/", { results: [{ id: 1 }] });
    expect(cache.get("/content/faculty/")).toEqual({
      hit: true,
      data: { results: [{ id: 1 }] },
    });
  });

  it("keeps different query strings apart", () => {
    const { cache } = withClock();
    cache.set("/submissions/apply/?page=1", "first");
    cache.set("/submissions/apply/?page=2", "second");
    expect(cache.get("/submissions/apply/?page=1")).toEqual({ hit: true, data: "first" });
    expect(cache.get("/submissions/apply/?page=2")).toEqual({ hit: true, data: "second" });
  });

  it("treats a cached null as a hit, not a miss", () => {
    // The singleton Contact endpoint can legitimately answer null. A
    // `T | undefined` return would have made that indistinguishable from a
    // miss and refetched it every single time.
    const { cache } = withClock();
    cache.set("/content/contact/", null);
    expect(cache.get("/content/contact/")).toEqual({ hit: true, data: null });
  });

  describe("isolation between readers", () => {
    it("does not hand out the object it is holding", () => {
      const { cache } = withClock();
      cache.set("k", { results: [3, 1, 2] });

      // A screen sorts what it was given, as the Inbox and Overview do.
      const first = cache.get("k");
      if (!first.hit) throw new Error("expected a hit");
      (first.data as { results: number[] }).results.sort();

      const second = cache.get("k");
      expect(second).toEqual({ hit: true, data: { results: [3, 1, 2] } });
    });

    it("does not keep a reference to what the caller stored", () => {
      const { cache } = withClock();
      const mine = { results: [{ id: 1, name: "before" }] };
      cache.set("k", mine);

      mine.results[0].name = "after";

      expect(cache.get("k")).toEqual({
        hit: true,
        data: { results: [{ id: 1, name: "before" }] },
      });
    });
  });

  describe("expiry", () => {
    it("still hits just before the TTL is up", () => {
      const { cache, advance } = withClock(1000);
      cache.set("k", "v");
      advance(999);
      expect(cache.get("k")).toEqual({ hit: true, data: "v" });
    });

    it("misses exactly at the TTL", () => {
      const { cache, advance } = withClock(1000);
      cache.set("k", "v");
      advance(1000);
      expect(cache.get("k")).toEqual({ hit: false });
    });

    it("drops the expired entry rather than leaving it to rot", () => {
      const { cache, advance } = withClock(1000);
      cache.set("k", "v");
      advance(5000);
      cache.get("k");
      expect(cache.size).toBe(0);
    });

    it("restarts the clock when a key is written again", () => {
      const { cache, advance } = withClock(1000);
      cache.set("k", "old");
      advance(900);
      cache.set("k", "new");
      advance(900); // 1800ms since the first write, 900 since the second
      expect(cache.get("k")).toEqual({ hit: true, data: "new" });
    });
  });

  describe("clear", () => {
    it("empties everything", () => {
      // This is what a write does. The rule is deliberately blunt: one PATCH
      // can change what several unrelated endpoints return, so the cache
      // throws away all of it rather than reasoning about which.
      const { cache } = withClock();
      cache.set("/content/alumni/", "a");
      cache.set("/submissions/summary/", "b");
      cache.set("/auth/me/", "c");
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.get("/content/alumni/")).toEqual({ hit: false });
      expect(cache.get("/submissions/summary/")).toEqual({ hit: false });
      expect(cache.get("/auth/me/")).toEqual({ hit: false });
    });
  });

  describe("eviction", () => {
    it("never grows past its cap", () => {
      const { cache } = withClock(1000, 3);
      for (let i = 0; i < 10; i++) cache.set(`k${i}`, i);
      expect(cache.size).toBe(3);
    });

    it("evicts the oldest insert first", () => {
      const { cache } = withClock(1000, 3);
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      cache.set("d", 4); // pushes "a" out
      expect(cache.get("a")).toEqual({ hit: false });
      expect(cache.get("b")).toEqual({ hit: true, data: 2 });
      expect(cache.get("d")).toEqual({ hit: true, data: 4 });
    });

    it("counts a rewrite as a fresh insert, not an old one", () => {
      // Map preserves insertion order, and set() deletes before re-adding so
      // that a refreshed key moves to the back of the eviction queue. Without
      // that delete, the busiest key would be the first one thrown away.
      const { cache } = withClock(1000, 3);
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      cache.set("a", 99); // "a" is now the newest
      cache.set("d", 4);  // so "b" should go, not "a"
      expect(cache.get("a")).toEqual({ hit: true, data: 99 });
      expect(cache.get("b")).toEqual({ hit: false });
    });
  });
});
