import React from "react";
import Image from "next/image";
import { aboutText, profileData } from "@/lib/data";
import { Reveal, WordsInView } from "@/components/ui/Reveal";

// Server component: the About copy is static, so none of it ships as client JS
// except the two tiny reveal wrappers.
const paragraphs = aboutText.split(/\n\s*\n/).map((s) => s.trim());

export default function About() {
  const [first, ...rest] = paragraphs;
  const mine = profileData.aboutMe.description.trim().replace("I build systems, not just applications. ", "");
  return (
    <section id="about" aria-labelledby="about-title" className="bg-ground px-[3vw] pb-[8vh] pt-[6vh]">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-[5vh] grid gap-x-[3vw] border-t border-ink pt-4 md:grid-cols-[2fr_8fr]">
          <p className="folio text-vermilion">№ 02 — About</p>
          <h2 id="about-title" className="display max-w-[14em] text-[clamp(2.2rem,5vw,4.8rem)] font-light leading-[1]">
            <WordsInView text="It started with a website I wanted to build." />
          </h2>
        </div>

        <div className="grid items-start gap-[3vw] lg:grid-cols-[2fr_5fr_3fr]">
          <aside className="folio border-t border-ink/20 pt-4 normal-case leading-relaxed tracking-normal text-ink/70 lg:sticky lg:top-32 lg:text-[11px]">
            <p className="mb-3 uppercase tracking-[0.14em] text-ink">Portfolio note</p>
            {profileData.aboutPortfolio.description.trim()}
          </aside>

          <article className="grid max-w-[44em] gap-4 font-display text-[clamp(1rem,1.15vw,1.12rem)] leading-[1.6]">
            <Reveal><p className="first-letter:float-left first-letter:pr-[.1em] first-letter:pt-[.06em] first-letter:text-[4.6em] first-letter:font-light first-letter:leading-[.78] first-letter:text-vermilion-bright">{first}</p></Reveal>
            {rest.map((p, i) => <Reveal key={i} delay={(i + 1) * 80}><p>{p}</p></Reveal>)}
            <Reveal>
              <blockquote className="display my-1 border-y border-ink py-4 text-[clamp(1.5rem,2.3vw,2.2rem)] font-light italic leading-[1.15] tracking-[-0.02em]">
                “I build systems, not just applications.”
              </blockquote>
            </Reveal>
            <Reveal><p>{mine}</p></Reveal>
          </article>

          <Reveal as="figure" className="lg:max-w-[360px]">
            <div className="relative aspect-[4/5] overflow-hidden border border-ink bg-ink/5">
              <Image src="/portrait-about-cafe.jpg" alt="Aniket Saha seated at a café window, chin on hand, looking out" fill sizes="(max-width: 1024px) 80vw, 360px" className="object-cover object-center" />
            </div>
            <figcaption className="folio mt-3 text-[10.5px] text-ink/70">Fig. 2 — Aniket Saha</figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
