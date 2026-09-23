/** Shared TOC helpers — server-safe (no "use client"). */

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/**
 * Persian slug helper — keeps Persian characters but makes the string
 * URL-safe (spaces/zero-width chars → dash, unsafe chars stripped).
 * Same id must be computed at extraction time (server) and render time.
 */
export function headingId(text: string, index: number): string {
  const base = text
    .trim()
    .replace(/[\s\u200c]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base ? `${base}-${index}` : `section-${index}`;
}
