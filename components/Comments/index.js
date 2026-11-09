import Image from "next/image";
import Footer from "@/components/Footer";
import { reviews } from "@/lib/data";
import { Reveal, WordsInView } from "@/components/ui/Reveal";

// Letters to the editor. Replaces the auto-scrolling marquee: moving text cannot be
// paused or reliably read (WCAG 2.2.2), and these comments are short enough to read as typography.
export function Comments() {
  return (
    <>
      <section id="testimonials" aria-labelledby="letters-title" className="bg-ground px-[3vw] pb-[10vh] pt-[8vh]">
        <div className="mx-auto max-w-[1500px]">
          <header className="mb-[6vh] grid gap-x-[3vw] border-t border-ink pt-4 md:grid-cols-[2fr_8fr]">
            <p className="folio text-vermilion">№ 07 — Letters</p>
            <h2 id="letters-title" className="display text-[clamp(2.4rem,5.4vw,5.4rem)] font-light leading-none"><WordsInView text="From the readers" /></h2>
          </header>

          <div className="columns-1 gap-[3vw] sm:columns-2 lg:columns-3">
            {reviews.map((r, i) => {
              const short = r.body.trim().length < 60;
              return (
                <Reveal as="figure" key={r.username} delay={(i % 3) * 80} className="mb-[3vh] break-inside-avoid border-t border-ink pt-5">
                  <blockquote className={`display ${short ? "text-[2.6rem] italic leading-[1.05]" : "text-[1.45rem] leading-[1.25]"}`}>
                    <span aria-hidden="true" className="mr-[.08em] align-[-.25em] text-[1.6em] leading-[0] text-vermilion-bright">“</span>
                    {r.body.trim()}
                  </blockquote>
                  <figcaption className="folio mt-4 flex items-center gap-2.5 text-[11px] normal-case tracking-[0.06em]">
                    <Image src={r.img} alt="" width={28} height={28} className="size-7 rounded-full object-cover grayscale" />
                    <b className="font-medium uppercase tracking-[0.12em]">{r.name}</b>
                    <em className="not-italic text-ink/70">{r.username}</em>
                  </figcaption>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Comments;
