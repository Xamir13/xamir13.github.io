"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  CodeXml,
  ExternalLink,
  Eye,
  FileDown,
  Github,
  GraduationCap,
  Layers,
  Lightbulb,
  Mail,
  Rocket,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { withBase } from "@/lib/paths";
import { useLang } from "@/lib/lang";
import { SkillsShowcase } from "@/components/site/skills-cube";
import { FlipCard } from "@/components/site/flip-card";
import { DepthRegion } from "@/components/site/depth-region";
import { TiltCard } from "@/components/site/tilt-card";
import {
  certifications,
  contactIntro,
  contactIntroEn,
  education,
  experience,
  funFacts,
  profile,
  projects,
  services,
  skills,
  type Certification,
  type Education,
  type Experience,
  type FunFact,
  type Project,
  type Service,
} from "@/lib/site-data";
import {
  SectionIndicator,
  SectionTitle,
  sectionThemes,
  type SectionThemeName,
} from "@/components/site/section-indicator";
import {
  Badge,
  Button,
  Card,
} from "@/components/site/primitives";
import { ContactForm } from "@/components/site/contact-form";
import { CertGallery } from "@/components/site/certificate-lightbox";
import { ProjectPreviewModal } from "@/components/site/project-preview";

/* ------------------------------------------------------------------ */
/* Cards — exact reference classes                                     */
/* ------------------------------------------------------------------ */

/* Section-level depth backdrops — one soft themed glow per section
   theme (the receding plane lives in <DepthRegion>, never on cards). */
const DEPTH_GLOW: Record<SectionThemeName, string> = {
  about: "bg-primary/[0.07] dark:bg-primary/[0.13]",
  work: "bg-teal-500/[0.07] dark:bg-teal-400/[0.13]",
  experience: "bg-amber-500/[0.08] dark:bg-amber-400/[0.13]",
  primary: "bg-violet-500/[0.07] dark:bg-violet-400/[0.13]",
  contact: "bg-sky-500/[0.07] dark:bg-sky-400/[0.13]",
};

function LiveDemoAction({ project }: { project: Project }) {
  const { t, pick } = useLang();
  const title = pick(project.title, project.titleEn);
  /* Green «دموی زنده» action inside the card (reference button styling).
     Rendered as a span so it nests legally inside the card <a>; the click is
     isolated with preventDefault/stopPropagation exactly like the reference. */
  const classes = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
    "bg-primary text-primary-foreground shadow-sm",
    project.liveUrl
      ? "hover:bg-primary/90 cursor-pointer"
      : "opacity-60 cursor-not-allowed",
    "transition-colors h-9 px-3",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  );
  if (!project.liveUrl) {
    return (
      <span
        role="link"
        aria-disabled="true"
        tabIndex={0}
        title={t("proj.demoDisabledTitle")}
        aria-label={t("proj.demoDisabledAria")}
        className={classes}
      >
        <Rocket className="h-4 w-4 me-2" aria-hidden="true" />
        {t("proj.demo")}
        <ExternalLink className="h-3 w-3 ms-1 opacity-70" aria-hidden="true" />
      </span>
    );
  }
  const open = () => window.open(project.liveUrl, "_blank", "noopener,noreferrer");
  return (
    <span
      role="link"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        open();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          open();
        }
      }}
      aria-label={`${t("proj.demo")} ${title}`}
      className={cn(classes, "cursor-pointer")}
    >
      <Rocket className="h-4 w-4 me-2" aria-hidden="true" />
      {t("proj.demo")}
      <ExternalLink className="h-3 w-3 ms-1 opacity-70" aria-hidden="true" />
    </span>
  );
}

function ProjectCard({
  project,
  onPreview,
}: {
  project: Project;
  onPreview: () => void;
}) {
  const { lang, t, pick } = useLang();
  const title = pick(project.title, project.titleEn);
  const tags = lang === "en" ? (project.tagsEn ?? project.tags) : project.tags;
  /* Existing content, surfaced for the hover-priority layer: the first
     features double as the card's highlight line (nothing invented). */
  const features =
    lang === "en"
      ? (project.featuresEn ?? project.features)
      : project.features;
  const highlights = features.slice(0, 3).join("  ·  ");
  // Cards navigate to the project detail page, exactly like the reference.
  const href = `/projects/${project.slug}`;
  const inner = (
    <Card className="w-full transition-all duration-200 bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30">
      <div className="space-y-1.5 p-6 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Layer 2+3 — project identity: the existing logo gains real
              depth (parallax wrapper + hover zoom on the inner media). */}
          <div className="flex min-w-0 items-center gap-3">
            {project.icon ? (
              <span
                data-il=""
                style={{ "--il-depth": 9 } as React.CSSProperties}
                className="shrink-0"
              >
                <span className="il-media block">
                  <img
                    src={withBase(project.icon)}
                    alt=""
                    aria-hidden="true"
                    className="h-11 w-11 rounded-lg border border-border/60 bg-white object-contain p-1 shadow-sm"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </span>
              </span>
            ) : null}
            <h3
              data-il=""
              style={{ "--il-depth": 5 } as React.CSSProperties}
              className="font-semibold tracking-tight text-xl group-hover:text-primary transition-colors"
            >
              {title}
            </h3>
          </div>
          <div
            data-il=""
            style={{ "--il-depth": 7 } as React.CSSProperties}
            className="flex items-center gap-2"
          >
            {/* In-site preview trigger — opens the project preview modal
                instead of navigating anywhere. Every project has one. */}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onPreview();
                }
              }}
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer p-2 -m-2"
              aria-label={`${t("proj.preview")} ${title}`}
              aria-haspopup="dialog"
              title={t("proj.previewTitle")}
            >
              <Eye className="h-4 w-4" />
            </span>
            {project.githubUrl ? (
              <span
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer p-2 -m-2"
                aria-label={`${title} ${t("proj.githubAria")}`}
              >
                <Github className="h-4 w-4" />
              </span>
            ) : null}
          </div>
        </div>
        <div
          data-il=""
          style={{ "--il-depth": 8 } as React.CSSProperties}
          className="flex flex-wrap gap-1"
        >
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
      <div className="p-6 pt-0">
        <p
          data-il=""
          style={{ "--il-depth": 3 } as React.CSSProperties}
          className="text-sm text-foreground/90"
        >
          {pick(project.description, project.descriptionEn)}
        </p>
      </div>
      <div className="p-6 pt-0 pb-6 space-y-2.5">
        {/* Layer 5 — status + highlights, from EXISTING data only: the
            dot mirrors the live-demo action's own fact (liveUrl), the
            line previews the project's first features. Muted at rest,
            it comes forward on hover and is always visible on touch. */}
        <div
          data-il=""
          style={{ "--il-depth": 5 } as React.CSSProperties}
          className="il-hl flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground"
        >
          {project.liveUrl ? (
            <span className="inline-flex shrink-0 items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.8)]"
              />
              {t("proj.statusLive")}
            </span>
          ) : null}
          {highlights ? (
            <span dir="auto" className="min-w-0 flex-1 truncate">
              {highlights}
            </span>
          ) : null}
        </div>
        <LiveDemoAction project={project} />
      </div>
    </Card>
  );
  if (!href) return (
    <div className="block w-full max-w-[500px] group">
      <TiltCard className="w-full" lightClassName="rounded-lg" glow borderLight>
        {inner}
      </TiltCard>
    </div>
  );
  const external = href.startsWith("http");
  return (
    <a
      className="block w-full max-w-[500px] group"
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      <TiltCard className="w-full" lightClassName="rounded-lg" glow borderLight>
        {inner}
      </TiltCard>
    </a>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const { pick } = useLang();
  const Icon = service.icon;
  return (
    <TiltCard className="w-full max-w-sm" lightClassName="rounded-xl" glow borderLight>
      <div className="text-card-foreground w-full rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm transition-shadow hover:shadow-md text-start">
        <div className="flex flex-col space-y-1.5 p-0 pb-3">
          <div className="flex items-center gap-3">
            <div
              data-il=""
              style={{ "--il-depth": 8 } as React.CSSProperties}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <Icon size={22} />
            </div>
            <h3
              data-il=""
              style={{ "--il-depth": 5 } as React.CSSProperties}
              className="tracking-tight text-base font-semibold"
            >
              {pick(service.title, service.titleEn)}
            </h3>
          </div>
        </div>
        <div className="p-0">
          <p
            data-il=""
            style={{ "--il-depth": 3 } as React.CSSProperties}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {pick(service.description, service.descriptionEn)}
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

function FunFactCard({ fact }: { fact: FunFact }) {
  const { pick } = useLang();
  const Icon = fact.icon;
  return (
    <TiltCard className="w-full max-w-xs" lightClassName="rounded-xl" glow borderLight>
      <div className="text-card-foreground w-full rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm transition-shadow hover:shadow-md text-start">
        <div className="flex flex-col space-y-1.5 p-0 pb-3">
          <div
            data-il=""
            style={{ "--il-depth": 8 } as React.CSSProperties}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <Icon size={22} />
          </div>
        </div>
        <div className="p-0">
          <p
            data-il=""
            style={{ "--il-depth": 3 } as React.CSSProperties}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {pick(fact.text, fact.textEn)}
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

function ExperienceCard({ item }: { item: Experience }) {
  const { lang, t, pick } = useLang();
  const ArrowIcon = lang === "fa" ? ArrowLeft : ArrowRight;
  const body = (
    <TiltCard className="w-full" lightClassName="rounded-xl" glow borderLight>
      <div className="text-card-foreground w-full rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 text-start">
        <div className="flex flex-col space-y-1.5 p-0 pb-3">
          <p
            data-il=""
            style={{ "--il-depth": 4 } as React.CSSProperties}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {pick(item.period, item.periodEn)}
          </p>
          <h3
            data-il=""
            style={{ "--il-depth": 6 } as React.CSSProperties}
            className="tracking-tight text-lg font-semibold group-hover:text-primary transition-colors flex items-center gap-2"
          >
            {pick(item.role, item.roleEn)}
            <ArrowIcon
              className={cn(
                "h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200",
                lang === "fa"
                  ? "translate-x-2 group-hover:translate-x-0"
                  : "-translate-x-2 group-hover:translate-x-0"
              )}
              aria-hidden="true"
            />
          </h3>
          <p
            data-il=""
            style={{ "--il-depth": 3 } as React.CSSProperties}
            className="text-muted-foreground text-sm"
          >
            {pick(item.company, item.companyEn)}
            {item.location || item.locationEn ? (
              <> · {pick(item.location ?? "", item.locationEn)}</>
            ) : null}
          </p>
        </div>
        <div className="p-0">
          <p
            data-il=""
            style={{ "--il-depth": 3 } as React.CSSProperties}
            className="text-sm text-muted-foreground leading-relaxed line-clamp-2"
          >
            {pick(item.description, item.descriptionEn)}
          </p>
        </div>
      </div>
    </TiltCard>
  );
  /* The card (and its arrow) navigates to the project's dedicated detail page. */
  if (item.projectSlug) {
    return (
      <Link
        href={`/projects/${item.projectSlug}`}
        className="block w-full max-w-xl group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`${pick(item.company, item.companyEn)} — ${t("exp.viewProject")}`}
      >
        {body}
      </Link>
    );
  }
  return <div className="block w-full max-w-xl group">{body}</div>;
}

function EducationCard({ item }: { item: Education }) {
  const { t, pick } = useLang();
  const [flipped, setFlipped] = React.useState(false);
  const degree = pick(item.degree, item.degreeEn);
  const school = pick(item.school ?? "", item.schoolEn);
  const location = pick(item.location ?? "", item.locationEn);
  const toggle = () => setFlipped((f) => !f);

  /* Opens EXACTLY like the Skills & Technologies cards: same flip scene,
     same 680ms expo transition, same a11y contract — the back face is the
     "detailed card" with the course's brand image displayed prominently. */
  return (
    <TiltCard
      className="h-[272px] w-full max-w-xl"
      contentLift={0}
      maxTilt={4.5}
      lightClassName="rounded-xl"
      glow
      borderLight
    >
      <FlipCard
        flipped={flipped}
        onToggle={toggle}
        label={`${degree} — ${t("edu.ariaSuffix")}`}
      >
        {/* FRONT — the previous compact card content, preserved */}
        <div className="flip-face flex h-full w-full flex-col rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm transition-shadow text-start">
          <div className="flex flex-col space-y-1.5 pb-3">
            {item.period ? (
              <p
                data-il=""
                style={{ "--il-depth": 4 } as React.CSSProperties}
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {item.period}
              </p>
            ) : null}
            <h3
              data-il=""
              style={{ "--il-depth": 6 } as React.CSSProperties}
              className="tracking-tight text-lg font-semibold"
            >
              {degree}
            </h3>
            {school || location ? (
              <p
                data-il=""
                style={{ "--il-depth": 3 } as React.CSSProperties}
                className="text-muted-foreground text-sm"
              >
                {school}
                {school && location ? " · " : null}
                {location}
              </p>
            ) : null}
          </div>
          {/* Short course summary — fills the previously empty gap between
              the title block and the open hint. */}
          {item.description || item.descriptionEn ? (
            <p
              data-il=""
              style={{ "--il-depth": 3 } as React.CSSProperties}
              className="mb-2 text-sm text-muted-foreground leading-relaxed"
            >
              {pick(item.description ?? "", item.descriptionEn)}
            </p>
          ) : null}
          {item.status || item.focus || item.highlights ? (
            <div className="space-y-2">
              {item.status ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pick(item.status, item.statusEn)}
                </p>
              ) : null}
              {item.focus ? (
                <p className="text-xs text-muted-foreground">{item.focus}</p>
              ) : null}
              {item.highlights ? (
                <p className="text-xs text-muted-foreground">{item.highlights}</p>
              ) : null}
            </div>
          ) : null}
          <span className="mt-auto pt-3 text-xs text-primary/80">
            {item.logo ? t("edu.hint") : ""}
          </span>
        </div>

        {/* BACK — opened detail card: the brand image leads, then the
            same information hierarchy as the front. The thin accent ring
            is the site's PURE brand green (shared by every education
            card — one implementation, no per-card tint variants). */}
        <div className="flip-face flip-face-back flex h-full w-full flex-col rounded-xl border border-primary bg-card p-4 md:p-5 shadow-lg text-start">
          {item.logo ? (
            <div
              data-il=""
              style={{ "--il-depth": 7 } as React.CSSProperties}
              className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white p-3"
            >
              <span className="il-media block flex h-full w-full items-center justify-center">
                <img
                  src={withBase(item.logo)}
                  alt={school || degree}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </span>
            </div>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col pt-3">
            <h3
              data-il=""
              style={{ "--il-depth": 5 } as React.CSSProperties}
              className="tracking-tight text-lg font-semibold leading-snug"
            >
              {degree}
            </h3>
            {school || location ? (
              <p
                data-il=""
                style={{ "--il-depth": 3 } as React.CSSProperties}
                className="text-muted-foreground text-sm"
              >
                {school}
                {school && location ? " · " : null}
                {location}
              </p>
            ) : null}
            {item.status ? (
              <p
                data-il=""
                style={{ "--il-depth": 3 } as React.CSSProperties}
                className="pt-2 text-sm text-muted-foreground leading-relaxed"
              >
                {pick(item.status, item.statusEn)}
              </p>
            ) : null}
            {item.focus ? (
              <p className="pt-1.5 text-xs text-muted-foreground">{item.focus}</p>
            ) : null}
            {item.highlights ? (
              <p className="pt-1.5 text-xs text-muted-foreground">
                {item.highlights}
              </p>
            ) : null}
          </div>
        </div>
      </FlipCard>
    </TiltCard>
  );
}

/* ------------------------------------------------------------------ */
/* Data-driven card grids (exact reference motion configs)             */
/* ------------------------------------------------------------------ */

function CardsGrid({
  type,
  theme,
}: {
  type: string;
  theme: SectionThemeName;
}) {
  /* In-site project preview state (project branch below). Declared at the
     top so the hook is unconditional regardless of the grid type. */
  const [previewProject, setPreviewProject] = React.useState<Project | null>(
    null
  );

  let grid: React.ReactNode = null;

  if (type === "project") {
    grid = (
      <>
        <div className="flex flex-wrap w-full gap-2">
          {projects.map((item, i) => (
            <motion.div
              key={item.title}
              /* min-w-0: the flex item must be allowed to shrink below the
                 card's nowrap highlight line, or phones overflow. */
              className="min-w-0"
              initial={{ opacity: 0, y: 28, x: i % 2 == 0 ? 20 : -20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.07 * i }}
            >
              <ProjectCard
                project={item}
                onPreview={() => setPreviewProject(item)}
              />
            </motion.div>
          ))}
        </div>
        <ProjectPreviewModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
        />
      </>
    );
  } else if (type === "service") {
    grid = (
      <div className="flex flex-wrap w-full gap-2">
        {services.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 22, x: i % 2 == 0 ? 18 : -18 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 * i }}
          >
            <ServiceCard service={item} />
          </motion.div>
        ))}
      </div>
    );
  } else if (type === "funFact") {
    grid = (
      <div className="flex flex-wrap w-full gap-2">
        {funFacts.map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, y: 20, x: i % 2 == 0 ? 12 : -12 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.04 * i }}
          >
            <FunFactCard fact={item} />
          </motion.div>
        ))}
      </div>
    );
  } else if (type === "experience") {
    grid = (
      <div className="flex flex-wrap w-full gap-2">
        {experience.map((item, i) => (
          <motion.div
            key={item.company}
            initial={{ opacity: 0, y: 26, x: 16 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 * i }}
          >
            <ExperienceCard item={item} />
          </motion.div>
        ))}
      </div>
    );
  } else if (type === "education") {
    grid = (
      <div className="flex flex-wrap w-full gap-2">
        {education.map((item, i) => (
          <motion.div
            key={item.degree}
            className="w-full"
            initial={{ opacity: 0, y: 26, x: -16 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 * i }}
          >
            <EducationCard item={item} />
          </motion.div>
        ))}
      </div>
    );
  } else if (type === "certification") {
    grid = <CertGallery certifications={certifications} />;
  } else if (type === "skillCategory") {
    grid = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SkillsShowcase categories={skills} />
      </motion.div>
    );
  }
  return grid;
}

/* ------------------------------------------------------------------ */
/* Section wrapper (exact reference structure)                         */
/* ------------------------------------------------------------------ */

type SpecialSectionId = "about" | "resume" | "contact" | "none";

export function Section({
  id,
  title,
  icon,
  theme,
  cardType,
}: {
  id: string;
  title: string;
  icon: LucideIcon;
  theme: SectionThemeName;
  cardType?: string;
}) {
  const special: SpecialSectionId =
    id === "about" || id === "resume" || id === "contact"
      ? (id as SpecialSectionId)
      : "none";

  const { t, pick } = useLang();

  let content: React.ReactNode = null;
  if (special === "about") {
    content = (
      <div className="flex flex-col gap-3 md:gap-4 max-w-[800px]">
        <motion.p
          className="text-justify text-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {t("about.pre")}{" "}
          <span className="text-primary">
            {pick(profile.fullName, profile.fullNameEn)}
          </span>
          {t("about.post")}{" "}
          {pick(profile.bio, profile.bioEn)}
        </motion.p>
      </div>
    );
  } else if (special === "resume") {
    content = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Button asChild variant="outline" size="lg" className="gap-2 w-fit">
          <Link href="/resume" aria-label={t("resume.ctaAria")}>
            <FileDown className="h-5 w-5" />
            {t("resume.cta")}
          </Link>
        </Button>
      </motion.div>
    );
  } else if (special === "contact") {
    content = (
      <div className="flex flex-col gap-4 md:gap-6 max-w-[800px]">
        <motion.p
          className="text-justify text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {pick(contactIntro, contactIntroEn)}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, x: 90, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <ContactForm />
        </motion.div>
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
        >
          {t("contact.orEmail")}{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-primary hover:underline font-medium"
          >
            {profile.email}
          </a>
        </motion.p>
      </div>
    );
  } else if (cardType) {
    content = <CardsGrid type={cardType} theme={theme} />;
  }

  const body = (
    <div className="flex flex-row gap-3 md:gap-6 items-stretch min-h-0">
      <SectionIndicator icon={icon} iconSize={28} theme={theme} />
      <div className="flex flex-col gap-3 md:gap-5 min-w-0 flex-1 pb-1">
        <div className="flex flex-col gap-1.5 md:gap-2">
          <SectionTitle text={title} theme={theme} />
          {content}
        </div>
      </div>
    </div>
  );

  return (
    <section id={id} className="scroll-mt-24 pb-8 md:pb-16">
      {/* The contact section hosts a form — keep it perfectly static for
          typing comfort; every other section gets the receding plane. */}
      {special === "contact" ? (
        body
      ) : (
        <DepthRegion
          backdrop={
            <>
              <div
                className={cn(
                  "absolute inset-0 rounded-[2.5rem] blur-3xl",
                  DEPTH_GLOW[theme]
                )}
              />
              <div className="depth-dot-grid absolute inset-0 rounded-[2.5rem]" />
            </>
          }
        >
          {body}
        </DepthRegion>
      )}
    </section>
  );
}
