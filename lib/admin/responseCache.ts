/**
 * A small in-memory cache for admin GET responses.
 *
 * The dashboard had none. Every request opted out of browser caching
 * (`cache: "no-store"`) and nothing was held between screens, so moving
 * Content → Faculty → Events → back to Faculty made three full round trips
 * for a list that had not changed in the ten seconds since it was last on
 * screen. Each of those trips goes from the operator's desk in Varanasi to a
 * Vercel function in Washington DC and back (Sep 2026 performance audit,
 * findings F4 and F8), so it is a wait worth not repeating.
 *
 * ─── The rules, and why they are these rules ────────────────────────────
 *
 * Stale data in an admin panel is worse than slow data. An operator who
 * saves an edit and does not see it will save it again. So the design is
 * deliberately blunt rather than clever:
 *
 *   1. Only GETs are ever stored.
 *   2. Entries live for TTL_MS and are then gone. There is no background
 *      revalidation — a hit is served as-is, or it is a miss and refetched.
 *   3. **Any** write empties the whole cache. Not the matching key, not the
 *      matching collection: everything. A PATCH to one alumnus can change
 *      what /content/alumni/ returns, what the dashboard counters say, and
 *      what the audit log shows. Working out which keys those are is exactly
 *      the kind of reasoning that goes subtly wrong; throwing everything away
 *      costs one refetch on the next screen and cannot be wrong.
 *   4. Signing in or out empties it too, so one operator's data can never be
 *      served to the next person to use that browser.
 *
 * What is left is a bounded window — at most TTL_MS — in which a *different*
 * operator's change is not yet visible. The Inbox and Users screens both have
 * a Refresh button, which clears this cache before it reloads.
 *
 * Entries are copied in and out, so a caller that sorts or edits what it was
 * given cannot corrupt what the next screen reads. That is not hypothetical
 * housekeeping: the Inbox and the Overview both sort arrays built from
 * fetched data, and sharing one object between every reader is the kind of
 * bug that shows up as "the list is in a different order sometimes". The
 * copy costs 1.6 ms at a thousand rows and 9 ms at five thousand, against a
 * round trip of a few hundred milliseconds — measured, and not a close call.
 *
 * The clock is injectable so the tests do not have to sleep.
 */

/**
 * A deep copy of a JSON-shaped value. Everything stored here came from
 * JSON.parse, so structuredClone handles all of it; the fallback is for
 * environments old enough to lack it, where a JSON round trip is exactly
 * equivalent for this data.
 */
function copy<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);
}

/** How long a stored response stays usable. */
export const TTL_MS = 20_000;

/** Cap on stored entries. The Inbox alone can fetch dozens of pages, and a
 *  full lead list is measured in megabytes — this keeps a long session from
 *  growing without limit. Oldest inserted is evicted first. */
export const MAX_ENTRIES = 60;

export class ResponseCache {
  private store = new Map<string, { at: number; data: unknown }>();

  constructor(
    private ttlMs: number = TTL_MS,
    private maxEntries: number = MAX_ENTRIES,
    private now: () => number = () => Date.now(),
  ) {}

  /**
   * Returns `{ hit: false }` for a miss OR an expired entry — expired ones are
   * dropped on the way past. The hit/miss shape rather than `T | undefined`
   * so that a legitimately cached `null` or `undefined` body is still a hit.
   */
  get(key: string): { hit: true; data: unknown } | { hit: false } {
    const entry = this.store.get(key);
    if (!entry) return { hit: false };
    if (this.now() - entry.at >= this.ttlMs) {
      this.store.delete(key);
      return { hit: false };
    }
    return { hit: true, data: copy(entry.data) };
  }

  set(key: string, data: unknown): void {
    // Re-inserting moves the key to the end of the Map's ordering, which is
    // what makes the eviction below oldest-first rather than arbitrary.
    this.store.delete(key);
    this.store.set(key, { at: this.now(), data: copy(data) });
    while (this.store.size > this.maxEntries) {
      const oldest = this.store.keys().next();
      if (oldest.done) break;
      this.store.delete(oldest.value);
    }
  }

  clear(): void {
    this.store.clear();
  }

  /** Entry count, for tests and for reasoning about eviction. */
  get size(): number {
    return this.store.size;
  }
}
