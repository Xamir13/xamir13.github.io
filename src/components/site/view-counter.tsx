"use client";

import * as React from "react";
import { Eye } from "lucide-react";

import { useLang } from "@/lib/lang";
import { viewsLine } from "@/lib/blog-i18n";

export function ViewCounter({ slug }: { slug: string }) {
  const { lang } = useLang();
  const [views, setViews] = React.useState<number | null>(null);

  React.useEffect(() => {
    const key = `post-viewed:${slug}`;
    let cancelled = false;

    const count = async () => {
      /* Static export (GitHub Pages): no view-count API exists — the
         counter simply stays hidden, exactly like a failed fetch. */
      if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "1") return;
      try {
        // Count one view per browser session per post.
        const already = sessionStorage.getItem(key);
        const res = await fetch(`/api/posts/${encodeURIComponent(slug)}/view`, {
          method: already ? "GET" : "POST",
        });
        if (!res.ok) return;
        const json = (await res.json()) as { views?: number };
        if (!cancelled && typeof json.views === "number") {
          setViews(json.views);
          sessionStorage.setItem(key, "1");
        }
      } catch {
        // Silent — view counting must never break the page.
      }
    };
    count();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="flex items-center gap-1.5">
      <Eye className="h-4 w-4" />
      {viewsLine(views, lang)}
    </span>
  );
}
