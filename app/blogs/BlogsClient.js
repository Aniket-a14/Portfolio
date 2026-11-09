"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";
import { WordsInView } from "@/components/ui/Reveal";

const pad = (n) => String(n).padStart(2, "0");
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const Meta = ({ blog }) => (
  <span className="folio block text-[11px] normal-case tracking-[0.06em] text-ink/70">
    <time dateTime={new Date(blog.pubDate).toISOString()}>{fmt(blog.pubDate)}</time>
    {blog.minutes ? ` · ${blog.minutes} min read` : ""}
  </span>
);

const BlogSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-ground px-6 pt-32 md:px-12 lg:px-20" aria-busy="true" aria-label="Loading articles">
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-4 h-3 w-40 bg-ink/10" />
      <div className="mb-10 h-20 w-96 max-w-full bg-ink/10" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border-t border-ink/20 py-8">
          <div className="h-8 w-3/4 bg-ink/10" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Articles, as a table of contents you can open: each piece shows its title, date
 * and reading time; opening one reads the first paragraphs here, with the cover and
 * topics, before continuing on Medium. Data still comes from /api/blogs.
 */
export default function BlogsClient() {
  const { navigate } = useTransitionContext();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch");
        setBlogs(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <BlogSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ground">
        <p className="folio text-ink/70">Unable to load articles</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ground text-ink selection:bg-vermilion-bright selection:text-ground">
      <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-10 md:px-12">
        <button
          onClick={() => navigate("/", "• Home", "up")}
          className="folio mb-10 flex w-fit items-center gap-2 text-ink/70 hover:text-vermilion focus:outline-none focus-visible:text-vermilion"
        >
          <ArrowUpRight size={14} className="-rotate-90" />
          Back to home
        </button>

        <header className="mb-8 border-t border-ink pt-4">
          <p className="folio text-vermilion">№ 06 — Articles ({pad(blogs.length)})</p>
          <h1 className="display mt-4 text-[clamp(2.8rem,7vw,6.4rem)] font-light leading-[.96]">
            <WordsInView text="My articles" />
          </h1>
          <p className="display mt-4 max-w-[34em] text-[clamp(1.1rem,1.8vw,1.55rem)] font-light italic leading-[1.3] text-ink/70">
            Essays on AI and short stories, published on Medium. Open any piece to read its opening here.
          </p>
        </header>

        <ol className="border-t border-ink">
          {blogs.map((blog, n) => {
            const isOpen = open === n;
            const panelId = `article-panel-${n}`;
            return (
              <li key={blog.link} className="border-b border-ink/20">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : n)}
                  className="group grid w-full grid-cols-[2.4rem_1fr_auto] items-baseline gap-4 py-6 text-left"
                >
                  <em className="folio not-italic text-vermilion">{pad(n + 1)}</em>
                  <span>
                    <b className="display block text-[clamp(1.4rem,2.5vw,2.1rem)] font-normal leading-[1.12] tracking-[-0.02em] group-hover:text-vermilion">
                      {blog.title}
                    </b>
                    <Meta blog={blog} />
                  </span>
                  <i className="display text-[1.4rem] not-italic" aria-hidden="true">{isOpen ? "−" : "+"}</i>
                </button>

                {isOpen && (
                  <div id={panelId} className="grid gap-6 pb-10 md:grid-cols-[4fr_7fr] md:pl-[3.4rem] md:gap-[3vw]">
                    {blog.thumbnail && (
                      <div className="border border-ink bg-ink/5 p-1.5 md:self-start">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image src={blog.thumbnail} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-display text-[1.15rem] leading-[1.65] first-letter:float-left first-letter:pr-[.1em] first-letter:pt-[.06em] first-letter:text-[4.2em] first-letter:font-light first-letter:leading-[.78] first-letter:text-vermilion-bright">
                        {blog.excerpt || blog.snippet}
                      </p>
                      {blog.tags?.length > 0 && (
                        <ul className="folio mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] normal-case tracking-[0.04em] text-ink/70" aria-label="Topics">
                          {blog.tags.map((t) => (
                            <li key={t}><span className="text-vermilion">#</span>{t}</li>
                          ))}
                        </ul>
                      )}
                      <a
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-[.95rem] font-medium text-ground transition-colors hover:border-vermilion hover:bg-vermilion"
                      >
                        Continue reading on Medium <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-14 flex justify-center">
          <a
            href="https://medium.com/@aniketsahaworkspace"
            target="_blank"
            rel="noopener noreferrer"
            className="folio group flex items-center gap-2 border-b border-ink pb-1 hover:border-vermilion hover:text-vermilion"
          >
            Follow on Medium
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </a>
        </div>
      </main>
    </div>
  );
}
