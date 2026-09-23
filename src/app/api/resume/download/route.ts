import { NextResponse } from "next/server";
import { GlobalFonts, PDFDocument } from "@napi-rs/canvas";
import path from "path";

import {
  education,
  experience,
  profile,
  projects,
  resumeLanguages,
  resumeSummary,
  skills,
} from "@/lib/site-data";

/* The PDF is fully deterministic (site-data + fonts only, no database or
   request input) — rendered once at build time. Under static export the
   generated PDF becomes a plain static file on GitHub Pages. */
export const dynamic = "force-static";

/* Real resume download: the PDF is generated server-side from the same
   site-data the /resume page renders, using the exact Dana fonts of the
   site (TTF conversions already used by /api/og). The response streams
   with Content-Disposition: attachment so the browser DOWNLOADS the file
   instead of navigating to it — no print dialog involved. */

const FONT_DIR = path.join(process.cwd(), "public", "fonts", "og");
GlobalFonts.registerFromPath(path.join(FONT_DIR, "Dana-DemiBold.ttf"), "DanaDemiBold");
GlobalFonts.registerFromPath(path.join(FONT_DIR, "Dana-Regular.ttf"), "DanaRegular");

/* A4 in PDF points (72 dpi) */
const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

/* Resume page identity colors (indigo accents on white, like /resume) */
const ACCENT = "#4338ca";
const TEXT = "#18181b";
const MUTED = "#52525b";
const FAINT = "#a1a1aa";
const RULE = "#e4e4e7";

const toFa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

function wrapText(
  ctx: { measureText(text: string): { width: number } },
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function GET() {
  const pdf = new PDFDocument({
    title: "امیرعلی طاهری — رزومه",
    author: profile.fullName,
    subject: profile.role,
    creator: "امیرعلی طاهری — وب‌سایت شخصی",
  });

  let ctx = pdf.beginPage(PAGE_W, PAGE_H);
  let y = MARGIN;
  let pageNumber = 1;

  const stampFooter = () => {
    ctx.direction = "rtl";
    ctx.font = "8.5 DanaRegular";
    ctx.fillStyle = FAINT;
    ctx.textAlign = "center";
    ctx.fillText(
      `${profile.fullName} — رزومه  |  ${toFa(pageNumber)}`,
      PAGE_W / 2,
      PAGE_H - MARGIN / 2
    );
  };

  const ensureSpace = (needed: number) => {
    if (y + needed <= PAGE_H - MARGIN - 24) return;
    stampFooter();
    pdf.endPage();
    pageNumber += 1;
    ctx = pdf.beginPage(PAGE_W, PAGE_H);
    y = MARGIN;
  };

  const rightText = (
    text: string,
    size: number,
    font: "DanaDemiBold" | "DanaRegular",
    color: string
  ) => {
    ctx.direction = "rtl";
    ctx.font = `${size} ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = "right";
    ctx.fillText(text, PAGE_W - MARGIN, y);
  };

  const sectionHeading = (title: string) => {
    ensureSpace(46);
    y += 14;
    ctx.direction = "rtl";
    ctx.font = `13 DanaDemiBold`;
    ctx.fillStyle = ACCENT;
    ctx.textAlign = "right";
    ctx.fillText(title, PAGE_W - MARGIN, y);
    ctx.strokeStyle = RULE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(MARGIN, y + 7);
    ctx.lineTo(PAGE_W - MARGIN, y + 7);
    ctx.stroke();
    y += 20;
  };

  const paragraph = (
    text: string,
    size = 10.5,
    color = TEXT,
    lineHeight = 17
  ) => {
    ctx.font = `${size} DanaRegular`;
    const lines = wrapText(ctx, text, CONTENT_W);
    for (const line of lines) {
      ensureSpace(lineHeight);
      rightText(line, size, "DanaRegular", color);
      y += lineHeight;
    }
  };

  /* ---------------- Header (page 1) ---------------- */
  ctx.direction = "rtl";
  ctx.font = "30 DanaDemiBold";
  ctx.fillStyle = ACCENT;
  ctx.textAlign = "right";
  ctx.fillText(profile.fullName, PAGE_W - MARGIN, y + 28);
  y += 48;

  rightText(`${profile.role} — ${profile.location}`, 12, "DanaRegular", MUTED);
  y += 22;

  /* Pure-Latin contact line (single LTR run — avoids bidi mixing) */
  const latinContact = `${profile.email}   |   ${profile.phone}   |   github.com/azazamir139-glitch   |   t.me/azazamir139`;
  ctx.font = "10 DanaRegular";
  if (ctx.measureText(latinContact).width > CONTENT_W) {
    rightText(`${profile.email}   |   ${profile.phone}`, 10, "DanaRegular", TEXT);
    y += 16;
    rightText(
      "github.com/azazamir139-glitch   |   t.me/azazamir139",
      10,
      "DanaRegular",
      TEXT
    );
    y += 16;
  } else {
    rightText(latinContact, 10, "DanaRegular", TEXT);
    y += 16;
  }

  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(MARGIN, y + 6);
  ctx.lineTo(PAGE_W - MARGIN, y + 6);
  ctx.stroke();
  y += 16;

  /* ---------------- خلاصه ---------------- */
  sectionHeading("خلاصه");
  paragraph(resumeSummary);

  /* ---------------- تجربه‌ها ---------------- */
  sectionHeading("تجربه‌ها");
  for (const item of experience) {
    ensureSpace(64);
    rightText(item.company, 13, "DanaDemiBold", TEXT);
    if (item.period) {
      ctx.font = "10 DanaRegular";
      ctx.fillStyle = FAINT;
      ctx.textAlign = "left";
      ctx.direction = "ltr";
      ctx.fillText(item.period, MARGIN, y);
    }
    y += 19;
    rightText(item.role, 11, "DanaRegular", ACCENT);
    y += 16;
    paragraph(item.description, 10.5, MUTED, 16);
    y += 8;
  }

  /* ---------------- پروژه‌ها ---------------- */
  sectionHeading("پروژه‌های شاخص");
  for (const project of projects) {
    ensureSpace(56);
    rightText(project.title, 12.5, "DanaDemiBold", TEXT);
    const tech = project.techAll.slice(0, 4).join(", ");
    if (tech) {
      ctx.font = "9.5 DanaRegular";
      ctx.fillStyle = FAINT;
      ctx.textAlign = "left";
      ctx.direction = "ltr";
      ctx.fillText(tech, MARGIN, y);
    }
    y += 18;
    paragraph(project.description, 10.5, MUTED, 16);
    y += 8;
  }

  /* ---------------- تحصیلات ---------------- */
  sectionHeading("تحصیلات");
  for (const item of education) {
    ensureSpace(48);
    if (item.school) {
      rightText(item.school, 12.5, "DanaDemiBold", TEXT);
      if (item.period) {
        ctx.font = "10 DanaRegular";
        ctx.fillStyle = FAINT;
        ctx.textAlign = "left";
        ctx.direction = "ltr";
        ctx.fillText(item.period, MARGIN, y);
      }
      y += 18;
    }
    rightText(item.degree, 11, "DanaRegular", ACCENT);
    y += 16;
    if (item.status) paragraph(item.status, 10.5, MUTED, 16);
    if (item.focus) paragraph(item.focus, 9.5, FAINT, 14);
    y += 6;
  }

  /* ---------------- مهارت‌ها ---------------- */
  sectionHeading("مهارت‌های فنی");
  for (const category of skills) {
    ensureSpace(26);
    const names = category.skills.map((s) => s.name).join("، ");
    rightText(`${category.title}:`, 11, "DanaDemiBold", TEXT);
    y += 15;
    paragraph(names, 10.5, MUTED, 16);
    y += 4;
  }

  /* ---------------- زبان‌ها ---------------- */
  sectionHeading("زبان‌ها");
  paragraph(
    resumeLanguages.map((l) => `${l.name} (${l.level})`).join("  |  "),
    10.5,
    MUTED,
    16
  );

  stampFooter();
  pdf.endPage();
  const buffer = pdf.close();

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="AmirAli-Taheri-Resume.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
