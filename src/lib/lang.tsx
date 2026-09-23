"use client";

import * as React from "react";

/* ====================================================================
   LANGUAGE SYSTEM — English / فارسی

   • LangProvider holds the active language ("fa" default = the site's
     original Persian RTL identity), persists it in localStorage and
     keeps <html lang/dir> in sync so every logical utility (ms-/me-/,
     start-/end-, text-start) mirrors automatically.
   • A tiny boot script in layout.tsx applies the stored language to
     <html> BEFORE first paint (no direction flash); the provider then
     syncs React state right after hydration.
   • PERFORMANCE: setLang() flips <html lang/dir> and writes storage
     SYNCHRONOUSLY inside the event handler, BEFORE the React state
     update. React commits the new strings in the same frame as the
     direction flip → one single layout pass, no intermediate paint
     where new text sits in the old direction (this was the visible
     "whole site re-rendering" hitch). No page reload, no remount —
     only the text/direction-bearing output changes.
   • t(key)   → dictionary lookup for UI chrome strings.
   • pick(fa, en?) → data-field resolver: returns the English variant
     when active and available, otherwise falls back to Persian.
   ==================================================================== */

export type Lang = "fa" | "en";

const STORAGE_KEY = "site-lang";

type DictEntry = { fa: string; en: string };

const DICT: Record<string, DictEntry> = {
  /* hero */
  "hero.hi": { fa: "سلام! من", en: "Hi! I'm" },
  "hero.mid": { fa: " هستم؛", en: " —" },
  "hero.cta": { fa: "همکاری با من", en: "Work with me" },
  "hero.portrait": { fa: "تصویر", en: "Portrait of" },
  "hero.socialsAria": {
    fa: "لینک‌های شبکه‌های اجتماعی",
    en: "Social media links",
  },

  /* technologies strip */
  "tech.caption": {
    fa: "تکنولوژی‌هایی که هر روز با آن‌ها ساختمان می‌سازم",
    en: "The technologies I build with every day",
  },
  "tech.aria": {
    fa: "تکنولوژی‌هایی که با آن‌ها کار می‌کنم",
    en: "Technologies I work with",
  },

  /* homepage section titles */
  "sec.projects": { fa: "پروژه‌ها", en: "Projects" },
  "sec.about": { fa: "درباره من", en: "About Me" },
  "sec.services": { fa: "خدمات", en: "Services" },
  "sec.facts": { fa: "نکات جالب", en: "Fun Facts" },
  "sec.resume": { fa: "رزومه من", en: "My Resume" },
  "sec.experience": { fa: "تجربه‌ها", en: "Experience" },
  "sec.education": { fa: "تحصیلات", en: "Education" },
  "sec.certs": { fa: "گواهینامه‌ها", en: "Certificates" },
  "sec.skills": { fa: "مهارت‌ها و تکنولوژی‌ها", en: "Skills & Technologies" },
  "sec.contact": { fa: "تماس", en: "Contact" },

  /* about */
  "about.pre": { fa: "من", en: "I'm" },
  "about.post": { fa: " هستم؛", en: "." },

  /* resume section */
  "resume.cta": { fa: "مشاهده / دانلود رزومه", en: "View / Download Résumé" },
  "resume.ctaAria": { fa: "رفتن به صفحه رزومه", en: "Go to the résumé page" },

  /* contact section */
  "contact.orEmail": { fa: "یا مستقیم ایمیل بزنید:", en: "Or email me directly:" },

  /* contact form */
  "form.title": { fa: "در تماس باشید", en: "Get in touch" },
  "form.desc": {
    fa: "پیامی بفرستید؛ در اسرع وقت پاسخ می‌دهم.",
    en: "Send me a message and I'll reply as soon as I can.",
  },
  "form.name": { fa: "نام", en: "Name" },
  "form.namePh": { fa: "نام شما", en: "Your name" },
  "form.email": { fa: "ایمیل", en: "Email" },
  "form.subject": { fa: "موضوع", en: "Subject" },
  "form.subjectPh": { fa: "مثلاً استعلام همکاری", en: "e.g. Collaboration inquiry" },
  "form.message": { fa: "پیام", en: "Message" },
  "form.messagePh": { fa: "پیام شما...", en: "Your message…" },
  "form.send": { fa: "ارسال پیام", en: "Send message" },
  "form.sending": { fa: "در حال ارسال...", en: "Sending…" },
  "form.successTitle": { fa: "پیام شما ارسال شد", en: "Your message has been sent" },
  "form.successDesc": {
    fa: "ممنون که در تماس هستید. به‌زودی پاسخ می‌دهم.",
    en: "Thanks for reaching out — I'll get back to you soon.",
  },
  "form.again": { fa: "ارسال پیام دیگر", en: "Send another message" },
  "form.errName": {
    fa: "نام باید حداقل ۲ نویسه باشد.",
    en: "Name must be at least 2 characters.",
  },
  "form.errEmail": {
    fa: "لطفاً یک ایمیل معتبر وارد کنید.",
    en: "Please enter a valid email address.",
  },
  "form.errMsg": {
    fa: "پیام باید حداقل ۱۰ نویسه باشد.",
    en: "Message must be at least 10 characters.",
  },
  "form.defaultSubject": { fa: "پیام از وب‌سایت", en: "Message from the website" },
  "form.errSubmit": {
    fa: "ارسال پیام با خطا مواجه شد. لطفاً بعداً دوباره تلاش کنید.",
    en: "Something went wrong while sending your message. Please try again.",
  },
  "form.errNetwork": {
    fa: "خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.",
    en: "Network error — please check your connection and try again.",
  },
  "form.errRate": {
    fa: "تعداد درخواست‌ها زیاد است. لطفاً چند لحظه دیگر دوباره تلاش کنید.",
    en: "Too many requests — please wait a moment and try again.",
  },

  /* skills flip cards */
  "cube.hint": { fa: "برای دیدن مکعب، کلیک کنید", en: "Click to reveal the cube" },
  "cube.ariaSuffix": {
    fa: "برای نمایش مکعب سه‌بعدی کلیک کنید",
    en: "click to reveal the 3D cube",
  },

  /* project cards */
  "proj.demo": { fa: "دموی زنده", en: "Live Demo" },
  "proj.demoDisabledAria": {
    fa: "دموی زنده — لینک هنوز در دسترس نیست",
    en: "Live demo — link not available yet",
  },
  "proj.demoDisabledTitle": {
    fa: "لینک دموی زنده این پروژه هنوز در دسترس نیست",
    en: "The live demo link for this project is not available yet",
  },
  "proj.preview": { fa: "پیش‌نمایش", en: "Preview" },
  "proj.previewTitle": { fa: "پیش‌نمایش پروژه", en: "Project preview" },
  "proj.githubAria": { fa: "در گیت‌هاب", en: "on GitHub" },
  "proj.source": { fa: "مشاهده سورس", en: "View source" },
  "proj.statusLive": { fa: "زنده", en: "Live" },

  /* experience cards */
  "exp.viewProject": { fa: "مشاهده صفحه پروژه", en: "View the project page" },

  /* certificate cards + lightbox */
  "cert.viewImage": { fa: "مشاهده تصویر گواهینامه", en: "View certificate image" },
  "cert.previewOf": { fa: "پیش‌نمایش گواهینامه", en: "Preview certificate" },
  "cert.imageHint": {
    fa: "تصویر گواهینامه در همین صفحه برای شما باز می‌شود",
    en: "The certificate image opens right here on the page",
  },
  "cert.idLabel": { fa: "شناسه: ", en: "ID: " },
  "cert.alt": { fa: "گواهینامه", en: "Certificate" },
  "lb.close": { fa: "بستن", en: "Close" },
  "lb.prev": { fa: "گواهینامه قبلی", en: "Previous certificate" },
  "lb.next": { fa: "گواهینامه بعدی", en: "Next certificate" },
  "lb.of": { fa: "از", en: "of" },

  /* flip cards (certificates + education — Skills flip interaction) */
  "flip.back": { fa: "بازگشت", en: "Back" },
  "cert.ariaSuffix": {
    fa: "برای نمایش تصویر گواهینامه کلیک کنید",
    en: "click to reveal the certificate image",
  },
  "edu.hint": { fa: "برای دیدن جزئیات، کلیک کنید", en: "Click to open details" },
  "edu.ariaSuffix": {
    fa: "برای نمایش جزئیات دوره کلیک کنید",
    en: "click to reveal the course details",
  },

  /* footer */
  "footer.tagline": {
    fa: "توسعه‌دهنده فول‌استک؛ خالق تجربه‌های وب تأثیرگذار.",
    en: "Full-stack developer — crafting impactful web experiences.",
  },
  "footer.quick": { fa: "دسترسی سریع", en: "Quick links" },
  "footer.quickAria": { fa: "دسترسی سریع فوتر", en: "Footer quick links" },
  "footer.direct": { fa: "ارتباط مستقیم", en: "Direct contact" },
  "footer.call": { fa: "تماس تلفنی", en: "Call" },
  "footer.email": { fa: "ایمیل", en: "Email" },
  "footer.rights": { fa: "تمامی حقوق محفوظ است.", en: "All rights reserved." },
  "footer.made": { fa: "ساخته شده با", en: "Made with" },
  "footer.backTop": { fa: "بازگشت به بالا", en: "Back to top" },

  /* navbar */
  "nav.menuOpen": { fa: "باز کردن منو", en: "Open menu" },
  "nav.menuClose": { fa: "بستن منو", en: "Close menu" },
  "nav.themeAria": { fa: "تغییر تم", en: "Toggle theme" },
  "theme.light": { fa: "روشن", en: "Light" },
  "theme.dark": { fa: "تیره", en: "Dark" },
  "theme.system": { fa: "سیستم", en: "System" },

  /* language switcher */
  "lang.aria": { fa: "تغییر زبان", en: "Switch language" },
  "lang.enTitle": { fa: "English", en: "English" },
  "lang.faTitle": { fa: "فارسی", en: "Persian" },

  /* layout chrome */
  "chrome.skip": { fa: "پرش به محتوای اصلی", en: "Skip to main content" },
  "chrome.printFooter": {
    fa: "امیرعلی طاهری — تاریخ چاپ: {d}",
    en: "AmirAli Taheri — printed on {d}",
  },

  /* 404 */
  "nf.code": { fa: "۴۰۴", en: "404" },
  "nf.title": { fa: "این صفحه پیدا نشد", en: "This page could not be found" },
  "nf.body": {
    fa: "صفحه‌ای که دنبالش می‌گردید وجود ندارد یا جابه‌جا شده است. از نوار بالا می‌توانید به بخش‌های سایت بروید.",
    en: "The page you are looking for does not exist or has moved. Use the menu above to reach the site sections.",
  },
  "nf.home": { fa: "بازگشت به خانه", en: "Back home" },
  "nf.blog": { fa: "مشاهده بلاگ", en: "View blog" },

  /* blog list */
  "blog.title": { fa: "بلاگ", en: "Blog" },
  "blog.subtitle": {
    fa: "یادداشت‌هایی درباره‌ی توسعه وب، تجربه‌های واقعی و نکات کاربردی.",
    en: "Notes on web development, real-world experience and practical tips.",
  },
  "blog.posts": { fa: "نوشته", en: "posts" },
  "blog.searchPh": {
    fa: "جست‌وجو در عنوان‌ها، خلاصه‌ها و برچسب‌ها…",
    en: "Search titles, excerpts and tags…",
  },
  "blog.searchAria": { fa: "جست‌وجو در نوشته‌ها", en: "Search posts" },
  "blog.clearSearch": { fa: "پاک کردن جست‌وجو", en: "Clear search" },
  "blog.categories": { fa: "دسته‌بندی:", en: "Categories:" },
  "blog.tagsLabel": { fa: "برچسب‌ها:", en: "Tags:" },
  "blog.all": { fa: "همه", en: "All" },
  "blog.filterCategoriesAria": { fa: "فیلتر دسته‌بندی‌ها", en: "Filter by category" },
  "blog.filterTagsAria": { fa: "فیلتر برچسب‌ها", en: "Filter by tags" },
  "blog.read": { fa: "خواندن", en: "Read" },
  "blog.views": { fa: "بازدید", en: "views" },
  "blog.empty": {
    fa: "نوشته‌ای با این فیلترها پیدا نشد.",
    en: "No posts match these filters.",
  },
  "blog.clearFilters": { fa: "پاک کردن همه‌ی فیلترها", en: "Clear all filters" },

  /* blog article */
  "article.back": { fa: "بازگشت به بلاگ", en: "Back to blog" },
  "article.level": { fa: "سطح:", en: "Level:" },
  "article.related": { fa: "نوشته‌های مرتبط", en: "Related posts" },
  "article.keepReading": { fa: "ادامه‌ی مطالعه", en: "Keep reading" },
  "article.older": { fa: "نوشته‌ی قدیمی‌تر", en: "Older post" },
  "article.newer": { fa: "نوشته‌ی جدیدتر", en: "Newer post" },
  "article.navAria": { fa: "ناوبری نوشته‌ها", en: "Post navigation" },
  "article.relatedAria": { fa: "نوشته‌های مرتبط", en: "Related posts" },
  "article.ask": {
    fa: "نظر یا سوالی دارید؟ خوشحال می‌شوم از طریق",
    en: "Questions or feedback? I'd love to hear from you via the",
  },
  "article.contactForm": { fa: "فرم تماس", en: "contact form" },
  "article.askEnd": { fa: "بشنوم.", en: "." },
  "article.all": { fa: "همه‌ی نوشته‌ها", en: "All posts" },

  /* code blocks */
  "code.terminal": { fa: "ترمینال", en: "Terminal" },
  "code.text": { fa: "متن", en: "Text" },
  "code.copy": { fa: "کپی", en: "Copy" },
  "code.copied": { fa: "کپی شد", en: "Copied" },
  "code.copyAria": { fa: "کپی کد", en: "Copy code" },
  "code.toastCopied": { fa: "کد کپی شد.", en: "Code copied." },
  "code.toastFail": { fa: "کپی ناموفق بود.", en: "Copy failed." },

  /* table of contents */
  "toc.title": { fa: "فهرست مطالب", en: "On this page" },
  "toc.progress": { fa: "پیشرفت مطالعه", en: "Reading progress" },
  "toc.words": { fa: "واژه", en: "words" },
  "toc.wordsHint": {
    fa: "تعداد تقریبی واژه‌های نوشته",
    en: "Approximate word count of this article",
  },
  "toc.sectionWords": {
    fa: "حدود {n} واژه در این بخش",
    en: "≈{n} words in this section",
  },

  /* share buttons */
  "share.label": { fa: "اشتراک‌گذاری:", en: "Share:" },
  "share.copy": { fa: "کپی لینک", en: "Copy link" },
  "share.copied": { fa: "کپی شد", en: "Copied" },
  "share.telegram": { fa: "تلگرام", en: "Telegram" },
  "share.email": { fa: "ایمیل", en: "Email" },
  "share.inAria": { fa: "اشتراک‌گذاری در {n}", en: "Share on {n}" },
  "share.toastCopied": { fa: "لینک مقاله کپی شد", en: "Article link copied" },
  "share.toastFail": { fa: "کپی لینک ناموفق بود", en: "Copying the link failed" },

  /* heading anchor */
  "heading.copyAria": { fa: "کپی لینک بخش {n}", en: "Copy link to section {n}" },
  "heading.copyTitle": { fa: "کپی لینک این بخش", en: "Copy section link" },
  "heading.toastCopied": { fa: "لینک بخش کپی شد", en: "Section link copied" },
  "heading.toastFail": { fa: "کپی لینک ناموفق بود", en: "Copying failed" },

  /* view counter */
  "view.views": { fa: "بازدید", en: "views" },

  /* resume page */
  "rpage.back": { fa: "بازگشت به پرتفولیو", en: "Back to portfolio" },
  "rpage.github": { fa: "پروفایل گیت‌هاب", en: "GitHub profile" },
  "rpage.telegram": { fa: "تلگرام", en: "Telegram" },
  "rpage.download": { fa: "دانلود فایل رزومه (PDF)", en: "Download résumé (PDF)" },
  "rpage.downloadShort": { fa: "دانلود", en: "Download" },
  "rpage.contact": { fa: "تماس", en: "Contact" },
  "rpage.links": { fa: "لینک‌های حرفه‌ای", en: "Professional links" },
  "rpage.website": { fa: "وب‌سایت شخصی", en: "Personal website" },
  "rpage.githubLink": { fa: "گیت‌هاب", en: "GitHub" },
  "rpage.telegramLink": { fa: "تلگرام", en: "Telegram" },
  "rpage.techSkills": { fa: "مهارت‌های فنی", en: "Technical skills" },
  "rpage.coreTech": { fa: "تکنولوژی‌های اصلی", en: "Core technologies" },
  "rpage.otherTech": { fa: "سایر تکنولوژی‌ها", en: "Other technologies" },
  "rpage.langs": { fa: "زبان‌ها", en: "Languages" },
  "rpage.summary": { fa: "خلاصه", en: "Summary" },
  "rpage.experience": { fa: "تجربه‌ها", en: "Experience" },
  "rpage.projects": { fa: "پروژه‌ها", en: "Projects" },
  "rpage.education": { fa: "تحصیلات", en: "Education" },
  "rpage.joiner": { fa: "، ", en: ", " },

  /* project preview modal + detail page */
  "preview.logoAlt": { fa: "لوگوی {n}", en: "Logo of {n}" },
  "preview.features": { fa: "ویژگی‌های کلیدی", en: "Key features" },
  "preview.moreFeatures": {
    fa: "{n} ویژگی دیگر در صفحه پروژه…",
    en: "{n} more features on the project page…",
  },
  "preview.tech": { fa: "تکنولوژی‌ها", en: "Technologies" },
  "preview.viewProject": { fa: "مشاهده صفحه پروژه", en: "View project page" },
  "preview.note": {
    fa: "جزئیات کامل، پنل‌ها و ساختار پروژه در صفحه اختصاصی",
    en: "Full details, panels and structure on the dedicated project page",
  },
  "detail.back": { fa: "بازگشت به نمونه‌کارها", en: "Back to projects" },
  "detail.overview": { fa: "معرفی", en: "Overview" },
  "detail.roles": { fa: "نقش‌های کاربری", en: "User roles" },
  "detail.support": { fa: "پشتیبانی مشتریان و ارتباط", en: "Customer support & contact" },
  "detail.management": { fa: "پنل مدیریتی", en: "Management panel" },
  "detail.design": { fa: "طراحی و تجربه کاربری", en: "Design & user experience" },
  "detail.structure": { fa: "ساختار وب‌سایت", en: "Website structure" },
  "detail.tech": { fa: "تکنولوژی‌های استفاده‌شده", en: "Technologies used" },
  "detail.architecture": { fa: "تکنولوژی‌ها و معماری", en: "Technologies & architecture" },
  "detail.goal": { fa: "هدف پروژه", en: "Project goal" },
  "detail.team": { fa: "تیم", en: "Team" },
  "detail.otherAria": { fa: "سایر پروژه‌ها", en: "Other projects" },
  "detail.other": { fa: "پروژه دیگر", en: "Another project" },
  "detail.backAll": { fa: "بازگشت به همه‌ی پروژه‌ها", en: "Back to all projects" },
};

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** UI chrome string by dictionary key (falls back to the key itself). */
  t: (key: string) => string;
  /** Data-field resolver: English variant when active, Persian fallback. */
  pick: (fa: string, en?: string) => string;
};

const LangContext = React.createContext<LangContextValue | null>(null);

function applyDocumentLang(lang: Lang) {
  const root = document.documentElement;
  if (root.lang !== lang) root.lang = lang;
  const dir = lang === "fa" ? "rtl" : "ltr";
  if (root.dir !== dir) root.dir = dir;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("fa");

  /* Restore the visitor's stored choice right after hydration. The boot
     script in layout.tsx has already fixed <html lang/dir> pre-paint. */
  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* private mode etc. — default stays fa */
    }
    if (stored === "en" || stored === "fa") {
      setLangState((current) => (current === stored ? current : (stored as Lang)));
    }
  }, []);

  /* Safety net — keep <html> attributes + storage in sync. setLang()
     already applies them synchronously before the render, so this only
     re-asserts the same values (no second layout pass in practice). */
  React.useEffect(() => {
    applyDocumentLang(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* non-fatal */
    }
  }, [lang]);

  const setLang = React.useCallback((next: Lang) => {
    /* Synchronously flip <html lang/dir> + storage BEFORE the state
       update so the direction change and the new strings land in the
       SAME commit/paint — no intermediate frame, no double reflow. */
    applyDocumentLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* non-fatal */
    }
    setLangState((current) => (current === next ? current : next));
  }, []);

  const t = React.useCallback(
    (key: string) => {
      const entry = DICT[key];
      return entry ? entry[lang] : key;
    },
    [lang]
  );

  const pick = React.useCallback(
    (fa: string, en?: string) => (lang === "en" && en ? en : fa),
    [lang]
  );

  const value = React.useMemo(
    () => ({ lang, setLang, t, pick }),
    [lang, setLang, t, pick]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
