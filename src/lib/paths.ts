/**
 * GitHub Pages project sites are served from a repository sub-path
 * (https://azazamir139-glitch.github.io/xamircode.github.io/).
 *
 * next/link, next/script and the Next metadata system receive this prefix
 * automatically from `basePath` in next.config.ts — but plain element URLs
 * (<img src>, <video>/<source src>, inline style url(), raw <a href>) must
 * add it themselves.
 *
 * NEXT_PUBLIC_BASE_PATH is inlined at build time: it is set only for the
 * static export build, so in local development withBase() returns every
 * URL unchanged and nothing moves.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  /* Only root-absolute paths need the prefix; external URLs, protocol-
     relative URLs, fragments and data URIs pass through untouched. */
  if (!path.startsWith("/")) return path;
  /* Idempotent: never double-prefix. */
  if (BASE_PATH && path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
