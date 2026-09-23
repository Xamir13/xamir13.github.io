#!/usr/bin/env bash
# ============================================================================
# Publish the Xamir portfolio to GitHub Pages.
#
#   GITHUB_TOKEN=ghp_xxxx  bash scripts/publish-to-github.sh
#
# Creates a CLEAN snapshot of the current working tree in /tmp (no .git
# history, no sandbox/QA artifacts, no .env, no delivery ZIPs) and pushes it
# as a single commit to the `main` branch of
#   https://github.com/Xamir13/xamir13.github.io  (renamed from
#   azazamir139-glitch/xamircode.github.io — same repository, GitHub redirect)
#
# The token is used ONLY for this one push command; it is never written to
# disk or to any git remote configuration.
#
# GitHub Pages is then deployed automatically by
# .github/workflows/deploy-pages.yml (push → build → deploy).
# ============================================================================
set -euo pipefail

REPO_SLUG="Xamir13/xamir13.github.io"
SNAPSHOT="/tmp/xamir-ghp-publish"
BRANCH="main"

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN (a classic PAT with repo scope, or a fine-grained token with Contents: read+write on ${REPO_SLUG})}"

cd "$(dirname "$0")/.."
ROOT="$(pwd)"

echo "==> Building clean snapshot from ${ROOT}"
rm -rf "$SNAPSHOT"
mkdir -p "$SNAPSHOT"

rsync -a \
  --exclude '.git' \
  --exclude '.gitignore' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.next-export' \
  --exclude 'out' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env*.local' \
  --exclude 'db' \
  --exclude 'skills' \
  --exclude 'tool-results' \
  --exclude 'download' \
  --exclude 'upload' \
  --exclude 'tests' \
  --exclude 'test' \
  --exclude 'prompt' \
  --exclude '.zscripts' \
  --exclude '.claude' \
  --exclude '.z-ai-config' \
  --exclude 'Caddyfile' \
  --exclude 'dev.log' \
  --exclude 'server.log' \
  --exclude 'dev.out.log' \
  --exclude '*.tsbuildinfo' \
  --exclude 'next-env.d.ts' \
  --exclude 'qa*.png' \
  --exclude 'xamir-portfolio-*.zip' \
  --exclude '__pycache__' \
  --exclude 'worklog.md' \
  --exclude 'examples' \
  --exclude 'mini-services' \
  "$ROOT"/ "$SNAPSHOT"/

# ---- guard rails: abort if anything private/artifactory slipped in --------
echo "==> Guard rails"
for bad in ".env" "db" "download" "upload" "tool-results" "skills" ".zscripts" \
           "Caddyfile" "dev.log" "server.log" "worklog.md" "examples" "mini-services"; do
  if [ -e "$SNAPSHOT/$bad" ]; then
    echo "FATAL: forbidden path present in snapshot: $bad" >&2
    exit 1
  fi
done
if ls "$SNAPSHOT"/qa*.png >/dev/null 2>&1; then
  echo "FATAL: qa screenshots present in snapshot" >&2
  exit 1
fi
if ls "$SNAPSHOT"/public/xamir-portfolio-*.zip >/dev/null 2>&1; then
  echo "FATAL: delivery ZIPs present in snapshot" >&2
  exit 1
fi
if [ ! -f "$SNAPSHOT/.github/workflows/deploy-pages.yml" ]; then
  echo "FATAL: deployment workflow missing from snapshot" >&2
  exit 1
fi
if [ ! -f "$SNAPSHOT/scripts/build-pages.mjs" ]; then
  echo "FATAL: export build script missing from snapshot" >&2
  exit 1
fi

echo "==> Snapshot contents: $(du -sh "$SNAPSHOT" | cut -f1), $(find "$SNAPSHOT" -type f | wc -l) files"

# ---- commit + push ---------------------------------------------------------
cd "$SNAPSHOT"
git init -q -b "$BRANCH"
git add -A
git -c user.name="Xamir Deploy" -c user.email="deploy@users.noreply.github.com" \
  commit -q -m "Xamir portfolio — static export for GitHub Pages

- Next.js 16 static export (output:export, root user site — no basePath)
- scripts/build-pages.mjs: export build with temporary API-route relocation
  (server routes stay in the repo, restored after every build)
- scripts/patch-github-pages-assets.mjs: idempotent sub-path asset patcher
- .github/workflows/deploy-pages.yml: Actions-based Pages deployment"
echo "==> Pushing snapshot to ${REPO_SLUG} (${BRANCH})"
git push -q "https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO_SLUG}.git" \
  "HEAD:refs/heads/${BRANCH}"

echo "==> ✓ Pushed."
echo "    Actions will now build + deploy:  https://github.com/${REPO_SLUG}/actions"
echo "    Site (after the first workflow run):"
echo "    https://xamir13.github.io/"
