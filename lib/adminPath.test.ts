import { describe, it, expect } from "vitest";
import { isAdminPath } from "./adminPath";

describe("isAdminPath", () => {
  it("matches the dashboard root and everything under it", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/")).toBe(true);
    expect(isAdminPath("/admin/dashboard")).toBe(true);
    expect(isAdminPath("/admin/dashboard/inbox")).toBe(true);
    expect(isAdminPath("/admin/dashboard/content/faculty")).toBe(true);
  });

  it("does not match public routes that merely start the same way", () => {
    // The live one. If this ever returns true, /admission loses its nav and
    // footer and stops reporting to analytics — silently.
    expect(isAdminPath("/admission")).toBe(false);
    expect(isAdminPath("/admission/fees")).toBe(false);
    // Hypothetical, but the same trap.
    expect(isAdminPath("/administration")).toBe(false);
    expect(isAdminPath("/admins")).toBe(false);
  });

  it("does not match ordinary public routes", () => {
    for (const p of ["/", "/apply", "/alumni", "/blog/some-post", "/contact"]) {
      expect(isAdminPath(p)).toBe(false);
    }
  });

  it("treats a missing pathname as public", () => {
    // usePathname() can be null. Falling back to "public" keeps the site's
    // own chrome and analytics working; the opposite default would silently
    // strip the nav off a real page.
    expect(isAdminPath(null)).toBe(false);
    expect(isAdminPath(undefined)).toBe(false);
    expect(isAdminPath("")).toBe(false);
  });
});
