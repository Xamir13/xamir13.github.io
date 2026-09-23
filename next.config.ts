import type { NextConfig } from "next";

/* -------------------------------------------------------------------------- */
/* GitHub Pages static-export mode                                            */
/*                                                                            */
/* Local development (and the sandbox `standalone` production build) stays     */
/* EXACTLY as before. The export configuration only activates when the         */
/* deployment workflow sets DEPLOY_TARGET=github-pages, so `next dev` and      */
/* `bun run build` keep their current behavior.                                */
/*                                                                            */
/* GitHub Pages project sites are served from a repository sub-path:           */
/*   https://azazamir139-glitch.github.io/xamircode.github.io/                 */
/* hence basePath/assetPrefix + trailingSlash (GH Pages needs directory        */
/* URLs like /blog/ to resolve to /blog/index.html).                           */
/* -------------------------------------------------------------------------- */
const IS_GH_PAGES = process.env.DEPLOY_TARGET === "github-pages";
const GH_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH || "/xamircode.github.io";

const sharedConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  /* Native skia binary for /api/og (social preview images) must stay
     external — Turbopack cannot bundle .node addons. */
  serverExternalPackages: ["@napi-rs/canvas"],
};

const nextConfig: NextConfig = IS_GH_PAGES
  ? {
      ...sharedConfig,
      output: "export",
      basePath: GH_BASE_PATH,
      assetPrefix: GH_BASE_PATH,
      trailingSlash: true,
      /* GitHub Pages cannot run the image optimization service. */
      images: { unoptimized: true },
      /* Build into a separate directory so a concurrently running dev
         server (which owns .next) is never disturbed by an export build. */
      distDir: ".next-export",
    }
  : {
      ...sharedConfig,
      output: "standalone",
    };

export default nextConfig;
