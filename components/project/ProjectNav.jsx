"use client";

import React from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

export function BackToWork() {
  const { navigate } = useTransitionContext();

  return (
    <button
      onClick={() => navigate("/", "• Home", "up")}
      className="group flex items-center gap-2.5 font-roboto text-[10px] uppercase tracking-[0.24em] text-white/30 transition-colors hover:text-sand/80"
    >
      <ArrowLeft
        size={14}
        strokeWidth={1.5}
        className="transition-transform duration-300 group-hover:-translate-x-1"
      />
      Back to work
    </button>
  );
}

export function NextProject({ previous, next }) {
  const { navigate } = useTransitionContext();

  if (!previous && !next) return null;

  const go = (project) =>
    navigate(`/project/${project.slug}`, `• ${project.title}`, "down", "project");

  // The forward link is deliberately the loud one: it is the only element on
  // the page competing with the article, and it should win.
  return (
    <nav aria-label="More projects" className="mt-28">
      {next && (
        <button
          onClick={() => go(next)}
          className="group relative block w-full overflow-hidden border-y border-white/10 py-12 text-left transition-colors duration-500 hover:border-white/20"
        >
          <span className="mb-4 flex items-center gap-2.5 font-roboto text-[9px] uppercase tracking-[0.3em] text-sand/70">
            Next case study
            <ArrowRight
              size={11}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:translate-x-1.5"
            />
          </span>

          <span className="block font-playfair text-[42px] leading-[0.95] text-paper/45 transition-colors duration-500 group-hover:text-paper/95 sm:text-[58px]">
            {next.title}
          </span>

          {next.tagline && (
            <span className="mt-5 block max-w-[540px] font-roboto text-[13.5px] font-light leading-relaxed text-white/25 transition-colors duration-500 group-hover:text-white/45">
              {next.tagline}
            </span>
          )}
        </button>
      )}

      {previous && (
        <button
          onClick={() => go(previous)}
          className="group mt-8 flex items-center gap-2.5 font-roboto text-[11px] tracking-[0.06em] text-white/25 transition-colors duration-300 hover:text-white/60"
        >
          <ArrowLeft
            size={12}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Previous — {previous.title}
        </button>
      )}
    </nav>
  );
}

// `icon` is a rendered element rather than a component reference: component
// functions cannot cross the server/client boundary, elements can.
export function ExternalLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 border-b border-white/15 pb-1.5 font-roboto text-[12.5px] tracking-[0.04em] text-paper/60 transition-colors duration-300 hover:border-sand/60 hover:text-sand"
    >
      {icon}
      {label}
      <ArrowUpRight
        size={12}
        strokeWidth={1.5}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
