"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { heroData, profileData } from "@/lib/data";
import { Words } from "@/components/ui/Reveal";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const TextLink = ({ href, children }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" className="group relative font-medium text-ink">
    {children}
    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-50 bg-vermilion transition-transform duration-500 group-hover:scale-x-100" />
  </Link>
);

// Splits a sentence on named tokens and swaps each for a real link, so the existing
// copy in lib/data.js stays the single source of truth.
const withLinks = (text, map) => {
  const keys = Object.keys(map).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text.split(new RegExp(`(${keys.join("|")})`)).map((part, i) => (map[part] ? <TextLink key={i} href={map[part]}>{part}</TextLink> : part));
};

export default function Hero() {
  const { isInitialLoadComplete } = useTransitionContext();
  const on = isInitialLoadComplete;

  return (
    <section id="hero" className={`relative flex min-h-[100svh] flex-col overflow-hidden pt-[6.5rem] md:pt-[8.5rem] ${on ? "hero-on" : ""}`}>
      <div className="mx-auto grid w-full max-w-[1500px] flex-1 grid-cols-1 items-end gap-y-8 px-[4vw] pb-10 md:grid-cols-[7fr_5fr] md:gap-x-[3vw] md:pb-14">
        <div className="relative z-10 order-2 md:order-1">
          <p className="folio mb-5 flex gap-4 text-ink/60"><span className="text-vermilion">№ 01</span> The engineer</p>
          <h1 className="display text-[clamp(4.6rem,15vw,15rem)] font-light leading-[0.8] tracking-[-0.045em]">
            <span className="block"><Words text="Aniket" on={on} base={100} step={110} /></span>
            <span className="block pl-[0.7em] italic text-vermilion"><Words text="Saha" on={on} base={260} step={110} /></span>
          </h1>
          <p className="display mt-6 text-[clamp(1.1rem,2.1vw,1.9rem)] italic leading-tight">
            <Words text={profileData.roles.join(" · ")} on={on} base={700} step={50} />
          </p>
          <p className="mt-5 max-w-[52ch] text-[clamp(.98rem,1.2vw,1.15rem)] leading-[1.6] text-ink/70">
            {withLinks(heroData.description, { React: heroData.links.react, "Next.js": heroData.links.nextjs })}
          </p>
          <p className="mt-3 max-w-[52ch] text-[.95rem] leading-[1.6] text-ink/60">
            {withLinks(heroData.socialDescription, { LinkedIn: heroData.links.linkedin, GitHub: heroData.links.github })}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("nav-scroll", { detail: { target: "projects" } })); }}
              className="group inline-flex items-center gap-5 bg-ink px-6 py-3.5 text-[.92rem] font-medium text-ground transition-colors duration-300 hover:bg-vermilion"
            >
              Read the work <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>
            <a href={heroData.links.resume} target="_blank" rel="noopener noreferrer" aria-label="Download résumé (PDF)" className="border-b border-ink pb-0.5 text-[.9rem] font-medium transition-colors hover:border-vermilion hover:text-vermilion">
              Résumé (PDF)
            </a>
          </div>
          <p className="mt-6 text-[.95rem] font-medium text-ink/70">{heroData.ctaText}</p>
        </div>

        <figure className="relative order-1 w-[70%] justify-self-end md:order-2 md:w-full md:max-w-[460px]">
          <div className="absolute -right-[3vw] bottom-9 top-8 w-[62%] origin-bottom scale-y-0 bg-vermilion-bright transition-transform duration-[1300ms] ease-[cubic-bezier(.76,0,.24,1)] [.hero-on_&]:scale-y-100" style={{ transitionDelay: ".5s" }} aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-ink/10 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(.76,0,.24,1)] [.hero-on_&]:[clip-path:inset(0_0_0_0)]" style={{ transitionDelay: ".35s" }}>
            <Image src="/portrait-hero-bw.jpg" alt="Aniket Saha" fill priority sizes="(max-width: 768px) 70vw, 460px" className="object-cover" />
          </div>
          <figcaption className="folio relative mt-3 text-[10px] text-ink/60">Fig. 1 — The author.</figcaption>
        </figure>
      </div>

      <div className="border-t border-ink pt-[6vh] leading-none" aria-hidden="true">
        <div className="flex w-max items-center gap-[2.4rem] whitespace-nowrap font-display text-[clamp(1.4rem,2.6vw,2.4rem)] italic [--duration:46s] [--gap:2.4rem]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 animate-marquee items-center gap-[2.4rem]">
              {[...profileData.roles, "Python", "TypeScript", "Next.js", "LLM systems", "Automation"].map((t) => (
                <span key={t + k} className="inline-flex items-center gap-[.45em] pb-[.12em] leading-none">{t} <em className="not-italic text-vermilion-bright">✶</em></span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
