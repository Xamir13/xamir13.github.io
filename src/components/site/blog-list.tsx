"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  FerrisWheel,
  FolderOpen,
  Search,
  Tag,
  X,
} from "lucide-react";

import {
  SectionIndicator,
  SectionTitle,
} from "@/components/site/section-indicator";
import { Badge, Card } from "@/components/site/primitives";
import { TiltCard } from "@/components/site/tilt-card";
import { blogPosts } from "@/lib/site-data";
import {
  fmtNum,
  postCategory,
  postDate,
  postExcerpt,
  postReadingTime,
  postMatchesQuery,
  postTags,
  postTitle,
  translateCategory,
  translateTag,
  viewsLine,
} from "@/lib/blog-i18n";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/** Unique tag list in order of first appearance (raw keys = URL params). */
const allTags = [...new Set(blogPosts.flatMap((p) => p.tags))];
/** Unique category list in order of first appearance (raw keys = URL params). */
const allCategories = [...new Set(blogPosts.map((p) => p.category))];

const chipBase =
  "rounded-full border px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const chipActive = "border-primary/50 bg-primary/10 text-primary shadow-sm";
const chipIdle =
  "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground";

export function BlogList() {
  const { lang, t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---- URL-synced filter state (?category=&tag= are the single truth) ----
     The URL stores the RAW (language-independent) category/tag keys so a
     filter keeps working across a language switch; only the DISPLAY text
     is translated. */
  const rawCategory = searchParams.get("category");
  const rawTag = searchParams.get("tag");
  /* Unknown values (stale bookmarks) degrade to "no filter" instead of an empty page. */
  const activeCategory =
    rawCategory && allCategories.includes(rawCategory) ? rawCategory : null;
  const activeTag = rawTag && allTags.includes(rawTag) ? rawTag : null;

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
  };

  /* ---- Live search: local state filters instantly (IME-friendly), ----
     while ?q= in the URL follows after a short debounce so searches are
     shareable. External URL changes (back/forward/deep-link) sync back. */
  const rawQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(rawQuery);
  const [lastPushedQuery, setLastPushedQuery] = useState(rawQuery);

  /* Adopt external URL changes during render (the React-endorsed pattern
     instead of a setState-in-effect): browser back/forward, shared links. */
  if (rawQuery !== lastPushedQuery) {
    setLastPushedQuery(rawQuery);
    if (query !== rawQuery) setQuery(rawQuery);
  }

  const pushQueryToUrl = useCallback(
    (value: string | null) => {
      /* Read from window.location so a concurrently-changed ?category/?tag
         (set moments earlier by another handler) is never lost. */
      const params = new URLSearchParams(window.location.search);
      if (value) params.set("q", value);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    },
    [router]
  );

  /* Debounced push: typing pauses 350ms → URL updates. Keeps IME composition
     and rapid typing from thrashing history state. */
  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = query.trim();
      if (normalized !== lastPushedQuery) {
        pushQueryToUrl(normalized || null);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, lastPushedQuery, pushQueryToUrl]);

  /* ---- Decorative view counts ---- */
  const [views, setViews] = useState<Record<string, number>>({});

  useEffect(() => {
    /* Static export (GitHub Pages): the view-count API is not served —
       skip the request instead of logging a 404 on every visit. */
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "1") return;
    let cancelled = false;
    fetch("/api/posts/views")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { views?: Record<string, number> } | null) => {
        if (!cancelled && json?.views) setViews(json.views);
      })
      .catch(() => {
        /* silent — counts are decorative */
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    return blogPosts.filter(
      (p) =>
        (!activeTag || p.tags.includes(activeTag)) &&
        (!activeCategory || p.category === activeCategory) &&
        /* Search matches Persian AND English fields in both languages. */
        postMatchesQuery(p, q)
    );
  }, [activeTag, activeCategory, query]);

  const hasActiveFilters = Boolean(activeTag || activeCategory || query.trim());
  const clearAll = () => {
    setQuery("");
    if (activeCategory) setParam("category", null);
    if (activeTag) setParam("tag", null);
    /* ?q= is dropped by the debounced push effect above. */
  };

  const ArrowIcon = lang === "fa" ? ArrowLeft : ArrowRight;

  return (
    <section id="blog" className="scroll-mt-24 pt-16 md:pt-24 pb-8 md:pb-16">
      <div className="flex flex-row gap-3 md:gap-6 items-stretch min-h-0">
        <SectionIndicator icon={FerrisWheel} iconSize={28} theme="primary" />
        <div className="flex flex-col gap-3 md:gap-5 min-w-0 flex-1 pb-1">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SectionTitle text={t("blog.title")} theme="primary" />
              {/* Live result counter */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                aria-live="polite"
              >
                {fmtNum(filtered.length, lang)} {t("blog.posts")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("blog.subtitle")}
            </p>

            {/* Live search box */}
            <div className="relative pt-3 max-w-md">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("blog.searchPh")}
                aria-label={t("blog.searchAria")}
                className={cn(
                  "w-full rounded-full border border-border/60 bg-card py-2 pe-9 ps-9 text-sm shadow-sm outline-none",
                  "placeholder:text-muted-foreground/70",
                  "focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring",
                  "transition-colors"
                )}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t("blog.clearSearch")}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category filter chips */}
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label={t("blog.filterCategoriesAria")}
            >
              <span className="me-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                {t("blog.categories")}
              </span>
              <button
                type="button"
                onClick={() => setParam("category", null)}
                aria-pressed={activeCategory === null}
                className={cn(
                  chipBase,
                  activeCategory === null ? chipActive : chipIdle
                )}
              >
                {t("blog.all")}
              </button>
              {allCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setParam(
                      "category",
                      activeCategory === category ? null : category
                    )
                  }
                  aria-pressed={activeCategory === category}
                  className={cn(
                    chipBase,
                    activeCategory === category ? chipActive : chipIdle
                  )}
                >
                  {translateCategory(category, lang)}
                </button>
              ))}
            </div>

            {/* Tag filter chips */}
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label={t("blog.filterTagsAria")}
            >
              <span className="me-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                {t("blog.tagsLabel")}
              </span>
              <button
                type="button"
                onClick={() => setParam("tag", null)}
                aria-pressed={activeTag === null}
                className={cn(chipBase, activeTag === null ? chipActive : chipIdle)}
              >
                {t("blog.all")}
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setParam("tag", activeTag === tag ? null : tag)}
                  aria-pressed={activeTag === tag}
                  className={cn(chipBase, activeTag === tag ? chipActive : chipIdle)}
                >
                  {translateTag(tag, lang)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap w-full gap-2 pt-2">
              {filtered.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block w-full max-w-[500px] group"
                >
                  <TiltCard className="w-full" lightClassName="rounded-lg">
                    <Card className="w-full transition-all duration-200 bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30">
                      <div className="space-y-1.5 p-6 flex flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold tracking-tight text-xl group-hover:text-primary transition-colors">
                            {postTitle(post, lang)}
                          </h3>
                          <span
                            className="text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all cursor-pointer"
                            aria-label={`${t("blog.read")} ${postTitle(post, lang)}`}
                          >
                            <ArrowIcon className="h-4 w-4 rtl:rotate-0" />
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {postTags(post, lang).map((tag) => (
                            <Badge
                              key={tag}
                              className={cn(
                                "transition-colors",
                                activeTag &&
                                  translateTag(activeTag, lang) === tag &&
                                  "border-primary/50 bg-primary/10 text-primary"
                              )}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 pt-0 space-y-3">
                        <p className="text-sm text-foreground/90">
                          {postExcerpt(post, lang)}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {postDate(post, lang)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            {postReadingTime(post, lang)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FolderOpen className="h-3.5 w-3.5" />
                            {postCategory(post, lang)}
                          </span>
                          {typeof views[post.slug] === "number" &&
                            views[post.slug] > 0 && (
                              <span className="flex items-center gap-1.5">
                                <Eye className="h-3.5 w-3.5" />
                                {viewsLine(views[post.slug], lang)}
                              </span>
                            )}
                        </div>
                      </div>
                    </Card>
                  </TiltCard>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-start gap-2 pt-4">
                <p className="text-sm text-muted-foreground">
                  {t("blog.empty")}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className={cn(chipBase, chipIdle, "hover:border-primary/40")}
                  >
                    {t("blog.clearFilters")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
