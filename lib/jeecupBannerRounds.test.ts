import { describe, it, expect } from "vitest";
import { bannerRoundAt, BANNER_ROUNDS } from "./jeecupBannerRounds";

/**
 * The homepage banner rolls between counselling rounds on fixed IST dates and
 * hides itself once the last one passes. It is driven purely by the clock, so
 * nobody notices a wrong threshold until the wrong thing is on the homepage.
 *
 * Importing this module also runs its own build-time assertions, which throw
 * if a round's dates were moved to a new cycle without updating its copy —
 * so this file failing can mean either the logic or that guard.
 */
describe("bannerRoundAt", () => {
  it("shows the first round before any threshold has passed", () => {
    const first = BANNER_ROUNDS[0];
    expect(bannerRoundAt(first.rollAtMs - 1)).toBe(first);
  });

  it("rolls to the next round the instant a threshold passes", () => {
    const [first, second] = BANNER_ROUNDS;
    expect(bannerRoundAt(first.rollAtMs)).toBe(second);
    expect(bannerRoundAt(first.rollAtMs - 1)).toBe(first);
  });

  it("hides the banner once the final round has ended", () => {
    const last = BANNER_ROUNDS[BANNER_ROUNDS.length - 1];
    expect(bannerRoundAt(last.rollAtMs)).toBeNull();
    expect(bannerRoundAt(last.rollAtMs + 86_400_000)).toBeNull();
  });

  it("is a pure function of the timestamp it is given", () => {
    const t = BANNER_ROUNDS[0].rollAtMs - 1000;
    expect(bannerRoundAt(t)).toBe(bannerRoundAt(t));
  });

  it("keeps its thresholds in ascending order", () => {
    const times = BANNER_ROUNDS.map((r) => r.rollAtMs);
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });
});
