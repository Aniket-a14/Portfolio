"use client";

import { useEffect } from "react";

/**
 * Sweeps the highlighter marks in a case study (`.hl` inside the article) as they scroll into view. Marks that are
 * already above the viewport (a visitor who jumped to a later chapter) show at once, and reduced motion or a browser
 * without IntersectionObserver shows everything immediately, so the text is never left unmarked.
 */
export default function HighlightReveal({ articleId = "case-study" }) {
  useEffect(() => {
    const marks = [...document.querySelectorAll(`#${articleId} .hl`)];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      marks.forEach((m) => m.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6, rootMargin: "0px 0px -8% 0px" }
    );
    marks.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, [articleId]);

  return null;
}
