import React from "react";
import { SKILL_GROUPS, skillReferences } from "@/lib/skills";
import { Reveal, WordsInView } from "@/components/ui/Reveal";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Index of capabilities, set like the back of a book: every skill with dotted leaders
 * and the case studies (by number) that actually use it. Skills that no case study
 * documents show an em dash, which is honest rather than decorative.
 */
export default function Skills({ projects = [] }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="bg-ground px-[3vw] pb-[10vh] pt-[8vh]">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-[6vh] grid gap-x-[3vw] border-t border-ink pt-4 md:grid-cols-[2fr_8fr]">
          <p className="folio text-vermilion">№ 03 — Index of capabilities</p>
          <h2 id="skills-title" className="display text-[clamp(2.4rem,5.4vw,5.4rem)] font-light leading-none">
            <WordsInView text="Skills, with page references" />
          </h2>
        </header>

        <div className="columns-1 gap-[4vw] md:columns-2 xl:columns-3">
          {SKILL_GROUPS.map(([group, list]) => (
            <Reveal key={group} className="mb-[5vh] break-inside-avoid">
              <h3 className="folio mb-1 border-b border-ink pb-2 font-medium text-ink">{group}</h3>
              <ul>
                {list.map((skill) => {
                  const refs = skillReferences(skill, projects);
                  return (
                    <li key={skill} className="flex items-baseline gap-2 py-1.5">
                      <span className="display text-[1.25rem] leading-tight">{skill}</span>
                      <i aria-hidden="true" className="flex-1 -translate-y-1 border-b border-dotted border-ink/40" />
                      <span
                        className="folio whitespace-nowrap text-[11px] text-vermilion"
                        aria-label={refs.length ? `Used in case studies ${refs.map((p) => p.title).join(", ")}` : "Not demonstrated in a case study"}
                      >
                        {refs.length ? refs.map((p) => pad(p.order ?? p.id)).join(", ") : "—"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>

        <footer className="folio mt-2 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/20 pt-5 text-[11px] normal-case tracking-[0.04em] text-ink/70">
          {projects.map((p) => (
            <span key={p.slug}>
              <b className="mr-1 font-medium text-vermilion">{pad(p.order ?? p.id)}</b>
              {p.title}
            </span>
          ))}
        </footer>
      </div>
    </section>
  );
}
