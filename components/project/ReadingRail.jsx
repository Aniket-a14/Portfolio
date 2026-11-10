"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reading progress bar + sticky contents rail.
 *
 * Both read the same scroll position, so they share a single rAF-throttled
 * listener rather than one each. The active heading is resolved from cached
 * element offsets, refreshed on resize, so the scroll handler never triggers
 * layout.
 */
const NO_CHAPTERS = []; // stable default: a fresh [] each render would re-run the measuring effect forever

const ReadingRail = ({ headings = [], chapters = NO_CHAPTERS, articleId, showContents = true }) => {
  const [progress, setProgress] = useState(0);
  const [ticks, setTicks] = useState([]); // chapter positions along the margin ruler, 0..1
  const [chapterId, setChapterId] = useState(null);
  const [inView, setInView] = useState(false);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);
  const [marker, setMarker] = useState({ top: 0, height: 0 });

  const offsetsRef = useRef([]);
  const chapterTopsRef = useRef([]);
  const frameRef = useRef(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (!headings.length) return;

    const measure = () => {
      offsetsRef.current = headings
        .map(({ id }) => {
          const el = document.getElementById(id);
          return el
            ? { id, top: el.getBoundingClientRect().top + window.scrollY }
            : null;
        })
        .filter(Boolean);

      const article = articleId ? document.getElementById(articleId) : null;
      const tops = chapters
        .map((c) => {
          const el = document.getElementById(c.id);
          return el ? { ...c, top: el.getBoundingClientRect().top + window.scrollY } : null;
        })
        .filter(Boolean);
      chapterTopsRef.current = tops;
      if (article && tops.length) {
        const start = article.getBoundingClientRect().top + window.scrollY;
        const span = Math.max(1, article.offsetHeight - window.innerHeight);
        setTicks(tops.map((c) => ({ id: c.id, number: c.number, title: c.title, pos: Math.min(1, Math.max(0, (c.top - 96 - start) / span)) })));
      }
    };

    const update = () => {
      frameRef.current = 0;

      const article = articleId ? document.getElementById(articleId) : null;
      if (article) {
        const start = article.getBoundingClientRect().top + window.scrollY;
        const span = article.offsetHeight - window.innerHeight;
        const ratio = span > 0 ? (window.scrollY - start) / span : 0;
        setProgress(Math.min(1, Math.max(0, ratio)));
        setInView(window.scrollY > start - window.innerHeight * 0.6);
      }

      let ch = null;
      for (const c of chapterTopsRef.current) {
        if (c.top <= window.scrollY + window.innerHeight * 0.3) ch = c.id;
        else break;
      }
      setChapterId(ch);

      const limit = window.scrollY + window.innerHeight * 0.3;
      const offsets = offsetsRef.current;
      let current = offsets[0]?.id ?? null;
      for (const entry of offsets) {
        if (entry.top <= limit) current = entry.id;
        else break;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [headings, chapters, articleId]);

  // The indicator slides along the rail rather than the active row simply
  // changing colour. Measured only when the active entry changes.
  const positionMarker = useCallback(() => {
    const list = listRef.current;
    if (!list || !activeId) return;

    const item = list.querySelector(`[data-toc="${CSS.escape(activeId)}"]`);
    if (!item) return;

    setMarker({ top: item.offsetTop, height: item.offsetHeight });
  }, [activeId]);

  useEffect(() => {
    positionMarker();
    window.addEventListener("resize", positionMarker);
    return () => window.removeEventListener("resize", positionMarker);
  }, [positionMarker]);

  if (!headings.length) return null;

  const jumpTo = (event, id) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 96,
      behavior: "smooth",
    });
  };

  let sectionNumber = 0;

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-[60] h-[2px] w-full bg-transparent ${ticks.length ? "xl:hidden" : ""}`}
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-vermilion/70 transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {ticks.length > 0 && (
        // Margin ruler (xl and up): a printer's ruler in the left margin. The fill is how far you have read, each
        // tick is a chapter, and the dot is you. Pointer-only; the "In short" chapter list is the keyboard route.
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed bottom-[18vh] left-3 top-[18vh] z-40 hidden w-px bg-ink/15 transition-opacity duration-500 xl:block ${inView ? "opacity-100" : "opacity-0"}`}
        >
          <span className="absolute -left-px top-0 w-[3px] bg-vermilion" style={{ height: `${progress * 100}%` }} />
          <span className="absolute -left-[5px] size-[11px] -translate-y-1/2 rounded-full bg-vermilion" style={{ top: `${progress * 100}%` }} />
          {ticks.map((t) => {
            const active = t.id === chapterId;
            return (
              <a
                key={t.id}
                href={`#${t.id}`}
                tabIndex={-1}
                onClick={(event) => jumpTo(event, t.id)}
                className="group pointer-events-auto absolute left-0 flex -translate-y-1/2 items-center"
                style={{ top: `${t.pos * 100}%` }}
              >
                <span className={`h-px w-3 ${active ? "bg-vermilion" : "bg-ink"}`} />
                <span className={`folio ml-2 bg-ground py-px pr-1 text-[11px] tabular-nums ${active ? "text-vermilion" : "text-ink/70"}`}>
                  {String(t.number).padStart(2, "0")}
                  <span className={`ml-2 normal-case tracking-[0.02em] group-hover:inline min-[1700px]:inline ${active ? "min-[1700px]:text-vermilion" : ""} hidden`}>{t.title}</span>
                </span>
              </a>
            );
          })}
        </div>
      )}

      {showContents && (
      <nav
        aria-label="Contents"
        className="sticky top-32 hidden max-h-[calc(100vh-14rem)] w-[196px] shrink-0 overflow-y-auto xl:block"
      >
        <p className="mb-6 font-body text-[11px] font-medium uppercase tracking-[0.32em] text-ink/70">
          Contents
        </p>

        <div className="relative" ref={listRef}>
          <span
            className="absolute left-0 w-px bg-ink/[0.08]"
            style={{ top: 0, bottom: 0 }}
            aria-hidden="true"
          />
          <span
            className="absolute left-0 w-px bg-vermilion transition-[top,height] duration-500 ease-out"
            style={{ top: marker.top, height: marker.height }}
            aria-hidden="true"
          />

          <ul>
            {headings.map((heading) => {
              const isActive = heading.id === activeId;
              const isSection = heading.depth === 2;
              if (isSection) sectionNumber += 1;

              return (
                <li key={heading.id} data-toc={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(event) => jumpTo(event, heading.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex gap-2.5 py-[7px] transition-colors duration-300 ${
                      isSection ? "pl-4" : "pl-8"
                    } ${
                      isActive
                        ? "text-ink/85"
                        : "text-ink/70 hover:text-ink/70"
                    }`}
                  >
                    {isSection && (
                      <span
                        className={`shrink-0 pt-[3px] font-body text-[11px] tabular-nums tracking-[0.12em] transition-colors duration-300 ${
                          isActive ? "text-vermilion" : "text-ink/70"
                        }`}
                      >
                        {String(sectionNumber).padStart(2, "0")}
                      </span>
                    )}
                    <span className="font-body text-[12px] leading-[1.45]">
                      {heading.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      )}
    </>
  );
};

export default ReadingRail;
