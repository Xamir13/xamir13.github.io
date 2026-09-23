import type { Lang } from "@/lib/lang";
import type { BlogPost } from "@/lib/site-data";

/* ====================================================================
   BLOG I18N — language-aware post metadata

   Post *bodies* are authored Persian long-form content and stay as
   written. Everything the reader SEES around and about a post —
   title, excerpt, category, level, tags, date, reading time — is
   resolved through this module so English mode renders fully English.

   Design notes:
   • Category / level / tag EN values live in central maps (single
     source of truth) instead of 30 per-post edits; unknown values
     fall back to themselves (they are usually already Latin).
   • Dates are formatted from dateISO with Intl (Jalali for fa,
     Gregorian for en) so both languages always agree with machine
     dates (RSS / JSON-LD).
   • Reading time is parsed from the stored Persian display string
     ("۸ دقیقه مطالعه") and re-rendered per language.
   • Every helper is pure and takes `lang` explicitly, so both client
     components and server code can use them.
   ==================================================================== */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Parse digits that may be Persian or Latin into a JS number. */
export function parseNumeric(text: string): number {
  const normalized = text.replace(
    /[۰-۹]/g,
    (d) => String(FA_DIGITS.indexOf(d))
  );
  const match = normalized.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/** 5 → "۵" (fa) or "5" (en). */
export function fmtNum(n: number, lang: Lang): string {
  return lang === "fa"
    ? new Intl.NumberFormat("fa-IR").format(n)
    : String(n);
}

/* ------------------------------------------------------------------ */
/* Category / level / tag dictionaries                                 */
/* ------------------------------------------------------------------ */

const CATEGORY_EN: Record<string, string> = {
  "هوش مصنوعی و برنامه‌نویسی": "AI & Programming",
  "مهندسی نرم‌افزار": "Software Engineering",
  "مسیر برنامه‌نویسی": "The Coding Journey",
  "ابزارهای توسعه": "Development Tools",
  "امنیت": "Security",
  "مهارت‌های برنامه‌نویسی": "Programming Skills",
  "آینده برنامه‌نویسی": "Future of Programming",
  "هوش مصنوعی": "AI",
  "AI و کیفیت": "AI & Quality",
  "امنیت وب": "Web Security",
  "Flask و امنیت": "Flask & Security",
  "Git و GitHub": "Git & GitHub",
};

const LEVEL_EN: Record<string, string> = {
  "متوسط تا پیشرفته": "Intermediate to advanced",
  "متوسط": "Intermediate",
  "پیشرفته": "Advanced",
  "همه سطوح": "All levels",
};

const TAG_EN: Record<string, string> = {
  "برنامه‌نویسی": "Programming",
  "آینده برنامه‌نویسی": "Future of Programming",
  "توسعه وب": "Web Development",
  "پروژه": "Projects",
  "یادگیری برنامه‌نویسی": "Learning to Code",
  "کیفیت نرم‌افزار": "Software Quality",
  "بهینه‌سازی": "Optimization",
  "استانداردهای وب": "Web Standards",
  "امنیت وب": "Web Security",
  "امنیت": "Security",
  "متن‌باز": "Open Source",
  "چک‌لیست": "Checklist",
  "هوش مصنوعی": "AI",
};

/* ------------------------------------------------------------------ */
/* Field resolvers                                                     */
/* ------------------------------------------------------------------ */

export function postTitle(post: BlogPost, lang: Lang): string {
  return lang === "en" && post.titleEn ? post.titleEn : post.title;
}

export function postExcerpt(post: BlogPost, lang: Lang): string {
  return lang === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
}

export function postCategory(post: BlogPost, lang: Lang): string {
  if (lang !== "en") return post.category;
  return CATEGORY_EN[post.category] ?? post.category;
}

export function postLevel(post: BlogPost, lang: Lang): string {
  if (lang !== "en") return post.level;
  return LEVEL_EN[post.level] ?? post.level;
}

export function postTags(post: BlogPost, lang: Lang): string[] {
  if (lang !== "en") return post.tags;
  return post.tags.map((tag) => TAG_EN[tag] ?? tag);
}

/** Translate a raw category key (for filter chips). */
export function translateCategory(category: string, lang: Lang): string {
  if (lang !== "en") return category;
  return CATEGORY_EN[category] ?? category;
}

/** Translate a raw tag key (for filter chips). */
export function translateTag(tag: string, lang: Lang): string {
  if (lang !== "en") return tag;
  return TAG_EN[tag] ?? tag;
}

/** "۱۲ شهریور ۱۴۰۵" (fa) / "Sep 3, 2026" (en) — always from dateISO. */
export function postDate(post: BlogPost, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(
      lang === "fa" ? "fa-IR" : "en-US",
      { dateStyle: "long" }
    ).format(new Date(post.dateISO));
  } catch {
    return lang === "en" ? post.dateISO : post.date;
  }
}

/** "۸ دقیقه مطالعه" (fa) / "8 min read" (en). */
export function postReadingTime(post: BlogPost, lang: Lang): string {
  const minutes = parseNumeric(post.readingTime);
  return lang === "fa"
    ? `${fmtNum(minutes, "fa")} دقیقه مطالعه`
    : `${minutes || 8} min read`;
}

/** Views line: "۱٬۲۳۴ بازدید" / "1,234 views". */
export function viewsLine(views: number, lang: Lang): string {
  const n =
    lang === "fa"
      ? new Intl.NumberFormat("fa-IR").format(views)
      : new Intl.NumberFormat("en-US").format(views);
  return lang === "fa" ? `${n} بازدید` : `${n} views`;
}

/**
 * True when the post matches the search query in EITHER language —
 * so an English visitor can find a post by its Persian tag too.
 */
export function postMatchesQuery(post: BlogPost, q: string): boolean {
  if (!q) return true;
  return (
    post.title.includes(q) ||
    post.excerpt.includes(q) ||
    post.category.includes(q) ||
    post.tags.some((t) => t.includes(q)) ||
    (post.titleEn ? post.titleEn.toLowerCase().includes(q.toLowerCase()) : false) ||
    (post.excerptEn ? post.excerptEn.toLowerCase().includes(q.toLowerCase()) : false) ||
    (CATEGORY_EN[post.category] ?? "").toLowerCase().includes(q.toLowerCase()) ||
    post.tags.some((t) => (TAG_EN[t] ?? "").toLowerCase().includes(q.toLowerCase()))
  );
}
