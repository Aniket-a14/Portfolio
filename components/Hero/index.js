"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { heroData, nowNote, profileData } from "@/lib/data";
import { Words } from "@/components/ui/Reveal";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

// Highlighter-marker links: the band sweeps in once the hero has revealed (the stagger is --hl-d), and darkens on hover.
const TextLink = ({ href, children, order }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="hl hl-link font-medium text-ink"
    style={{ "--hl-d": `${1.8 + order * 0.3}s` }}
  >
    {children}
  </Link>
);

// Splits a sentence on named tokens and swaps each for a real link, so the existing
// copy in lib/data.js stays the single source of truth. `first` is the order of the first link (for the stagger).
const withLinks = (text, map, first = 0) => {
  const keys = Object.keys(map).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  let n = first;
  return text.split(new RegExp(`(${keys.join("|")})`)).map((part, i) => (map[part] ? <TextLink key={i} href={map[part]} order={n++}>{part}</TextLink> : part));
};

export default function Hero() {
  const { isInitialLoadComplete } = useTransitionContext();
  const on = isInitialLoadComplete;

  return (
    <section id="hero" className={`relative flex min-h-[100svh] flex-col overflow-hidden pt-[5.25rem] md:pt-[8.5rem] ${on ? "hero-on" : ""}`}>
      <div className="mx-auto grid w-full max-w-[1500px] flex-1 grid-cols-1 items-end gap-y-8 px-[4vw] pb-10 md:grid-cols-[7fr_5fr] md:gap-x-[3vw] md:pb-14">
        <div className="relative z-10 order-2 md:order-1">
          {/* "Right now" note: a taped-on aside with a hand-drawn arrow to the name. Wide screens only, where
              there is room beside the name; the footer carries the same availability line everywhere else. */}
          <aside
            aria-label={nowNote.label}
            className="absolute right-[1%] top-[4.2rem] hidden w-[205px] rotate-[3deg] border border-ink/20 px-4 py-3.5 opacity-0 shadow-[4px_6px_0_rgb(var(--ink)/0.12)] transition-opacity duration-700 [background:color-mix(in_srgb,rgb(var(--ink))_6%,rgb(var(--ground)))] [.hero-on_&]:opacity-100 xl:block"
            style={{ transitionDelay: "1.9s" }}
          >
            <p className="folio mb-1.5 flex items-center gap-1.5 text-[10px] text-ink"><span aria-hidden="true" className="size-1.5 rounded-full bg-vermilion" />{nowNote.label}</p>
            <p className="display text-[1.02rem] italic font-light leading-[1.3]">{nowNote.text}</p>
            <svg aria-hidden="true" viewBox="0 0 110 50" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="absolute -left-[4.4rem] top-[3.2rem] w-[5.6rem] -rotate-[8deg] text-vermilion">
              <path d="M104 8C70 2 40 14 10 40M10 40l12-3M10 40l3-12" />
            </svg>
          </aside>
          <p className="folio mb-5 flex gap-4 text-ink/70"><span className="text-vermilion">№ 01</span> The engineer</p>
          <h1 className="display text-[clamp(4.6rem,15vw,15rem)] font-light leading-[0.8] tracking-[-0.045em]">
            <span className="block"><Words text="Aniket" on={on} base={100} step={110} /></span>
            <span className="block pl-[0.7em] italic text-vermilion"><Words text="Saha" on={on} base={260} step={110} /></span>
          </h1>
          <p className="display mt-6 text-[clamp(1.1rem,2.1vw,1.9rem)] italic leading-tight tracking-[-0.005em] [font-variation-settings:'opsz'_48,'SOFT'_30]">
            <Words text={profileData.roles.join(" · ")} on={on} base={700} step={50} />
          </p>
          <p className="mt-5 max-w-[52ch] text-[clamp(.98rem,1.2vw,1.15rem)] leading-[1.6] text-ink/70">
            {withLinks(heroData.description, { React: heroData.links.react, "Next.js": heroData.links.nextjs })}
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
        </div>

        <figure className="relative order-1 w-[74%] justify-self-center md:order-2 md:justify-self-end md:w-full md:max-w-[460px]">
          <div className="absolute -right-[3vw] bottom-9 top-8 w-[62%] origin-bottom scale-y-0 bg-vermilion-fill transition-transform duration-[1300ms] ease-[cubic-bezier(.76,0,.24,1)] [.hero-on_&]:scale-y-100" style={{ transitionDelay: ".5s" }} aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-ink/10 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(.76,0,.24,1)] [.hero-on_&]:[clip-path:inset(0_0_0_0)]" style={{ transitionDelay: ".35s" }}>
            <Image src="/portrait-hero-bw.jpg" alt="Aniket Saha" fill priority sizes="(max-width: 768px) 70vw, 460px" className="object-cover" />
          </div>
          <figcaption className="folio relative mt-3 text-[10px] text-ink/70">Fig. 1 — The author.</figcaption>
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
