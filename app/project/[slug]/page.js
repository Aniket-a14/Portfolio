import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Github, Globe } from "lucide-react";

import Navbar from "@/components/Navbar";
import { SEO_CONFIG, getMetadata } from "@/lib/seo";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectSlugs,
  getAdjacentProjects,
  getChapters,
} from "@/lib/projects";
import { getRepoStats } from "@/lib/github";
import { makeMdxComponents } from "@/components/mdx/components";
import remarkKeySentence from "@/lib/remark-key-sentence";
import ReadingRail from "@/components/project/ReadingRail";
import HighlightReveal from "@/components/project/HighlightReveal";
import LanguageBar from "@/components/project/LanguageBar";
import {
  BackToWork,
  NextProject,
  ExternalLink,
} from "@/components/project/ProjectNav";

// Every case study is prerendered at build time; the GitHub numbers inside them
// refresh on a one-hour ISR window without rebuilding the page.
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return getMetadata({ title: "Project Not Found" });

  const { frontmatter } = project;
  return getMetadata({
    title: frontmatter.fullTitle || frontmatter.title,
    description: frontmatter.description || frontmatter.tagline,
    path: `/project/${slug}`,
  });
}

const SHELL = "mx-auto w-full max-w-[1240px] px-6 sm:px-10";

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { frontmatter, content, headings } = project;
  const { previous, next } = getAdjacentProjects(slug);
  const all = getAllProjects();
  const position = all.findIndex((p) => p.slug === slug) + 1;

  const chapters = getChapters(content, frontmatter.takeaways);
  const summary = frontmatter.summary;

  const [{ content: mdx }, stats] = await Promise.all([
    compileMDX({
      source: content,
      components: makeMdxComponents(chapters),
      options: { mdxOptions: { remarkPlugins: [remarkGfm, remarkKeySentence] } },
    }),
    getRepoStats(frontmatter.repo),
  ]);

  const liveUrl = frontmatter.live || stats?.homepage || null;

  // The masthead reads as a specification sheet: fixed label/value pairs rather
  // than a dot-separated sentence, so it can be scanned rather than read.
  const specs = [
    { label: "Year", value: frontmatter.timeline || frontmatter.year },
    { label: "Role", value: frontmatter.role },
    { label: "Status", value: frontmatter.status },
    { label: "Licence", value: frontmatter.license || "—" },
    { label: "Stars", value: stats?.stars },
    { label: "Forks", value: stats?.forks },
    { label: "Reading", value: `${frontmatter.readingTime} min` },
    {
      label: "Last commit",
      value: stats?.pushedAt
        ? new Date(stats.pushedAt).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          })
        : null,
    },
  ].filter((spec) => spec.value !== undefined && spec.value !== null);

  return (
    <div className="min-h-screen bg-ground text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SEO_CONFIG.baseUrl },
              {
                "@type": "ListItem",
                position: 2,
                name: "Projects",
                item: `${SEO_CONFIG.baseUrl}/#projects`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: frontmatter.title,
                item: `${SEO_CONFIG.baseUrl}/project/${slug}`,
              },
            ],
          }),
        }}
      />

      <div className="fixed left-0 top-0 z-50 w-full">
        <Navbar />
      </div>

      {/* ---------------- Article opener ---------------- */}
      <header className={`${SHELL} pb-10 pt-32 sm:pt-40`}>
        <BackToWork />

        <div className="mt-10 border-t border-ink pt-4">
          <p className="folio text-vermilion">
            № {String(position).padStart(2, "0")} — Case study
            <span className="text-ink/70"> · {frontmatter.timeline || frontmatter.year} · {String(position).padStart(2, "0")}/{String(all.length).padStart(2, "0")}</span>
          </p>

          <h1 className="display mt-8 max-w-[14em] text-[clamp(2.8rem,7.4vw,7.4rem)] font-light leading-[0.96] tracking-[-0.045em]">
            {frontmatter.fullTitle || frontmatter.title}
          </h1>

          {frontmatter.tagline && (
            <p className="display mt-8 max-w-[30em] text-[clamp(1.3rem,2.4vw,2.2rem)] font-light italic leading-[1.25] text-ink/70">
              {frontmatter.tagline}
            </p>
          )}

          <p className="folio mt-8 border-t border-ink/20 pt-4 text-[11px] text-ink/70">
            By Aniket Saha{frontmatter.role ? ` · ${frontmatter.role}` : ""}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-9 gap-y-4">
          {frontmatter.repo && (
            <ExternalLink href={frontmatter.repo} label="Source code" icon={<Github size={13} strokeWidth={1.5} />} />
          )}
          {liveUrl && (
            <ExternalLink href={liveUrl} label="Live site" icon={<Globe size={13} strokeWidth={1.5} />} />
          )}
        </div>
      </header>

      {/* ---------------- Cover plate ---------------- */}
      <figure className={SHELL}>
        <div className="relative w-full overflow-hidden border border-ink bg-ink/[0.04] p-2.5">
          <Image
            src={frontmatter.image}
            alt={`${frontmatter.title} interface`}
            width={3360}
            height={2280}
            priority
            sizes="(max-width: 1240px) 100vw, 1240px"
            className="h-auto w-full object-contain"
          />
        </div>
        <figcaption className="folio mt-3 text-[10.5px] text-ink/70">
          Fig. 1 — {frontmatter.title}{frontmatter.status ? `, ${frontmatter.status}` : ""}
        </figcaption>
      </figure>

      {/* ---------------- Specification sheet ---------------- */}
      <section aria-label="Project details" className={`${SHELL} mt-14`}>
        <dl className="grid grid-cols-2 border-t border-ink/10 sm:grid-cols-4">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="border-b border-ink/[0.07] py-5 pr-5 sm:border-r sm:last:border-r-0 sm:pl-5 sm:first:pl-0"
            >
              <dt className="font-body text-[9px] uppercase tracking-[0.28em] text-ink/70">
                {spec.label}
              </dt>
              <dd className="mt-2.5 font-body text-[14px] font-light leading-snug text-ink/75">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        {stats?.languages && Object.keys(stats.languages).length > 0 && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="mb-4 font-body text-[9px] uppercase tracking-[0.3em] text-ink/70">
                Composition
              </p>
              <LanguageBar languages={stats.languages} />
            </div>

            {stats.topics?.length > 0 && (
              <div>
                <p className="mb-4 font-body text-[9px] uppercase tracking-[0.3em] text-ink/70">
                  Topics
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {stats.topics.map((topic) => (
                    <li
                      key={topic}
                      className="font-body text-[11.5px] tracking-[0.04em] text-ink/70"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ---------------- Body: annotated essay ---------------- */}
      <div className={`${SHELL} pb-24 pt-24`}>
        <div className="flex flex-col gap-12 xl:grid xl:grid-cols-[190px_minmax(0,1fr)_240px] xl:gap-x-7">
          <ReadingRail headings={headings} chapters={chapters} articleId="case-study" showContents={false} />
          <HighlightReveal articleId="case-study" />

          {/* Left column is reserved for each chapter's margin note (positioned by the heading). */}
          <div className="hidden xl:block" aria-hidden="true" />

          <div className="min-w-0 xl:max-w-[680px]">
            <article id="case-study" className="case-study max-w-none">
              {mdx}
            </article>

            {frontmatter.stack?.length > 0 && (
              <section className="mt-24 border-t border-ink/10 pt-10">
                <h2 className="mb-7 font-body text-[9.5px] font-medium uppercase tracking-[0.3em] text-vermilion">
                  Colophon
                </h2>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
                  {frontmatter.stack.map((item) => (
                    <li
                      key={item}
                      className="font-body text-[13.5px] font-light text-ink/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <NextProject previous={previous} next={next} />
          </div>

          {/* In short: reads first on small screens, sticks beside the essay on wide ones. */}
          <aside
            aria-label="In short"
            className="order-first self-start border border-ink bg-ink/[0.03] p-5 xl:sticky xl:top-28 xl:order-none"
          >
            <h2 className="folio mb-4 text-[10px] text-vermilion">In short</h2>
            {summary && (
              <dl className="font-display text-[15.5px] leading-[1.45] text-ink/85">
                {[["Problem", summary.problem], ["Built", summary.built], ["Result", summary.result]].map(
                  ([label, text]) =>
                    text && (
                      <div key={label} className="border-t border-ink/15 py-3 first:border-t-0 first:pt-0">
                        <dt className="folio mb-1 text-[9.5px] text-ink/70">{label}</dt>
                        <dd>{text}</dd>
                      </div>
                    )
                )}
              </dl>
            )}
            {chapters.length > 0 && (
              <nav aria-label="Chapters" className="mt-3 border-t border-ink/15 pt-3">
                <ol className="grid gap-1.5">
                  {chapters.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        className="folio flex min-h-6 items-center gap-2 py-0.5 text-[10.5px] normal-case leading-snug tracking-[0.03em] text-ink/70 hover:text-vermilion"
                      >
                        <span className="text-vermilion">{String(c.number).padStart(2, "0")}</span>
                        {c.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
