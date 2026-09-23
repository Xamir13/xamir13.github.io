"use client";

import * as React from "react";
import {
  ArrowRight,
  Download,
  Github,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import { Button } from "@/components/site/primitives";
import { useLang } from "@/lib/lang";
import { withBase } from "@/lib/paths";
import {
  education,
  experience,
  profile,
  projects,
  resumeLanguages,
  resumeSummary,
  resumeSummaryEn,
  skills,
} from "@/lib/site-data";

/* ------------------------------------------------------------------ */
/* Resume page — same structure and visual language as the reference   */
/* (standalone document card on a lavender background). Typography is  */
/* the site-wide Dana (via .font-resume scope). The download button    */
/* streams the real generated PDF from /api/resume/download.           */
/* Fully bilingual (fa/en) through the standard language system.       */
/* ------------------------------------------------------------------ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  const { t, pick } = useLang();
  const mainSkills = [skills[0], skills[1]];
  const otherSkills = [skills[3], skills[2]];

  return (
    <div className="font-resume">
      <main id="main-content" className="min-h-screen bg-[#ece8f5] px-4 py-8 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 md:px-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <Button
              asChild
              variant="outline"
              className="h-10 px-4 py-2 bg-white/80 dark:bg-zinc-800/80"
            >
              <a href={withBase("/")}>
                <ArrowRight className="me-2 h-4 w-4 rtl:rotate-0" aria-hidden="true" />
                {t("rpage.back")}
              </a>
            </Button>
            <div className="ms-auto flex items-center gap-5 text-zinc-600 dark:text-zinc-300">
              <a
                href={`https://github.com/azazamir139-glitch`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-zinc-900 dark:hover:text-zinc-100"
                aria-label={t("rpage.github")}
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://t.me/azazamir139"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-zinc-900 dark:hover:text-zinc-100"
                aria-label={t("rpage.telegram")}
              >
                <Send className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={withBase("/api/resume/download")}
                download="AmirAli-Taheri-Resume.pdf"
                className="inline-flex items-center gap-2 text-sm hover:text-zinc-900 dark:hover:text-zinc-100"
                aria-label={t("rpage.download")}
                title={t("rpage.download")}
              >
                <Download className="h-5 w-5" aria-hidden="true" />
                <span>{t("rpage.downloadShort")}</span>
              </a>
            </div>
          </div>

          {/* Document card */}
          <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="grid gap-0 lg:grid-cols-[300px,1fr]">
              {/* Sidebar */}
              <aside className="space-y-8 bg-zinc-100/90 p-6 dark:bg-zinc-900">
                <div>
                  <h1 className="text-4xl font-semibold leading-tight text-indigo-700 dark:text-indigo-300">
                    {pick(profile.firstName, profile.firstNameEn)}
                    <br />
                    {pick(profile.lastName, profile.lastNameEn)}
                  </h1>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {pick(profile.role, profile.roleEn)}
                  </p>
                </div>

                <section>
                  <SectionHeading>{t("rpage.contact")}</SectionHeading>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Mail
                        className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                        aria-hidden="true"
                      />
                      <a
                        className="hover:underline"
                        href={`mailto:${profile.email}`}
                        dir="ltr"
                      >
                        {profile.email}
                      </a>
                    </li>
                    <li className="flex items-start gap-2">
                      <Phone
                        className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                        aria-hidden="true"
                      />
                      <a
                        className="hover:underline"
                        href={`tel:${profile.phone}`}
                        dir="ltr"
                      >
                        {profile.phone}
                      </a>
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                        aria-hidden="true"
                      />
                      <span>{pick(profile.location, profile.locationEn)}</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <SectionHeading>{t("rpage.links")}</SectionHeading>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        className="hover:underline"
                        href={withBase("/")}
                      >
                        {t("rpage.website")}
                      </a>
                    </li>
                    <li>
                      <a
                        className="hover:underline"
                        href="https://github.com/azazamir139-glitch"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("rpage.githubLink")}
                      </a>
                    </li>
                    <li>
                      <a
                        className="hover:underline"
                        href="https://t.me/azazamir139"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("rpage.telegramLink")}
                      </a>
                    </li>
                  </ul>
                </section>

                <section>
                  <SectionHeading>{t("rpage.techSkills")}</SectionHeading>
                  <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <div>
                      <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                        {t("rpage.coreTech")}
                      </h3>
                      <ul className="list-disc space-y-1 ps-5">
                        {mainSkills.map((category) => (
                          <li key={category.id}>
                            <span className="font-medium">
                              {pick(category.title, category.titleEn)}:
                            </span>{" "}
                            {category.skills
                              .map((skill) => pick(skill.name, skill.nameEn))
                              .join(t("rpage.joiner"))}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                        {t("rpage.otherTech")}
                      </h3>
                      <ul className="list-disc space-y-1 ps-5">
                        {otherSkills.map((category) => (
                          <li key={category.id}>
                            <span className="font-medium">
                              {pick(category.title, category.titleEn)}:
                            </span>{" "}
                            {category.skills
                              .map((skill) => pick(skill.name, skill.nameEn))
                              .join(t("rpage.joiner"))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <SectionHeading>{t("rpage.langs")}</SectionHeading>
                  <ul className="space-y-1 text-sm">
                    {resumeLanguages.map((lang) => (
                      <li key={lang.name}>
                        - {pick(lang.name, lang.nameEn)} ({pick(lang.level, lang.levelEn)})
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>

              {/* Main column */}
              <div className="space-y-8 p-6 md:p-8">
                <section>
                  <SectionHeading>{t("rpage.summary")}</SectionHeading>
                  <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {pick(resumeSummary, resumeSummaryEn)}
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {t("rpage.experience")}
                  </h2>
                  <div className="space-y-6">
                    {experience.map((item) => (
                      <div
                        key={item.company}
                        className="border-s-2 border-zinc-200 ps-4 dark:border-zinc-700"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-base font-semibold">
                            {pick(item.company, item.companyEn)}
                          </h3>
                          <p className="text-xs text-zinc-500">
                            {pick(item.period, item.periodEn)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                          {pick(item.role, item.roleEn)}
                        </p>
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {pick(item.description, item.descriptionEn)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {t("rpage.projects")}
                  </h2>
                  <div className="space-y-5">
                    {projects.map((project) => (
                      <div
                        key={project.slug}
                        className="border-s-2 border-zinc-200 ps-4 dark:border-zinc-700"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-base font-semibold">
                            {pick(project.title, project.titleEn)}
                          </h3>
                          <p className="text-xs text-zinc-500" dir="ltr">
                            {project.techAll.slice(0, 4).join(", ")}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {pick(project.description, project.descriptionEn)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {t("rpage.education")}
                  </h2>
                  <div className="space-y-4">
                    {education.map((item) => (
                      <div key={item.degree + (item.period ?? "")}>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          {item.school ? (
                            <h3 className="text-base font-semibold">
                              {pick(item.school, item.schoolEn)}
                            </h3>
                          ) : null}
                          {item.period ? (
                            <p className="text-xs text-zinc-500">{item.period}</p>
                          ) : null}
                        </div>
                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                          {pick(item.degree, item.degreeEn)}
                        </p>
                        {item.status ? (
                          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                            {pick(item.status, item.statusEn)}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
