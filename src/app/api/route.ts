import { NextResponse } from "next/server";

/** Static "hello" probe — rendered once at build time under static export. */
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}
