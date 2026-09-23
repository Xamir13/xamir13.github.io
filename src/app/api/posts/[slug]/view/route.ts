import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/site-data";

/* View counting is a live-server feature (GitHub Pages has no runtime):
   under static export nothing is prerendered for this route and the
   client-side view counter silently skips itself. */
export const dynamic = "force-static";

export function generateStaticParams() {
  return [];
}

const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (STATIC_EXPORT) {
    return NextResponse.json({ views: 0 });
  }
  try {
    const { slug } = await params;
    if (!blogPosts.some((post) => post.slug === slug)) {
      return NextResponse.json({ error: "نوشته پیدا نشد." }, { status: 404 });
    }
    const view = await db.postView.findUnique({ where: { slug } });
    return NextResponse.json({ views: view?.count ?? 0 });
  } catch (error) {
    console.error("[post-view] failed:", error);
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (STATIC_EXPORT) {
    return NextResponse.json({ error: "Static build has no server runtime." }, { status: 503 });
  }
  try {
    const { slug } = await params;

    // Only count views for known posts — keeps the table clean.
    if (!blogPosts.some((post) => post.slug === slug)) {
      return NextResponse.json({ error: "نوشته پیدا نشد." }, { status: 404 });
    }

    const view = await db.postView.upsert({
      where: { slug },
      create: { slug, count: 1 },
      update: { count: { increment: 1 } },
    });

    return NextResponse.json({ views: view.count });
  } catch (error) {
    console.error("[post-view] failed:", error);
    return NextResponse.json(
      { error: "خطای سرور." },
      { status: 500 }
    );
  }
}
