import { profileData } from "@/lib/data";
import { getAllProjects } from "@/lib/projects";

/**
 * What Ctrl+P prints on the home page: a one-page "masthead sheet" résumé built from the same data as the
 * site (lib/data.js and the case-study frontmatter), so it can never drift from the page. It is hidden on
 * screen and, when printing, replaces everything else (see the @media print block in globals.css).
 * Colours are fixed (black ink on white) so dark mode never prints a dark page.
 */
const SKILL_LABELS = {
  languages: "Languages",
  core: "Core CS",
  development: "Development",
  databases: "Databases",
  cloudAndDevops: "Cloud & DevOps",
  tools: "Tools",
};

const clip = (text = "", max = 150) => {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max).replace(/\s+\S*$/, "").replace(/[.,;:—-]+$/, "") + "…";
};
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function PrintSheet() {
  const p = profileData;
  const projects = getAllProjects();
  const [first, ...rest] = p.name.split(" ");

  return (
    <div id="print-sheet" aria-hidden="true">
      <div className="ps-mast">
        <span>Vol. 2026</span>
        <span>{p.name} · Curriculum Vitae</span>
        <span>aniketdesign.in</span>
      </div>
      <h1 className="ps-name">
        {first} <i>{rest.join(" ")}</i>
      </h1>
      <p className="ps-roles">{p.roles.join(" · ")}</p>
      <hr className="ps-rule" />

      <div className="ps-cols">
        <div>
          <h2>Experience</h2>
          {p.experience.map((e) => (
            <section key={e.company} className="ps-item">
              <div className="ps-row"><b>{e.role}, {e.company}</b><span>{e.period}</span></div>
              <div className="ps-sub">{e.type}</div>
              <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </section>
          ))}

          <h2>Highlights</h2>
          {p.achievements.map((a) => (
            <section key={a.title} className="ps-item">
              <div className="ps-row"><b>{a.title}</b><span>{a.period}</span></div>
              {a.sub && <div className="ps-sub">{a.sub}</div>}
              <ul>{a.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              {a.url && <div className="ps-url">{bare(a.url)}</div>}
            </section>
          ))}

          <h2>Projects</h2>
          {projects.map((pr) => (
            <section key={pr.slug} className="ps-item">
              <div className="ps-row"><b>{pr.title}</b><span>{pr.timeline || pr.year}</span></div>
              <div>{clip(pr.tagline, 150)}</div>
              <div className="ps-url">aniketdesign.in/project/{pr.slug}</div>
            </section>
          ))}
        </div>

        <div>
          <h2>Skills</h2>
          {Object.entries(p.skills).map(([k, v]) => (
            <p key={k} className="ps-skill"><b>{SKILL_LABELS[k] ?? k}:</b> {v.join(", ")}</p>
          ))}

          <h2>Education</h2>
          {p.education.map((e) => (
            <section key={e.degree} className="ps-item">
              <b>{e.degree}</b>
              <div>{e.institution}</div>
              <div className="ps-sub">{e.period}</div>
            </section>
          ))}

          <h2>Contact</h2>
          <p className="ps-url ps-contact">
            {p.contact.email}
            <br />{bare(p.contact.github)}
            <br />{bare(p.contact.linkedin)}
            <br />aniketdesign.in
          </p>
        </div>
      </div>
    </div>
  );
}
