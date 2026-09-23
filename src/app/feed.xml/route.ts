import { blogPosts } from "@/lib/site-data";
import { shortHash } from "@/lib/utils";

/** Content is fully static (site-data only) — rendered once at build time. */
export const dynamic = "force-static";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const faLongDate = (dateISO: string) =>
  new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(
    new Date(dateISO)
  );

/** Same preview generator article pages use — RSS readers get a thumbnail. */
const ogImageFor = (post: (typeof blogPosts)[number]) => {
  const params = new URLSearchParams({
    title: post.title,
    chip: post.category,
    date: faLongDate(post.dateISO),
    v: shortHash(`${post.title}|${post.category}|${post.dateISO}`),
  });
  return `${SITE_URL}/api/og?${params.toString()}`;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = blogPosts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <enclosure url="${escapeXml(ogImageFor(post))}" type="image/png" length="0" />
      <category>${escapeXml(post.category)}</category>
${post.tags
  .map((tag) => `      <category>${escapeXml(tag)}</category>`)
  .join("\n")}
      <pubDate>${new Date(`${post.dateISO}T12:00:00+03:30`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>بلاگ امیرعلی طاهری</title>
    <link>${SITE_URL}</link>
    <description>نوشته‌هایی درباره‌ی توسعه‌ی وب فارسی؛ Next.js، کارایی، فونت و معماری.</description>
    <language>fa</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
