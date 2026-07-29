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
} from "@/lib/projects";
import { getRepoStats } from "@/lib/github";
import { mdxComponents } from "@/components/mdx/components";
import ReadingRail from "@/components/project/ReadingRail";
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
    image: frontmatter.image,
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

  const [{ content: mdx }, stats] = await Promise.all([
    compileMDX({
      source: content,
      components: mdxComponents,
      options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
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
    <div className="min-h-screen bg-black text-white">
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

      {/* ---------------- Document header strip ---------------- */}
      <div className="border-b border-white/[0.08] pt-[4.75rem]">
        <div
          className={`${SHELL} flex items-center justify-between py-3.5 font-roboto text-[9.5px] uppercase tracking-[0.3em] text-white/25`}
        >
          <span>
            Case Study
            <span className="mx-2 text-white/10">/</span>
            <span className="text-sand/70 tabular-nums">
              {String(position).padStart(2, "0")}
            </span>
            <span className="text-white/15">
              —{String(all.length).padStart(2, "0")}
            </span>
          </span>
          <span className="hidden sm:block">Aniket Saha</span>
        </div>
      </div>

      {/* ---------------- Masthead ---------------- */}
      <header className={`${SHELL} pb-14 pt-12 sm:pt-16`}>
        <BackToWork />

        <div className="mt-10 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <h1 className="font-playfair text-[46px] leading-[0.95] tracking-[-0.015em] text-paper/95 sm:text-[70px] lg:text-[86px]">
              {frontmatter.title}
            </h1>
            {frontmatter.fullTitle &&
              frontmatter.fullTitle !== frontmatter.title && (
                <p className="mt-5 font-roboto text-[11px] uppercase tracking-[0.24em] text-sand/60">
                  {frontmatter.fullTitle}
                </p>
              )}
          </div>

          {frontmatter.tagline && (
            <p className="font-roboto text-[15.5px] font-light leading-[1.65] text-paper/55 lg:pb-3">
              {frontmatter.tagline}
            </p>
          )}
        </div>

        <div className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-4">
          {frontmatter.repo && (
            <ExternalLink
              href={frontmatter.repo}
              label="Source code"
              icon={<Github size={13} strokeWidth={1.5} />}
            />
          )}
          {liveUrl && (
            <ExternalLink
              href={liveUrl}
              label="Live site"
              icon={<Globe size={13} strokeWidth={1.5} />}
            />
          )}
        </div>
      </header>

      {/* ---------------- Cover plate ---------------- */}
      <figure className={SHELL}>
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/[0.08] bg-white/[0.02] sm:aspect-[21/9]">
          <Image
            src={frontmatter.image}
            alt={`${frontmatter.title} interface`}
            fill
            priority
            sizes="(max-width: 1240px) 100vw, 1240px"
            className="object-cover"
          />
        </div>
      </figure>

      {/* ---------------- Specification sheet ---------------- */}
      <section aria-label="Project details" className={`${SHELL} mt-14`}>
        <dl className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="border-b border-white/[0.07] py-5 pr-5 sm:border-r sm:last:border-r-0 sm:pl-5 sm:first:pl-0"
            >
              <dt className="font-roboto text-[9px] uppercase tracking-[0.28em] text-white/25">
                {spec.label}
              </dt>
              <dd className="mt-2.5 font-roboto text-[14px] font-light leading-snug text-paper/75">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        {stats?.languages && Object.keys(stats.languages).length > 0 && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="mb-4 font-roboto text-[9px] uppercase tracking-[0.3em] text-white/25">
                Composition
              </p>
              <LanguageBar languages={stats.languages} />
            </div>

            {stats.topics?.length > 0 && (
              <div>
                <p className="mb-4 font-roboto text-[9px] uppercase tracking-[0.3em] text-white/25">
                  Topics
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {stats.topics.map((topic) => (
                    <li
                      key={topic}
                      className="font-roboto text-[11.5px] tracking-[0.04em] text-paper/40"
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

      {/* ---------------- Body ---------------- */}
      <div className={`${SHELL} pb-24 pt-24`}>
        <div className="flex gap-14 xl:gap-20">
          <ReadingRail headings={headings} articleId="case-study" />

          <div className="min-w-0 flex-1 xl:max-w-[720px]">
            <article id="case-study" className="case-study max-w-none">
              {mdx}
            </article>

            {frontmatter.stack?.length > 0 && (
              <section className="mt-24 border-t border-white/10 pt-10">
                <h2 className="mb-7 font-roboto text-[9.5px] font-medium uppercase tracking-[0.3em] text-sand/70">
                  Colophon
                </h2>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
                  {frontmatter.stack.map((item) => (
                    <li
                      key={item}
                      className="font-roboto text-[13.5px] font-light text-paper/50"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <NextProject previous={previous} next={next} />
          </div>
        </div>
      </div>
    </div>
  );
}
