"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransitionContext } from "@/components/providers/TransitionProvider";
import { Reveal, WordsInView } from "@/components/ui/Reveal";

const pad = (n) => String(n).padStart(2, "0");

function ProjectSpread({ project, index }) {
  const { navigate } = useTransitionContext();
  const router = useRouter();
  const href = `/project/${project.slug}`;
  const flip = index % 2 === 1;

  // Real anchors keep middle-click / new tab / crawlability; a plain click runs the
  // page-turn transition. Hover and focus warm the route (the old rows were buttons,
  // which Next never prefetches).
  const go = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href, `• ${project.title}`, "down", "project");
  };
  const warm = () => router.prefetch(href);

  return (
    <Reveal
      as="article"
      className={`grid items-end gap-x-[5vw] gap-y-8 border-t border-ink/20 py-[6vh] md:grid-cols-[5fr_7fr] ${flip ? "md:grid-cols-[7fr_5fr]" : ""} ${index >= 2 ? "max-md:hidden" : ""}`}
    >
      <div className={flip ? "md:order-2" : ""}>
        <span className="display mb-[2vh] block text-[clamp(4rem,10vw,9rem)] font-light italic leading-[.8] text-vermilion-bright" aria-hidden="true">{pad(index + 1)}</span>
        <h3 className="display text-[clamp(2rem,4.4vw,4.2rem)] font-normal leading-none tracking-[-0.03em]">
          <a href={href} onClick={go} onMouseEnter={warm} onFocus={warm} className="hover:text-vermilion">{project.title}</a>
        </h3>
        <p className="display my-6 max-w-[38ch] text-[1.08rem] italic leading-[1.55] text-ink/70">{project.tagline}</p>
        {project.result && (
          <p className="mb-6 max-w-[44ch] border-l-2 border-vermilion pl-4 text-[.98rem] leading-[1.5]">
            <span className="folio mr-2 text-[10px] text-vermilion">Result</span>{project.result}
          </p>
        )}
        <dl className="folio border-t border-ink text-[11px] normal-case tracking-[0.04em]">
          {[["Role", project.role], ["When", project.timeline], ["Stack", (project.stack || project.languages || []).slice(0, 5).join(", ")]].map(([k, v]) => v && (
            <div key={k} className="grid grid-cols-[4.5rem_1fr] border-b border-ink/20 py-2">
              <dt className="uppercase tracking-[0.12em] text-ink/70">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <a href={href} onClick={go} onMouseEnter={warm} onFocus={warm} className="group mt-6 inline-block border-b border-ink pb-0.5 text-[.95rem] font-medium hover:border-vermilion hover:text-vermilion">
          Read the case study <i className="inline-block not-italic transition-transform duration-300 group-hover:translate-x-1.5">→</i>
        </a>
      </div>

      <figure>
        <a href={href} onClick={go} tabIndex={-1} aria-hidden="true" className="group block overflow-hidden border border-ink bg-ink/5 p-2.5">
          <div className="relative aspect-[3360/2280] overflow-hidden">
            <Image src={project.image} alt="" fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035]" />
          </div>
        </a>
        <figcaption className="folio mt-3 text-[10.5px] text-ink/70">Fig. {index + 1} — {project.fullTitle || project.title}</figcaption>
      </figure>
    </Reveal>
  );
}

export default function Projects({ projects = [] }) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-ground px-[3vw] pb-[8vh] pt-[8vh]">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-[6vh] grid gap-x-[3vw] border-t border-ink pt-4 md:grid-cols-[2fr_8fr]">
          <p className="folio text-vermilion">№ 04 — Selected work <span className="text-ink/70">({pad(projects.length)})</span></p>
          <h2 id="projects-title" className="display text-[clamp(3rem,9vw,9rem)] font-light leading-[.9]">
            <WordsInView text="Case studies" />
          </h2>
        </header>
        {projects.map((p, i) => <ProjectSpread key={p.slug} project={p} index={i} />)}
      </div>
    </section>
  );
}
