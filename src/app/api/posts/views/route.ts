import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/site-data";

/* Rendered once at build time under static export; live per-request on
   server deployments (Next 15+ leaves GET handlers uncached by default). */
export const dynamic = "force-static";

/* GitHub Pages static export builds run without a database — the guard
   keeps the build deterministic by baking zero counts. */
const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/** Batch view counts for all known posts: { [slug]: count } */
export async function GET() {
  if (STATIC_EXPORT) {
    const views: Record<string, number> = {};
    for (const post of blogPosts) views[post.slug] = 0;
    return NextResponse.json({ views });
  }
  try {
    const slugs = blogPosts.map((p) => p.slug);
    const rows = await db.postView.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true, count: true },
    });

    const views: Record<string, number> = {};
    for (const slug of slugs) views[slug] = 0;
    for (const row of rows) views[row.slug] = row.count;

    return NextResponse.json({ views });
  } catch (error) {
    console.error("[post-views] failed:", error);
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}
