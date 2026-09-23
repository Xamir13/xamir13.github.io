#!/usr/bin/env node
/**
 * Patches the static export in out/ for GitHub Pages SUB-PATH serving.
 *
 * The portfolio now deploys to the ROOT user site (https://xamir13.github.io/)
 * where no prefix is needed — in that case NEXT_PUBLIC_BASE_PATH is unset and
 * this script exits as a no-op. It is kept for any future sub-path target
 * (e.g. a project site) where next.config.ts already gives every Next-
 * generated URL (JS/CSS chunks,
 * next/link hrefs, metadata) the configured prefix via
 * basePath + assetPrefix, and app code wraps raw element URLs with
 * withBase(). The remaining root-absolute URLs live in sources that
 * cannot call JS helpers:
 *   - @font-face url("/fonts/...") inside compiled CSS,
 *   - favicon / RSS <link> hrefs and similar leftovers in HTML,
 *   - asset-path string literals embedded in JS chunks (site-data images).
 *
 * This step rewrites ONLY known asset namespaces (fonts, images, sounds,
 * media, favicon, logo, manifest, robots) and is idempotent — already
 * prefixed URLs can never match again because the character immediately
 * before their leading slash is never one of the match-prefix characters
 * (= " ' ( , whitespace { ` backslash or line start).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const OUT_DIR = path.join(root, "out");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const TEXT_EXT = new Set([".html", ".css", ".js", ".mjs"]);

/* Known asset namespaces only — page paths (/blog, /resume, /api/…) are
   deliberately NEVER touched so router logic keeps working. */
const NAMESPACES =
  "fonts/|images/|sounds/|media/|favicon\\.svg|favicon\\.ico|logo\\.svg|site\\.webmanifest|robots\\.txt";

/* Leading char must be an attribute/value boundary; this is what makes
   the rewrite idempotent and safe for absolute https URLs. */
const RX = new RegExp(
  `([\"'\\\`=(,\\s{\\\\]|^)\\/(${NAMESPACES})`,
  "g"
);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

if (!existsSafe(OUT_DIR)) {
  console.error(`[patch-pages] ${OUT_DIR} not found — run the export build first.`);
  process.exit(1);
}

function existsSafe(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

if (!BASE) {
  console.log(
    "[patch-pages] NEXT_PUBLIC_BASE_PATH unset — root-domain deployment, " +
      "nothing to prefix (no-op)"
  );
  process.exit(0);
}

let filesTouched = 0;
let totalReplaced = 0;

for (const file of walk(OUT_DIR)) {
  if (!TEXT_EXT.has(path.extname(file))) continue;
  const original = readFileSync(file, "utf8");
  let count = 0;
  const patched = original.replace(RX, (match, lead, ns) => {
    count += 1;
    return `${lead}${BASE}/${ns}`;
  });
  if (count > 0) {
    writeFileSync(file, patched);
    filesTouched += 1;
    totalReplaced += count;
    console.log(
      `[patch-pages] ${path.relative(OUT_DIR, file)}: ${count} URL(s) prefixed`
    );
  }
}

console.log(
  `[patch-pages] ✓ done — ${totalReplaced} URL(s) prefixed with ${BASE} ` +
    `across ${filesTouched} file(s) (idempotent: safe to re-run)`
);
