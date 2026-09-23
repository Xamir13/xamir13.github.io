"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  FolderOpen,
  Gauge,
  Tag,
} from "lucide-react";

import { Badge, Card } from "@/components/site/primitives";
import { TiltCard } from "@/components/site/tilt-card";
import { useLang } from "@/lib/lang";
import { withBase } from "@/lib/paths";
import {
  postCategory,
  postDate,
  postExcerpt,
  postLevel,
  postReadingTime,
  postTags,
  postTitle,
} from "@/lib/blog-i18n";
import { blogPosts } from "@/lib/site-data";
import { ViewCounter } from "@/components/site/view-counter";

/* ====================================================================
   BLOG ARTICLE CHROME — client islands for the (server-rendered)
   article route. The markdown BODY stays server-rendered authored
   content; every piece of UI chrome around it — back link, title,
   meta row, tags, related posts, prev/next navigation, footer note —
   lives here so English mode renders fully English.
   ==================================================================== */

export function ArticleBackLink() {
  const { t } = useLang();
  return (
    <Link
      href="/blog"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors print:hidden"
    >
      <ArrowRight className="h-4 w-4 rtl:rotate-0" />
      {t("article.back")}
    </Link>
  );
}

export function ArticleTitle({ slug }: { slug: string }) {
  const { lang } = useLang();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return (
    <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
      {postTitle(post, lang)}
    </h1>
  );
}

export function ArticleMeta({ slug }: { slug: string }) {
  const { lang, t } = useLang();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4" />
        {postDate(post, lang)}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock3 className="h-4 w-4" />
        {postReadingTime(post, lang)}
      </span>
      <span className="flex items-center gap-1.5">
        <FolderOpen className="h-4 w-4" />
        {postCategory(post, lang)}
      </span>
      <span className="flex items-center gap-1.5">
        <Gauge className="h-4 w-4" />
        {t("article.level")} {postLevel(post, lang)}
      </span>
      <ViewCounter slug={post.slug} />
    </div>
  );
}

export function ArticleTags({ slug }: { slug: string }) {
  const { lang } = useLang();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="h-4 w-4 text-muted-foreground" />
      {postTags(post, lang).map((tag) => (
        <Badge key={tag}>{tag}</Badge>
      ))}
    </div>
  );
}

export function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const { lang, t } = useLang();
  const current = blogPosts.find((p) => p.slug === currentSlug);
  if (!current) return null;

  const others = blogPosts.filter((p) => p.slug !== currentSlug);
  if (others.length === 0) return null;

  // Primary: posts sharing tags. Fallback: most recent posts.
  const bySharedTags = others
    .map((p) => ({
      post: p,
      shared: p.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .filter((r) => r.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .map((r) => r.post);

  const related =
    bySharedTags.length > 0 ? bySharedTags.slice(0, 2) : others.slice(0, 2);
  const ArrowIcon = lang === "fa" ? ArrowLeft : ArrowRight;

  return (
    <section className="mt-14 print:hidden" aria-label={t("article.relatedAria")}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {bySharedTags.length > 0 ? t("article.related") : t("article.keepReading")}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <TiltCard className="h-full" lightClassName="rounded-lg">
              <Card className="h-full transition-all duration-200 bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30">
                <div className="space-y-1.5 p-5 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold tracking-tight text-base group-hover:text-primary transition-colors">
                      {postTitle(post, lang)}
                    </h3>
                    <ArrowIcon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {postExcerpt(post, lang)}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {postDate(post, lang)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {postReadingTime(post, lang)}
                    </span>
                  </div>
                </div>
              </Card>
            </TiltCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function PostNav({ currentSlug }: { currentSlug: string }) {
  const { lang, t } = useLang();
  const index = blogPosts.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return null;

  // blogPosts is ordered newest → oldest.
  const newer = index > 0 ? blogPosts[index - 1] : null;
  const older =
    index < blogPosts.length - 1 ? blogPosts[index + 1] : null;
  if (!newer && !older) return null;

  const OlderIcon = lang === "fa" ? ArrowRight : ArrowLeft;
  const NewerIcon = lang === "fa" ? ArrowLeft : ArrowRight;

  return (
    <nav
      className="mt-10 grid gap-3 sm:grid-cols-2 print:hidden"
      aria-label={t("article.navAria")}
    >
      {older ? (
        <Link
          href={`/blog/${older.slug}`}
          className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          <TiltCard className="h-full" lightClassName="rounded-lg">
            <Card className="h-full transition-all duration-200 bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30">
              <div className="p-5 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <OlderIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("article.older")}
                </span>
                <span className="text-sm font-semibold leading-6 tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {postTitle(older, lang)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {postDate(older, lang)}
                </span>
              </div>
            </Card>
          </TiltCard>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {newer ? (
        <Link
          href={`/blog/${newer.slug}`}
          className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          <TiltCard className="h-full" lightClassName="rounded-lg">
            <Card className="h-full transition-all duration-200 bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30">
              <div className="p-5 flex flex-col gap-2 sm:text-end">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex-row-reverse sm:self-end">
                  {t("article.newer")}
                  <NewerIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold leading-6 tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {postTitle(newer, lang)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {postDate(newer, lang)}
                </span>
              </div>
            </Card>
          </TiltCard>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}

export function ArticleFooterNote() {
  const { t } = useLang();
  return (
    <footer className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6">
      <p className="text-sm text-muted-foreground">
        {t("article.ask")}{" "}
        <a href={withBase("/#contact")} className="text-primary hover:underline font-medium">
          {t("article.contactForm")}
        </a>{" "}
        {t("article.askEnd")}
      </p>
      <Link
        href="/blog"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors print:hidden"
      >
        <ArrowRight className="h-4 w-4 rtl:rotate-0" />
        {t("article.all")}
      </Link>
    </footer>
  );
}
