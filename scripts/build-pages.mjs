#!/usr/bin/env node
/**
 * GitHub Pages static-export build orchestrator.
 *
 * `next build` with output:"export" can only ship build-time-static routes.
 * The portfolio intentionally keeps real server code (contact SMTP API,
 * admin inbox, view counters, OG image, resume PDF) that GitHub Pages
 * cannot host. Per project policy that source is NEVER deleted, rewritten
 * or permanently moved — so this script:
 *
 *   1. temporarily renames src/app/api → src/app/_api_pages_hold
 *      (underscore-prefixed folders are ignored by the Next.js router,
 *      and nothing else imports those route handlers),
 *   2. runs `next build` with the GitHub Pages environment (export mode;
 *      root user site https://xamir13.github.io/ — no basePath),
 *   3. restores src/app/api in ALL cases — success, failure or signal,
 *   4. normalizes the export output to out/ (regardless of distDir) and
 *      strips delivery-only artifacts that must not be deployed.
 *
 * Exit code mirrors the `next build` exit code.
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  renameSync,
  rmSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiDir = path.join(root, "src", "app", "api");
const holdDir = path.join(root, "src", "app", "_api_pages_hold");

const NEXT_BIN = path.join(root, "node_modules", ".bin", "next");
const DIST_DIR = ".next-export"; /* keep in sync with next.config.ts */
const OUT_DIR = path.join(root, "out");
/* Delivery artifacts from earlier tasks — downloadable from the sandbox
   site, never part of the deployed website. */
const STRIP_FROM_OUT = [
  "xamir-portfolio-full.zip",
  "xamir-portfolio-nextjs.zip",
];

const buildEnv = {
  ...process.env,
  DEPLOY_TARGET: "github-pages",
  /* Root user site (https://xamir13.github.io/) — NO sub-path. NEXT_PUBLIC_
     BASE_PATH is deliberately left UNSET so withBase() and next.config.ts
     keep every URL root-absolute (/css/…, /_next/…, /images/…, /fonts/…). */
  NEXT_PUBLIC_SITE_URL: "https://xamir13.github.io",
  /* metadataBase stays ORIGIN-only for the root deployment. */
  NEXT_PUBLIC_ORIGIN: "https://xamir13.github.io",
  NEXT_PUBLIC_STATIC_EXPORT: "1",
  NEXT_TELEMETRY_DISABLED: "1",
};

let restored = false;
function restoreApi() {
  if (!restored && existsSync(holdDir)) {
    renameSync(holdDir, apiDir);
    restored = true;
    console.log("[build-pages] src/app/api restored ✓");
  }
}

process.on("exit", restoreApi);
process.on("SIGINT", () => {
  restoreApi();
  process.exit(130);
});
process.on("SIGTERM", () => {
  restoreApi();
  process.exit(143);
});

/* --- 1. relocate the server-only route handlers out of the router ----- */
if (existsSync(holdDir)) {
  console.error(
    `[build-pages] ${holdDir} already exists — a previous build crashed.\n` +
      "              Restore it first:  mv src/app/_api_pages_hold src/app/api"
  );
  process.exit(1);
}
if (existsSync(apiDir)) {
  renameSync(apiDir, holdDir);
  console.log("[build-pages] src/app/api temporarily relocated (export build)");
}

/* --- 2. run the export build ------------------------------------------ */
let result;
try {
  result = spawnSync(NEXT_BIN, ["build"], {
    stdio: "inherit",
    env: buildEnv,
    cwd: root,
  });
} finally {
  restoreApi();
}

const exitCode = result?.status ?? 1;
if (exitCode !== 0) {
  console.error(`[build-pages] next build failed (exit ${exitCode})`);
  process.exit(exitCode);
}

/* --- 3. normalize the export output to out/ --------------------------- */
/* Next 16 with a custom distDir writes the export at the distDir root
   (.next-export/index.html); other layouts use <distDir>/out or out/.
   The FRESH export (in the distDir) always wins over a stale out/ left
   by a previous run. Always end up with a plain out/ at the root. */
const candidates = [
  path.join(root, DIST_DIR),
  path.join(root, DIST_DIR, "out"),
  OUT_DIR,
].filter((dir) => existsSync(path.join(dir, "index.html")));

if (candidates.length === 0) {
  console.error(
    "[build-pages] no static export output with index.html found " +
      `(expected out/, ${DIST_DIR}/ or ${DIST_DIR}/out/)`
  );
  process.exit(1);
}

const produced = candidates[0];
if (produced !== OUT_DIR) {
  rmSync(OUT_DIR, { recursive: true, force: true });
  cpSync(produced, OUT_DIR, { recursive: true });
  console.log(`[build-pages] export copied ${path.relative(root, produced)} → out/`);
}

/* --- 4. strip delivery-only artifacts from the deployable output ------ */
for (const name of STRIP_FROM_OUT) {
  const target = path.join(OUT_DIR, name);
  if (existsSync(target)) {
    rmSync(target);
    console.log(`[build-pages] stripped ${name} from out/`);
  }
}

console.log("[build-pages] ✓ static export ready in out/ (api/ restored, nothing deleted)");
