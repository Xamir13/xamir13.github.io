import { Suspense } from "react";
import type { Metadata } from "next";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BlogList } from "@/components/site/blog-list";

export const metadata: Metadata = {
  title: "بلاگ — امیرعلی طاهری",
  description:
    "نوشته‌هایی درباره توسعه وب، Next.js، TypeScript، کارایی و فونت فارسی در وب.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="grow">
        <div className="mx-auto max-w-5xl px-3 py-8 sm:px-4 md:px-8 md:py-16">
          <Suspense fallback={null}>
            <BlogList />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
