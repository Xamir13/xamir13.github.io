"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  ExternalLink,
  Github,
  Rocket,
  Users,
} from "lucide-react";

import { Badge, Button } from "@/components/site/primitives";
import { TiltCard } from "@/components/site/tilt-card";
import { useLang } from "@/lib/lang";
import { withBase } from "@/lib/paths";
import { projects, type Project } from "@/lib/site-data";

/* ====================================================================
   PROJECT DETAIL VIEW — fully bilingual client view for /projects/[slug]

   The route keeps a thin server shell (metadata + JSON-LD + static
   params); everything rendered here is language-aware through the
   standard useLang system — headings, buttons, tags AND the project's
   own long-form content via its EN variant fields (overview/features/
   roles/goal/support/management/design/structure/team/architecture),
   falling back to the Persian original whenever a variant is absent.
   ==================================================================== */

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="text-muted-foreground leading-relaxed space-y-3">
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="text-justify">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CircleCheck
            className="h-5 w-5 text-primary shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span className="text-muted-foreground leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ProjectDetailView({ project }: { project: Project }) {
  const { lang, t, pick } = useLang();

  const title = pick(project.title, project.titleEn);
  const tags = lang === "en" ? (project.tagsEn ?? project.tags) : project.tags;
  const overview = pick(project.overview, project.overviewEn);
  const features = lang === "en"
    ? (project.featuresEn ?? project.features)
    : project.features;
  const roles = lang === "en"
    ? (project.rolesEn ?? project.roles)
    : project.roles;
  const architecture = lang === "en"
    ? (project.architectureEn ?? project.architecture)
    : project.architecture;
  const goal = pick(project.goal ?? "", project.goalEn);
  const support = pick(project.support ?? "", project.supportEn);
  const management = lang === "en"
    ? (project.managementEn ?? project.management)
    : project.management;
  const design = pick(project.design ?? "", project.designEn);
  const structure = lang === "en"
    ? (project.structureEn ?? project.structure)
    : project.structure;
  const team = lang === "en"
    ? (project.teamEn ?? project.team)
    : project.team;

  const otherProjects = projects.filter((p) => p.slug !== project.slug);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
      {/* Back link */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 print:hidden"
      >
        <ArrowRight className="h-4 w-4 rtl:rotate-0" aria-hidden="true" />
        {t("detail.back")}
      </Link>

      {/* Hero header */}
      <header className="mb-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="shrink-0 w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
            <img
              src={withBase(project.icon)}
              alt={t("preview.logoAlt").replace("{n}", title)}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {title}
            </h1>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className="border-border bg-transparent text-foreground text-xs font-semibold"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons — «Live demo» (primary/green) + «Source» (outline) */}
        <div className="flex flex-wrap gap-3 mt-4 print:hidden">
          {project.liveUrl ? (
            <Button asChild size="sm">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Rocket className="h-4 w-4 me-2" aria-hidden="true" />
                {t("proj.demo")}
                <ExternalLink className="h-3 w-3 ms-1 opacity-70" aria-hidden="true" />
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              disabled
              title={t("proj.demoDisabledTitle")}
            >
              <Rocket className="h-4 w-4 me-2" aria-hidden="true" />
              {t("proj.demo")}
              <ExternalLink className="h-3 w-3 ms-1 opacity-70" aria-hidden="true" />
            </Button>
          )}
          {project.githubUrl ? (
            <Button asChild variant="outline" size="sm">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 me-2" aria-hidden="true" />
                {t("proj.source")}
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          {t("detail.overview")}
        </h2>
        <Paragraphs text={overview} />
      </section>

      {/* Key features */}
      {features.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("preview.features")}
          </h2>
          <CheckList items={features} />
        </section>
      ) : null}

      {/* User roles (school project) */}
      {roles && roles.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("detail.roles")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((role) => (
              <div
                key={role.name}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <p className="font-semibold text-foreground mb-1">{role.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Customer support (marshall) */}
      {support ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {t("detail.support")}
          </h2>
          <Paragraphs text={support} />
        </section>
      ) : null}

      {/* Management panel (marshall) */}
      {management && management.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("detail.management")}
          </h2>
          <CheckList items={management} />
        </section>
      ) : null}

      {/* Design & UX (marshall) */}
      {design ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {t("detail.design")}
          </h2>
          <Paragraphs text={design} />
        </section>
      ) : null}

      {/* Website structure (marshall) */}
      {structure && structure.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("detail.structure")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {structure.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-sm text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Technologies */}
      {project.techAll.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("detail.tech")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techAll.map((tech) => (
              <Badge key={tech} className="text-sm font-semibold">
                {tech}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      {/* Architecture (school project) */}
      {architecture && architecture.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("detail.architecture")}
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {architecture.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  {item.label}
                </dt>
                <dd className="text-sm font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* Project goal */}
      {goal ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {t("detail.goal")}
          </h2>
          <Paragraphs text={goal} />
        </section>
      ) : null}

      {/* Team */}
      {team.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("detail.team")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {team.map((member) => (
              <div key={member.name} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border">
                  <Users
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {member.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({member.role})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Other projects — same card language as the blog post-nav */}
      {otherProjects.length > 0 ? (
        <nav
          className="mb-10 grid gap-3 sm:grid-cols-2 print:hidden"
          aria-label={t("detail.otherAria")}
        >
          {otherProjects.map((other) => (
            <Link
              key={other.slug}
              href={`/projects/${other.slug}`}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <TiltCard className="h-full" lightClassName="rounded-xl">
                <div className="h-full rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30">
                  <div className="flex items-start justify-between gap-2 p-5">
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-muted-foreground">
                        {t("detail.other")}
                      </span>
                      <h3 className="mt-1 font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {pick(other.title, other.titleEn)}
                      </h3>
                    </div>
                    <div className="shrink-0">
                      <img
                        src={withBase(other.icon)}
                        alt=""
                        aria-hidden="true"
                        className="h-10 w-10 rounded-lg border border-border/60 object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {pick(other.description, other.descriptionEn)}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Link>
          ))}
        </nav>
      ) : null}

      {/* Bottom back button */}
      <div className="pt-6 border-t border-border print:hidden">
        <Button variant="outline" asChild className="h-10 px-4 py-2 gap-2">
          <Link href="/#projects">
            <ArrowRight className="h-4 w-4 rtl:rotate-0" aria-hidden="true" />
            {t("detail.backAll")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
