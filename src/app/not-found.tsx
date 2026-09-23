import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import {
  NotFoundBody,
} from "@/components/site/localized-chrome";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="grow flex items-center justify-center px-4 py-32"
      >
        {/* Language-aware 404 body (client island). */}
        <NotFoundBody />
      </main>
      <Footer />
    </>
  );
}
