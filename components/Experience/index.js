import React from "react";
import { profileData, codingProfiles, heroData } from "@/lib/data";
import { Reveal, WordsInView } from "@/components/ui/Reveal";
import GithubHeatmap, { Legend, getContributions, summarise } from "./GithubHeatmap";

const pad = (n) => String(n).padStart(2, "0");

const Row = ({ when, title, sub, items, thin }) => (
  <Reveal className={`grid gap-[3vw] border-t border-ink/20 md:grid-cols-[2fr_5fr_4fr] ${thin ? "py-3" : "py-[2.6vh]"}`}>
    <p className="folio pt-2 text-[11px] normal-case tracking-[0.06em] text-ink/70">{when}</p>
    <div>
      <h3 className="display text-[clamp(1.4rem,2.2vw,2rem)] font-normal leading-[1.15] tracking-[-0.02em]">{title}</h3>
      {sub && <p className="folio mt-2 text-[11px] normal-case tracking-[0.04em] text-ink/70">{sub}</p>}
    </div>
    <ul className="grid gap-2 text-[.95rem] leading-[1.55] text-ink/70">
      {items.map((b) => <li key={b}>{b}</li>)}
    </ul>
  </Reveal>
);

/** Résumé-style experience: date | role | detail. Previously only reachable inside the profile drawer. */
export default async function Experience() {
  const days = await getContributions(profileData.githubUsername);
  const stats = days ? summarise(days) : null;
  return (
    <section id="experience" aria-labelledby="experience-title" className="bg-ground px-[3vw] pb-[10vh] pt-[8vh]">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-[6vh] grid items-baseline gap-x-[3vw] border-t border-ink pt-4 md:grid-cols-[2fr_6fr_3fr]">
          <p className="folio text-vermilion">№ 05 — Curriculum vitae</p>
          <h2 id="experience-title" className="display text-[clamp(2.6rem,6.4vw,6.4rem)] font-light leading-none">
            <WordsInView text="Experience" />
          </h2>
          <a href={heroData.links.resume} target="_blank" rel="noopener noreferrer" className="folio justify-self-start border-b border-ink hover:border-vermilion hover:text-vermilion md:justify-self-end">
            Download full CV ↓
          </a>
        </header>

        {profileData.experience.map((e) => (
          <Row key={e.company} when={e.period} title={<>{e.role}, <i className="text-vermilion">{e.company}</i></>} sub={e.type} items={e.bullets} />
        ))}

        <p className="folio mb-1 mt-[6vh] border-b border-ink pb-2 font-medium [&+*]:border-t-0">Education</p>
        {profileData.education.map((e) => (
          <Row key={e.degree} when={e.period} title={e.degree} sub={e.institution} items={[e.description.trim()]} />
        ))}

        <p className="folio mb-1 mt-[6vh] border-b border-ink pb-2 font-medium [&+*]:border-t-0">Problem solving</p>

        {/* Contribution heatmap, set as the first row of the table so it shares the same columns. */}
        {days && (
          <figure className="grid gap-x-[3vw] gap-y-4 border-t border-ink/20 py-[2.6vh] md:grid-cols-[2fr_9fr]">
            <figcaption className="grid content-start gap-3">
              <p className="folio pt-1 text-[11px] normal-case tracking-[0.06em] text-ink/70">GitHub, last 12 months</p>
              <p className="display text-[clamp(2.6rem,4.4vw,4rem)] font-light leading-[.9] text-vermilion">
                {stats.active}
                <span className="folio ml-2 text-[11px] normal-case tracking-[0.06em] text-ink/70">active days</span>
              </p>
              <a
                href={profileData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="folio w-fit border-b border-ink text-[11px] normal-case tracking-[0.06em] hover:border-vermilion hover:text-vermilion"
              >
                @{profileData.githubUsername} ↗
              </a>
            </figcaption>
            <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} role="group" aria-label="GitHub contribution heatmap, scrollable">
              <div className="min-w-[700px] max-w-[980px]">
                <GithubHeatmap days={days} />
                <Legend />
              </div>
            </div>
          </figure>
        )}
        {codingProfiles.map((c) => (
          <Row
            key={c.name}
            thin
            when={pad(Number(c.index))}
            title={<a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-vermilion">{c.name}</a>}
            items={[c.stats]}
          />
        ))}
      </div>
    </section>
  );
}
