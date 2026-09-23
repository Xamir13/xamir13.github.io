/**
 * ====================================================================
 * TIGER AI — WEBSITE KNOWLEDGE LAYER
 * ====================================================================
 * Single source of truth: every fact the assistant knows about the
 * website comes from the SAME site-data.ts the site itself renders
 * from. Nothing is duplicated, nothing is invented — when a project,
 * article, skill or certificate is added/changed in site-data.ts and
 * the site is redeployed, the assistant's knowledge updates with it
 * automatically.
 *
 * Responsibilities:
 *   1. Topic routing — detect which website areas a user message is
 *      about (smart context selection: only relevant slices are put
 *      into the model's context, keeping prompts small and answers
 *      fast on small in-browser models).
 *   2. Context building — compact, labeled text slices of the real
 *      data for the system prompt.
 *   3. Link resolution — deterministic, REAL links (projects, blog
 *      articles, homepage sections) matched from the user's message,
 *      so the UI can attach clickable cards without trusting the
 *      model to emit URLs (small models would hallucinate them).
 * ====================================================================
 */

import {
  blogPosts,
  certifications,
  contactIntro,
  contactIntroEn,
  education,
  experience,
  funFacts,
  profile,
  projects,
  resumeLanguages,
  resumeSummary,
  resumeSummaryEn,
  services,
  skills,
  socials,
} from "@/lib/site-data";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type KnowledgeTopic =
  | "about"
  | "projects"
  | "skills"
  | "education"
  | "certificates"
  | "experience"
  | "services"
  | "blog"
  | "contact"
  | "resume";

export type LinkKind =
  | "project"
  | "article"
  | "section"
  | "page"
  | "external";

export type LinkCard = {
  href: string;
  label: string;
  hint: string;
  kind: LinkKind;
};

/* ------------------------------------------------------------------ */
/* Text helpers                                                       */
/* ------------------------------------------------------------------ */

/** Normalize Persian/English text for matching: lowercase, strip the
 *  zero-width non-joiner and Arabic diacritics, collapse whitespace. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u200c\u200f\u200e]/g, " ")
    .replace(/[\u064b-\u0652\u0670]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cut(s: string, max: number): string {
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max).trimEnd()}…`;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Topic keyword hit: Persian needles substring-match (≥3 chars, ZWNJ
 *  already normalized to spaces so suffixed forms still hit); Latin
 *  needles match on word boundaries so "post" never fires inside
 *  "possible". */
function topicHit(message: string, needle: string): boolean {
  const m = norm(message);
  const n = norm(needle);
  if (!n) return false;
  const first = n.charAt(0);
  const last = n.charAt(n.length - 1);
  if (/[a-z0-9]/.test(first) || /[a-z0-9]/.test(last)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(n)}([^a-z0-9]|$)`).test(m);
  }
  return n.length >= 3 && m.includes(n);
}

/* Genre/function words that must never trigger ENTITY matches (they
   describe what the user wants, not which real item they mean). */
const FA_STOP = new Set([
  "را", "رو", "و", "در", "به", "از", "که", "این", "آن", "چیست", "چیه", "چه", "هر", "هم",
  "با", "برای", "است", "هست", "بود", "بگو", "نشون", "نشانم", "بده", "لطفا", "سلام", "میشه",
  "میخوام", "میخواهم", "درباره", "مقاله", "پروژه", "سایت", "بلاگ", "یه", "یک", "هایی", "خب",
]);
const LATIN_STOP = new Set([
  "the", "and", "for", "what", "whats", "who", "his", "him", "her", "how", "why", "you", "your",
  "this", "that", "with", "from", "have", "has", "are", "was", "were", "did", "does", "show",
  "tell", "give", "list", "all", "can", "could", "would", "will", "use", "uses", "using",
  "know", "want", "need", "get", "any", "some", "more", "most", "please", "thanks", "hello",
  "about", "site", "website", "page", "post", "article", "blog", "project", "projects", "is",
  "it", "its", "of", "on", "in", "to", "he", "she", "they", "them", "there", "here",
]);

/** Entity matching: a real item matches when (a) the message contains
 *  the item's full field as a word-bounded phrase ("marshall store"),
 *  or (b) a meaningful message token appears inside one of the item's
 *  fields ("مارشال" ⊂ "فروشگاه آنلاین لوازم خانگی مارشال"). Stopwords
 *  and 1–2 char tokens are ignored — this is what keeps Persian
 *  morphology (پروژه/رو) from producing false hits. */
function entityMatches(message: string, fields: string[]): boolean {
  const m = norm(message);
  if (!m) return false;
  const padded = ` ${m} `;
  const msgTokens = m.split(" ").filter(Boolean);
  for (const raw of fields) {
    const f = norm(raw);
    if (!f) continue;
    /* Genre words (پروژه، مقاله، post، …) are never entities — even as
       full phrases. */
    if (FA_STOP.has(f) || LATIN_STOP.has(f)) continue;
    if (f.length >= 4 && padded.includes(` ${f} `)) return true;
    for (const t of msgTokens) {
      if (t.length < 3 || LATIN_STOP.has(t) || FA_STOP.has(t)) continue;
      if (f.includes(t)) return true;
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Topic routing                                                      */
/* ------------------------------------------------------------------ */

const TOPIC_KEYWORDS: Record<KnowledgeTopic, string[]> = {
  about: [
    "امیرعلی", "طاهری", "درباره من", "که هست", "کیست", "کیه", "معرفی", "بیو", "زندگی", "سنش", "چند سالشه",
    "amirali", "taheri", "about him", "about amirali", "about the site", "about the website",
    "about yourself", "who is", "introduce", "bio", "himself", "yourself", "his age",
  ],
  projects: [
    "پروژه", "کارها", "نمونه کار", "نمونه‌کار", "ساخته", "دمو", "madrese", "marshall", "حسابچی", "کوییزساز",
    "project", "work", "portfolio piece", "demo", "built", "apps",
  ],
  skills: [
    "مهارت", "تکنولوژی", "زبان برنامه", "فریمورک", "ابزار", "stack", "skill", "technolog",
    "framework", "tools", "languages does he",
  ],
  education: [
    "تحصیل", "مدرسه", "دانشگاه", "دوره", "آموزش", "کلاس", "spektor", "helsinki", "sabz",
    "education", "school", "study", "course", "university",
  ],
  certificates: [
    "گواهینامه", "گواهی نامه", "گواهی", "مدرک", "certificate", "certification", "credential", "elements of ai",
  ],
  experience: [
    "تجربه", "سابقه کار", "همکاری", "شرکت", "experience", "worked", "job", "career",
  ],
  services: [
    "خدمات", "خدمت", "سفارش", "service", "hire", "offer", "freelance", "what does he do",
  ],
  blog: [
    "بلاگ", "مقاله", "نوشته", "پست", "یادداشت", "وبلاگ", "مطلب", "blog", "article", "post", "wrote",
    "writing",
  ],
  contact: [
    "تماس", "ایمیل", "شماره", "تلفن", "ارتباط", "اینستاگرام", "تلگرام", "گیت‌هاب", "گیت هاب", "آدرس",
    "contact", "email", "phone", "reach", "social", "github", "instagram", "telegram",
  ],
  resume: [
    "رزومه", "cv", "resume",
  ],
};

export function detectTopics(message: string): KnowledgeTopic[] {
  const topics: KnowledgeTopic[] = [];
  (Object.keys(TOPIC_KEYWORDS) as KnowledgeTopic[]).forEach((topic) => {
    if (TOPIC_KEYWORDS[topic].some((k) => topicHit(message, k))) topics.push(topic);
  });
  return topics;
}

/* ------------------------------------------------------------------ */
/* Entity matching (real data only — no hardcoded entities)           */
/* ------------------------------------------------------------------ */

function projectMatchFields(p: (typeof projects)[number]): string[] {
  return [
    p.slug.replace(/-/g, " "),
    p.title,
    p.titleEn ?? "",
    ...(p.tags ?? []),
    ...(p.tagsEn ?? []),
    ...(p.techAll ?? []),
  ];
}

function blogMatchFields(b: (typeof blogPosts)[number]): string[] {
  return [
    b.slug.replace(/-/g, " "),
    b.title,
    b.titleEn ?? "",
    b.category,
    ...b.tags,
  ];
}

export function matchProjects(message: string) {
  return projects.filter((p) => entityMatches(message, projectMatchFields(p)));
}

export function matchBlogPosts(message: string) {
  return blogPosts.filter((b) => entityMatches(message, blogMatchFields(b)));
}

/* ------------------------------------------------------------------ */
/* Real link resolution (the UI renders these as clickable cards)      */
/* ------------------------------------------------------------------ */

const SECTION_LINKS: Record<string, { href: string; label: string; labelEn: string }> = {
  about: { href: "/#about", label: "بخش درباره من", labelEn: "About section" },
  projects: { href: "/#projects", label: "بخش پروژه‌ها", labelEn: "Projects section" },
  skills: { href: "/#skills", label: "بخش مهارت‌ها", labelEn: "Skills section" },
  education: { href: "/#education", label: "بخش تحصیلات", labelEn: "Education section" },
  certificates: { href: "/#certifications", label: "بخش گواهینامه‌ها", labelEn: "Certificates section" },
  experience: { href: "/#experience", label: "بخش تجربه‌ها", labelEn: "Experience section" },
  services: { href: "/#services", label: "بخش خدمات", labelEn: "Services section" },
  blog: { href: "/blog", label: "بلاگ", labelEn: "Blog" },
  contact: { href: "/#contact", label: "بخش تماس", labelEn: "Contact section" },
  resume: { href: "/resume", label: "صفحه رزومه", labelEn: "Résumé page" },
};

/** Deterministic link cards for a user message. Every href points to a
 *  REAL route of this website — nothing is invented, nothing relies on
 *  the model generating URLs. */
export function findRelatedLinks(
  message: string,
  lang: "fa" | "en"
): LinkCard[] {
  const links: LinkCard[] = [];
  const seen = new Set<string>();
  const push = (l: LinkCard) => {
    if (!seen.has(l.href) && links.length < 4) {
      seen.add(l.href);
      links.push(l);
    }
  };

  for (const p of matchProjects(message)) {
    push({
      href: `/projects/${p.slug}`,
      label: p.titleEn ?? p.title,
      hint: lang === "fa" ? "صفحه پروژه" : "Project page",
      kind: "project",
    });
  }
  for (const b of matchBlogPosts(message).slice(0, 2)) {
    push({
      href: `/blog/${b.slug}`,
      label: (lang === "en" && b.titleEn) || b.title,
      hint: lang === "fa" ? "مقاله بلاگ" : "Blog article",
      kind: "article",
    });
  }

  const topics = detectTopics(message);
  for (const topic of topics) {
    const s = SECTION_LINKS[topic];
    if (s) {
      push({
        href: s.href,
        label: lang === "en" ? s.labelEn : s.label,
        hint: lang === "fa" ? "بخش وب‌سایت" : "Website section",
        kind: s.href.startsWith("/#") ? "section" : "page",
      });
    }
  }

  return links.slice(0, 4);
}

/* ------------------------------------------------------------------ */
/* Context building (smart selection — only relevant slices)          */
/* ------------------------------------------------------------------ */

function projectDetailBlock(p: (typeof projects)[number]): string {
  const lines: string[] = [];
  lines.push(`name: ${p.title}${p.titleEn ? ` (${p.titleEn})` : ""}`);
  lines.push(`page: /projects/${p.slug}`);
  if (p.year) lines.push(`year: ${p.year}`);
  lines.push(`summary: ${cut(p.overview || p.description, 600)}`);
  if (p.features?.length) {
    lines.push(`features: ${p.features.slice(0, 8).map((f) => cut(f, 90)).join(" | ")}`);
  }
  if (p.techAll?.length) lines.push(`technologies: ${p.techAll.slice(0, 14).join(", ")}`);
  if (p.liveUrl) lines.push(`live url: ${p.liveUrl}`);
  if (p.githubUrl) lines.push(`github: ${p.githubUrl}`);
  if (p.goal) lines.push(`goal: ${cut(p.goal, 260)}`);
  if (p.team?.length) {
    lines.push(`team: ${p.team.map((t) => `${t.name} (${t.role})`).join(", ")}`);
  }
  return lines.join("\n");
}

function buildSlice(topic: KnowledgeTopic, message: string, lang: "fa" | "en"): string {
  switch (topic) {
    case "about": {
      const facts = funFacts
        .slice(0, 4)
        .map((f) => cut(lang === "en" ? f.textEn : f.text, 110));
      return [
        `[ABOUT]`,
        `full name: ${profile.fullName} (${profile.fullNameEn})`,
        `role: ${profile.role} (${profile.roleEn})`,
        `location: ${profile.location} (${profile.locationEn})`,
        `bio: ${lang === "en" ? profile.bioEn : profile.bio}`,
        `fun facts: ${facts.join(" | ")}`,
      ].join("\n");
    }
    case "projects": {
      const matched = matchProjects(message);
      if (matched.length === 1) {
        return `[PROJECT DETAIL]\n${projectDetailBlock(matched[0])}`;
      }
      const list = projects
        .map((p, i) => {
          const title = lang === "en" && p.titleEn ? p.titleEn : p.title;
          const desc = cut(lang === "en" && p.descriptionEn ? p.descriptionEn : p.description, 130);
          const tags = (lang === "en" && p.tagsEn ? p.tagsEn : p.tags).slice(0, 5).join(", ");
          return `${i + 1}) ${title} — page: /projects/${p.slug} — ${desc} [${tags}]`;
        })
        .join("\n");
      return `[PROJECTS — all real projects, ${projects.length} total]\n${list}`;
    }
    case "skills": {
      const list = skills
        .map((c) => {
          const title = lang === "en" ? c.titleEn : c.title;
          const items = c.skills
            .slice(0, 12)
            .map((s) => {
              const name = (lang === "en" && s.nameEn) || s.name;
              const level = (lang === "en" && s.levelEn) || s.level;
              return level ? `${name} (${level})` : name;
            })
            .join(", ");
          return `${title}: ${items}`;
        })
        .join("\n");
      return `[SKILLS & TECHNOLOGIES — real data]\n${list}`;
    }
    case "education": {
      const list = education
        .map((e, i) => {
          const degree = (lang === "en" && e.degreeEn) || e.degree;
          const school = (lang === "en" && e.schoolEn) || e.school || "";
          const status = (lang === "en" && e.statusEn) || e.status || "";
          const focus = e.focus || "";
          const desc = e.description || "";
          return `${i + 1}) ${degree}${school ? ` — ${school}` : ""}${e.period ? ` (${e.period})` : ""}${status ? ` — status: ${status}` : ""}${focus ? ` — focus: ${cut(focus, 120)}` : ""}${desc ? ` — ${cut(desc, 160)}` : ""}`;
        })
        .join("\n");
      return `[EDUCATION & COURSES — real data]\n${list}`;
    }
    case "certificates": {
      const list = certifications
        .map((c, i) => {
          const title = (lang === "en" && c.titleEn) || c.title;
          const date = (lang === "en" && c.dateEn) || c.date || "";
          const tags = (lang === "en" && c.tagsEn ? c.tagsEn : c.tags).slice(0, 4).join(", ");
          return `${i + 1}) ${title} — ${c.issuer}${date ? ` (${date})` : ""}${c.credentialId ? ` — ID: ${c.credentialId}` : ""}${tags ? ` [${tags}]` : ""}`;
        })
        .join("\n");
      return `[CERTIFICATES — real data, ${certifications.length} total]\n${list}`;
    }
    case "experience": {
      const list = experience
        .map((e, i) => {
          const role = (lang === "en" && e.roleEn) || e.role;
          const company = (lang === "en" && e.companyEn) || e.company;
          const period = (lang === "en" && e.periodEn) || e.period;
          const desc = cut((lang === "en" && e.descriptionEn) || e.description, 240);
          return `${i + 1}) ${role} @ ${company}${period ? ` (${period})` : ""} — ${desc}`;
        })
        .join("\n");
      return `[EXPERIENCE — real data]\n${list}`;
    }
    case "services": {
      const list = services
        .map((s, i) => `${i + 1}) ${lang === "en" ? s.titleEn : s.title} — ${cut(lang === "en" ? s.descriptionEn : s.description, 160)}`)
        .join("\n");
      return `[SERVICES — real data]\n${list}`;
    }
    case "blog": {
      const matched = matchBlogPosts(message);
      if (matched.length === 1) {
        const b = matched[0];
        return [
          `[BLOG ARTICLE — real content]`,
          `title: ${(lang === "en" && b.titleEn) || b.title}`,
          `page: /blog/${b.slug}`,
          `category: ${b.category} | level: ${b.level} | date: ${b.date} | reading time: ${b.readingTime}`,
          `excerpt: ${cut((lang === "en" && b.excerptEn) || b.excerpt, 240)}`,
          `content (abridged): ${cut(b.content, 1800)}`,
        ].join("\n");
      }
      const list = blogPosts
        .map((b, i) => {
          const title = (lang === "en" && b.titleEn) || b.title;
          const ex = cut((lang === "en" && b.excerptEn) || b.excerpt, 100);
          return `${i + 1}) ${title} — page: /blog/${b.slug} (${b.category}, ${b.date}) — ${ex}`;
        })
        .join("\n");
      return `[BLOG — all real articles, ${blogPosts.length} total]\n${list}`;
    }
    case "contact": {
      const social = socials
        .map((s) => `${lang === "en" ? s.nameEn : s.name}: ${s.url}`)
        .join(" | ");
      return [
        `[CONTACT — real data]`,
        `email: ${profile.email}`,
        `phone: ${profile.phone}`,
        `location: ${lang === "en" ? profile.locationEn : profile.location}`,
        `${social}`,
        `contact section on homepage: /#contact (has a working form)`,
        `intro: ${cut(lang === "en" ? contactIntroEn : contactIntro, 200)}`,
      ].join("\n");
    }
    case "resume": {
      const langs = resumeLanguages
        .map((l) => `${(lang === "en" && l.nameEn) || l.name} — ${(lang === "en" && l.levelEn) || l.level}`)
        .join(" | ");
      return [
        `[RESUME — real data]`,
        `page: /resume (view/download)`,
        `summary: ${cut(lang === "en" ? resumeSummaryEn : resumeSummary, 420)}`,
        `languages: ${langs}`,
      ].join("\n");
    }
    default:
      return "";
  }
}

/** Always-present minimal identity card, so even "general" answers stay
 *  grounded about who the site belongs to. */
function profileCard(lang: "fa" | "en"): string {
  return `[SITE OWNER] AmirAli Taheri (امیرعلی طاهری) — ${lang === "en" ? profile.roleEn : profile.role} from Isfahan, Iran. Personal portfolio website with sections: projects, skills & technologies, education, certificates, experience, services, fun facts, blog (articles at /blog), resume (/resume), contact.`;
}

/** Build the compact website context for a user message. When the user
 *  asked something general (no website topic detected), only the tiny
 *  identity card is included — the model answers from its own knowledge
 *  without dragging the whole portfolio into every request. */
export function buildWebsiteContext(message: string, lang: "fa" | "en"): string {
  const topics = detectTopics(message);
  if (topics.length === 0) return profileCard(lang);

  /* Cap the slice count so small models keep a tight, fast context. */
  const priority: KnowledgeTopic[] = ["about", "projects", "blog", "skills", "education", "certificates", "experience", "services", "contact", "resume"];
  const selected = priority.filter((t) => topics.includes(t)).slice(0, 3);

  const blocks = [profileCard(lang)];
  for (const t of selected) {
    const slice = buildSlice(t, message, lang);
    if (slice) blocks.push(slice);
  }
  return blocks.join("\n\n");
}

/* ------------------------------------------------------------------ */
/* Greeting + suggestions (content-accurate, bilingual)               */
/* ------------------------------------------------------------------ */

export function greetingFor(lang: "fa" | "en"): string {
  return lang === "fa"
    ? "سلام! 👋 من تایگر هستم، دستیار هوش مصنوعی وب‌سایت امیرعلی طاهری. درباره‌ی خودش، پروژه‌ها، مهارت‌ها و تکنولوژی‌ها، تحصیلات، گواهینامه‌ها، تجربه‌ها، خدمات، مقاله‌های بلاگ و راه‌های ارتباطی هر چه بخواهی از روی اطلاعات واقعی همین سایت توضیح می‌دهم؛ سؤال‌های عمومی برنامه‌نویسی را هم جواب می‌دهم. چیزی بپرس یا یکی از پیشنهادهای زیر را انتخاب کن 🐯"
    : "Hi! 👋 I'm Tiger, the AI assistant of AmirAli Taheri's website. I can tell you about him, his projects, skills & technologies, education, certificates, experience, services, blog articles and contact details — all from the website's real data — and I also answer general questions. Ask me anything, or pick one of the suggestions below 🐯";
}

export function suggestionsFor(lang: "fa" | "en"): string[] {
  return lang === "fa"
    ? [
        "امیرعلی طاهری کیست؟",
        "پروژه‌هایش را نشانم بده",
        "از چه تکنولوژی‌هایی استفاده می‌کند؟",
        "چه مقاله‌هایی در بلاگ هست؟",
        "گواهینامه‌هایش چیست؟",
        "چطور می‌توانم با او تماس بگیرم؟",
      ]
    : [
        "Who is AmirAli Taheri?",
        "Show me his projects",
        "What technologies does he use?",
        "What articles are on the blog?",
        "What certificates does he have?",
        "How can I contact him?",
      ];
}
