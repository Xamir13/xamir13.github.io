import { NextRequest } from "next/server";
import { createCanvas, GlobalFonts, SKRSContext2D } from "@napi-rs/canvas";
import path from "path";

/* GitHub Pages static export: the image is rendered ONCE at build time with
   the default title (per-title previews require a live server runtime).
   On server deployments this route keeps working per-request. */
export const dynamic = "force-static";

/* Dana TTFs (converted from the exact woff2 files used on the site, so the
   social-preview typography matches the locked UI fonts 1:1). */
const FONT_DIR = path.join(process.cwd(), "public", "fonts", "og");
GlobalFonts.registerFromPath(path.join(FONT_DIR, "Dana-DemiBold.ttf"), "DanaDemiBold");
GlobalFonts.registerFromPath(path.join(FONT_DIR, "Dana-Regular.ttf"), "DanaRegular");

const W = 1200;
const H = 630;

/* Theme tokens copied from globals.css (primary green of the reference site). */
const GREEN = "#16a34a";
const GREEN_SOFT = "rgba(22, 163, 74, 0.16)";
const BG_TOP = "#06120c";
const BG_BOTTOM = "#0d2a1a";
const TEXT = "#ecfdf5";
const MUTED = "#86efac";

function wrapText(
  ctx: SKRSContext2D,
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

function drawDataFlowLine(
  ctx: SKRSContext2D,
  y: number,
  xStart: number,
  xEnd: number
) {
  /* Echoes the site's .line-data-flow rail: faint track + moving packets. */
  ctx.strokeStyle = "rgba(22, 163, 74, 0.14)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(xStart, y);
  ctx.lineTo(xEnd, y);
  ctx.stroke();

  ctx.fillStyle = "rgba(22, 163, 74, 0.45)";
  for (let i = 0; i < 3; i++) {
    const x = xEnd - ((xEnd - xStart) * (i * 0.33 + 0.12)) % (xEnd - xStart);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderOg(
  title: string,
  chip: string | null,
  dateLabel: string | null,
  footerLeft: string
): Buffer {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  /* Background gradient */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, BG_TOP);
  bg.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Soft green glow, top-right */
  const glow = ctx.createRadialGradient(W - 140, 110, 40, W - 140, 110, 480);
  glow.addColorStop(0, "rgba(22, 163, 74, 0.22)");
  glow.addColorStop(1, "rgba(22, 163, 74, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  /* Data-flow rails (site signature) */
  drawDataFlowLine(ctx, 84, 64, 386);
  drawDataFlowLine(ctx, 84, 420, 1136);
  drawDataFlowLine(ctx, 500, 64, 820);
  drawDataFlowLine(ctx, 500, 886, 1136);

  /* RTL canvas */
  ctx.direction = "rtl";
  ctx.textAlign = "right";

  /* Top-right identity: آ monogram + name */
  ctx.beginPath();
  ctx.arc(W - 104, 108, 34, 0, Math.PI * 2);
  ctx.fillStyle = GREEN;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 34px DanaDemiBold";
  ctx.textBaseline = "middle";
  ctx.fillText("آ", W - 104, 112);

  ctx.font = "400 30px DanaRegular";
  ctx.fillStyle = TEXT;
  ctx.fillText("امیرعلی طاهری", W - 164, 110);
  ctx.textBaseline = "alphabetic";

  /* Chip (category / kind) */
  const CONTENT_RIGHT = W - 96;
  let cursorY = 210;
  if (chip) {
    ctx.font = "600 26px DanaDemiBold";
    const padX = 22;
    const chipW = Math.min(
      ctx.measureText(chip).width + padX * 2,
      W - 200
    );
    const chipH = 52;
    const r = chipH / 2;
    const chipX = CONTENT_RIGHT - chipW;
    ctx.beginPath();
    ctx.roundRect(chipX, cursorY - chipH + 12, chipW, chipH, r);
    ctx.fillStyle = GREEN_SOFT;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 163, 74, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.textAlign = "center";
    ctx.fillText(chip, chipX + chipW / 2, cursorY - chipH + 12 + chipH / 2 + 1);
    ctx.textAlign = "right";
    cursorY += chipH + 34;
  }

  /* Title — shrink to fit, max 2 lines, ellipsis-truncate if still too long
     (keeps the title block clear of the footer rail even for long titles) */
  let fontSize = 64;
  let lines: string[] = [];
  const maxWidth = W - 192;
  for (; fontSize >= 44; fontSize -= 4) {
    ctx.font = `600 ${fontSize}px DanaDemiBold`;
    lines = wrapText(ctx, title, maxWidth);
    if (lines.length <= 2) break;
  }
  const shown = lines.slice(0, 2);
  if (lines.length > 2) {
    let last = shown[1] ?? "";
    while (
      last &&
      ctx.measureText(`${last}…`).width > maxWidth &&
      last.includes(" ")
    ) {
      last = last.slice(0, last.lastIndexOf(" "));
    }
    shown[1] = `${last}…`;
  }
  const lineH = Math.round(fontSize * 1.5);
  ctx.font = `600 ${fontSize}px DanaDemiBold`;
  ctx.fillStyle = TEXT;
  for (const line of shown) {
    ctx.fillText(line, CONTENT_RIGHT, cursorY + lineH);
    cursorY += lineH;
  }

  /* Footer: date (right) + site label (left) */
  ctx.font = "400 26px DanaRegular";
  ctx.fillStyle = MUTED;
  ctx.fillText(dateLabel ?? "", CONTENT_RIGHT, H - 84);
  ctx.textAlign = "left";
  ctx.fillText(footerLeft, 96, H - 84);
  ctx.textAlign = "right";

  /* Green baseline strip */
  ctx.fillStyle = GREEN;
  ctx.fillRect(0, H - 8, W, 8);

  return canvas.toBuffer("image/png");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = (searchParams.get("title") ?? "امیرعلی طاهری")
      .slice(0, 140)
      .trim() || "امیرعلی طاهری";
    const chip = searchParams.get("chip")?.slice(0, 48).trim() || null;

    /* Persian long date from an ISO string, pre-formatted at call sites. */
    const dateLabel = searchParams.get("date")?.slice(0, 48).trim() || null;
    const footerLeft = searchParams.get("site")?.slice(0, 48).trim()
      || "بلاگ امیرعلی طاهری";

    const png = renderOg(title, chip, dateLabel, footerLeft);

    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("[og-image] failed:", error);
    return new Response("OG image generation failed.", { status: 500 });
  }
}
