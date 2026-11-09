"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTransitionContext } from "@/components/providers/TransitionProvider";
import { Reveal, WordsInView } from "@/components/ui/Reveal";

const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const Thumb = ({ blog, className }) =>
  blog.thumbnail ? (
    <Image src={blog.thumbnail} alt="" fill className={className} sizes="(max-width: 768px) 100vw, 58vw" unoptimized />
  ) : (
    <div className="absolute inset-0 grid place-items-center bg-ink/5"><span className="display text-4xl italic text-ink/30">Medium</span></div>
  );

/** Magazine spread: the newest post leads, the next two sit beside it. Data still comes from /api/blogs. */
const Blogs = () => {
  const { navigate } = useTransitionContext();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setBlogs(data.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="bg-ground px-[3vw] pb-20 pt-[8vh]" aria-busy="true" aria-label="Loading articles">
        <div className="mx-auto max-w-[1500px] animate-pulse border-t border-ink pt-6">
          <div className="mb-8 h-14 w-80 bg-ink/10" />
          <div className="grid gap-[4vw] md:grid-cols-[7fr_5fr]"><div className="aspect-[16/10] bg-ink/5" /><div className="space-y-6">{[1, 2].map((i) => <div key={i} className="h-28 bg-ink/5" />)}</div></div>
        </div>
      </section>
    );
  }
  if (error || blogs.length === 0) return null;

  const [lead, ...rest] = blogs;
  return (
    <section id="blogs" aria-labelledby="blogs-title" className="bg-ground px-[3vw] pb-[10vh] pt-[8vh]">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-[6vh] grid gap-x-[3vw] border-t border-ink pt-4 md:grid-cols-[2fr_8fr]">
          <p className="folio text-vermilion">№ 06 — Articles <span className="text-ink/60">({String(blogs.length).padStart(2, "0")})</span></p>
          <h2 id="blogs-title" className="display text-[clamp(2.6rem,6vw,6rem)] font-light leading-none"><WordsInView text="My articles" /></h2>
        </header>

        <div className="grid gap-[4vw] md:grid-cols-[7fr_5fr]">
          <Reveal as="a" href={lead.link} target="_blank" rel="noopener noreferrer" className="group grid content-start gap-4">
            <div className="overflow-hidden border border-ink bg-ink/5 p-2">
              <div className="relative aspect-[16/10] overflow-hidden"><Thumb blog={lead} className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035]" /></div>
            </div>
            <time dateTime={lead.pubDate} className="folio text-[10.5px] text-ink/60">{fmt(lead.pubDate)} — Lead</time>
            <h3 className="display text-[clamp(1.8rem,3.4vw,3.2rem)] font-normal leading-[1.05] tracking-[-0.02em] group-hover:text-vermilion">{lead.title}</h3>
            <p className="display max-w-[52ch] text-[1.1rem] italic leading-[1.5] text-ink/70">{lead.snippet}</p>
            <span className="w-max border-b border-ink text-[.9rem] font-medium">Continue reading →</span>
          </Reveal>

          <div className="grid content-start gap-6">
            {rest.map((b, i) => (
              <Reveal as="a" key={b.link} delay={i * 90} href={b.link} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[7.4rem_1fr] gap-5 border-b border-ink/20 pb-6">
                <div className="relative aspect-square overflow-hidden bg-ink/5"><Thumb blog={b} className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0" /></div>
                <div>
                  <time dateTime={b.pubDate} className="folio text-[10.5px] text-ink/60">{fmt(b.pubDate)}</time>
                  <h4 className="display my-1.5 text-[1.35rem] leading-[1.15] group-hover:text-vermilion">{b.title}</h4>
                  <p className="line-clamp-2 text-[.85rem] leading-[1.5] text-ink/70">{b.snippet}</p>
                </div>
              </Reveal>
            ))}
            <button
              onClick={() => navigate("/blogs", "• Blogs", "down")}
              className="folio group flex w-max items-center gap-3 border border-ink px-5 py-3 transition-colors duration-300 hover:bg-ink hover:text-ground"
            >
              View all articles <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
