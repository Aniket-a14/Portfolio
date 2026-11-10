import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SearchButton from "@/components/CommandPalette/SearchButton";

export const metadata = {
  title: "Page not found | Portfolio",
  robots: { index: false, follow: true },
};

const LINK =
  "folio inline-flex min-h-[40px] items-center border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-ground focus-visible:bg-ink focus-visible:text-ground";

/**
 * 404, set as a newspaper correction ("Erratum"). It used to play a fake terminal install and redirect home
 * after eight seconds, which threw visitors off a page they might want to read; this one stays put and offers
 * three ways back in.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col bg-ground text-ink">
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between border-b border-ink px-6 py-4 md:px-12">
        <Link href="/" className="display text-xl leading-none tracking-[-0.02em] hover:text-vermilion">Aniket Saha</Link>
        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
        </div>
      </header>

      <main className="grid flex-1 place-items-center px-6 py-[6vh]">
        <section className="w-full max-w-[640px] border-[3px] border-double border-ink p-[clamp(1.3rem,4vw,3.4rem)] text-center">
          <p className="folio border-b border-ink pb-2.5 tracking-[0.3em] text-vermilion">Erratum</p>
          <h1 className="display mt-6 text-[clamp(2.2rem,6vw,4.4rem)] font-light leading-[1.02] tracking-[-0.04em]">
            The page you asked for was not printed in this edition.
          </h1>
          <p className="mx-auto mt-5 max-w-[32em] leading-[1.6] text-ink/70">
            It may have moved, been renamed or never existed. Nothing is wrong on your end.
          </p>
          <nav aria-label="Where to next" className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/" className={LINK}>Back to the front page</Link>
            <Link href="/#projects" className={LINK}>Projects</Link>
            <Link href="/blogs" className={LINK}>Articles</Link>
          </nav>
          <p className="folio mt-7 text-[10.5px] text-ink/70">Error 404 · Corrected in the next issue</p>
        </section>
      </main>
    </div>
  );
}
