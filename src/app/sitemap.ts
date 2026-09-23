import type { MetadataRoute } from "next";

import { blogPosts, projects } from "@/lib/site-data";

/** Required for static export — the sitemap is fully build-time data. */
export const dynamic = "force-static";

/* Deployments override this via NEXT_PUBLIC_SITE_URL (e.g. the GitHub
   Pages URL); local development keeps the production domain default. */
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://amirali-taheri.ir"
).replace(/\/$/, "");

/** Newest post date keeps the high-traffic routes' lastmod honest. */
const newestPostDate = blogPosts.reduce((latest, post) => {
  const d = new Date(`${post.dateISO}T12:00:00+03:30`);
  return d > latest ? d : latest;
}, new Date(0));

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: newestPostDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${BASE_URL}/resume`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.dateISO}T12:00:00+03:30`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
