/**
 * GitHub Pages serving mode is build-time configurable:
 *   - ROOT user site (https://xamir13.github.io/ — current target):
 *     NEXT_PUBLIC_BASE_PATH is unset and withBase() returns every URL
 *     unchanged (root-absolute /… URLs are correct as-is).
 *   - A repository SUB-PATH target: NEXT_PUBLIC_BASE_PATH provides the
 *     prefix (e.g. /xamircode.github.io).
 *
 * next/link, next/script and the Next metadata system receive the prefix
 * automatically from `basePath` in next.config.ts — but plain element URLs
 * (<img src>, <video>/<source src>, inline style url(), raw <a href>) must
 * add it themselves.
 *
 * NEXT_PUBLIC_BASE_PATH is inlined at build time: it is only set for a
 * sub-path static export build, so in local development withBase() returns
 * every URL unchanged and nothing moves.
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
