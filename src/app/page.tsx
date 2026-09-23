"use client";

import {
  Award,
  Briefcase,
  CodeXml,
  FileDown,
  GraduationCap,
  Layers,
  Lightbulb,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import { useLang } from "@/lib/lang";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { TechRush } from "@/components/site/tech-rush";
import { Section } from "@/components/site/section";
import { Footer } from "@/components/site/footer";

export default function Home() {
  const { t } = useLang();

  return (
    <>
      <Navbar />
      <main id="main-content" className="grow">
        <section id="hero" className="scroll-mt-24">
          <Hero />
        </section>
        <div className="border-y border-border/40 bg-muted/20">
          <TechRush />
        </div>
        <div className="mx-auto max-w-5xl overflow-x-clip px-3 py-8 sm:px-4 md:px-8 md:py-16">
          <Section
            id="projects"
            title={t("sec.projects")}
            icon={Lightbulb}
            theme="work"
            cardType="project"
          />
          <Section id="about" title={t("sec.about")} icon={User} theme="about" />
          <Section
            id="services"
            title={t("sec.services")}
            icon={CodeXml}
            theme="about"
            cardType="service"
          />
          <Section
            id="fun-facts"
            title={t("sec.facts")}
            icon={Sparkles}
            theme="about"
            cardType="funFact"
          />
          <Section id="resume" title={t("sec.resume")} icon={FileDown} theme="about" />
          <Section
            id="experience"
            title={t("sec.experience")}
            icon={Briefcase}
            theme="experience"
            cardType="experience"
          />
          <Section
            id="education"
            title={t("sec.education")}
            icon={GraduationCap}
            theme="experience"
            cardType="education"
          />
          <Section
            id="certifications"
            title={t("sec.certs")}
            icon={Award}
            theme="primary"
            cardType="certification"
          />
          <Section
            id="skills"
            title={t("sec.skills")}
            icon={Layers}
            theme="primary"
            cardType="skillCategory"
          />
          <Section id="contact" title={t("sec.contact")} icon={Mail} theme="contact" />
        </div>
      </main>
      <Footer />
    </>
  );
}
