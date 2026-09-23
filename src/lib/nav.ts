/**
 * Section-anchor links (#projects, #about, ...) only resolve on the
 * homepage. On added routes (/blog, /resume, /admin, /blog/[slug]) they
 * must navigate to the homepage first. On "/" the value is returned
 * unchanged so the locked homepage frontend is byte-identical.
 */
export function resolveSectionHref(href: string, pathname: string): string {
  if (href.startsWith("#") && pathname !== "/") {
    return `/${href}`;
  }
  return href;
}
