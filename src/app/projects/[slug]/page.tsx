import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailView } from "@/components/site/project-detail-view";
import { shortHash } from "@/lib/utils";
import { withBase } from "@/lib/paths";
import { projects, getProjectBySlug } from "@/lib/site-data";

/* ------------------------------------------------------------------ */
/* Project detail route — thin server shell (static params, metadata   */
/* and JSON-LD). The rendered view lives in <ProjectDetailView>, a     */
/* fully bilingual client component, so English mode is complete.      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "پروژه پیدا نشد" };

  /* Project social preview from /api/og — chip shows the portfolio kind. */
  const ogImage = `/api/og?${new URLSearchParams({
    title: project.title,
    chip: "نمونه‌کار",
    /* Content-hash key: preview refreshes when the project changes. */
    v: shortHash(project.title),
  }).toString()}`;

  return {
    title: `${project.title} — پروژه`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: [{ url: withBase(ogImage), alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [withBase(ogImage)],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            inLanguage: "fa",
            keywords: project.techAll.concat(project.tags).join(", "),
            author: {
              "@type": "Person",
              name: "امیرعلی طاهری",
            },
            ...(project.githubUrl ? { sameAs: project.githubUrl } : {}),
          }),
        }}
      />
      <ProjectDetailView project={project} />
    </main>
  );
}
