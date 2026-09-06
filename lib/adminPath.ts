/**
 * Is this URL path part of the staff dashboard?
 *
 * Two things branch on this and must agree: the public site's chrome
 * (components/shell/ConditionalChrome.tsx) and every analytics tracker
 * (components/shell/PublicTelemetry.tsx). Getting it wrong in either
 * direction is a real bug — nav and footer bleeding into the dashboard,
 * or the Meta Pixel reporting admissions-lead screens to Facebook.
 *
 * A prefix test, deliberately, so that every current and future screen
 * under /admin is covered without a list to maintain. The one hazard with
 * a prefix is a sibling route that merely starts the same way; /admission
 * is the live one and it diverges at the fifth character ("admis" vs
 * "admin"), so it does not match. The tests pin that.
 */
export function isAdminPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
