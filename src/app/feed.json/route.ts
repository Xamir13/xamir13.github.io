import { blogPosts } from "@/lib/site-data";

/** Content is fully static (site-data only) — rendered once at build time. */
export const dynamic = "force-static";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/**
 * JSON Feed 1.1 (https://jsonfeed.org/version/1.1) — a modern companion to
 * the RSS 2.0 feed at /feed.xml. Same content, JSON consumers preferred.
 */
export async function GET() {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "بلاگ امیرعلی طاهری",
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description:
      "نوشته‌هایی درباره‌ی توسعه‌ی وب فارسی؛ Next.js، کارایی، فونت و معماری.",
    language: "fa",
    authors: [{ name: "امیرعلی طاهری", url: SITE_URL }],
    items: blogPosts.map((post) => ({
      id: `${SITE_URL}/blog/${post.slug}`,
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      summary: post.excerpt,
      content_text: post.content,
      date_published: `${post.dateISO}T12:00:00+03:30`,
      tags: [post.category, ...post.tags],
      language: "fa",
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
