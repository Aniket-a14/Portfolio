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
const ReadingRail = ({ headings = [], articleId }) => {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);
  const [marker, setMarker] = useState({ top: 0, height: 0 });

  const offsetsRef = useRef([]);
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
    };

    const update = () => {
      frameRef.current = 0;

      const article = articleId ? document.getElementById(articleId) : null;
      if (article) {
        const start = article.offsetTop;
        const span = article.offsetHeight - window.innerHeight;
        const ratio = span > 0 ? (window.scrollY - start) / span : 0;
        setProgress(Math.min(1, Math.max(0, ratio)));
      }

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
  }, [headings, articleId]);

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
        className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-sand/70 transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <nav
        aria-label="Contents"
        className="sticky top-32 hidden max-h-[calc(100vh-14rem)] w-[196px] shrink-0 overflow-y-auto xl:block"
      >
        <p className="mb-6 font-roboto text-[9px] font-medium uppercase tracking-[0.32em] text-white/25">
          Contents
        </p>

        <div className="relative" ref={listRef}>
          <span
            className="absolute left-0 w-px bg-white/[0.08]"
            style={{ top: 0, bottom: 0 }}
            aria-hidden="true"
          />
          <span
            className="absolute left-0 w-px bg-sand transition-all duration-500 ease-out"
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
                        ? "text-paper/85"
                        : "text-white/[0.28] hover:text-white/55"
                    }`}
                  >
                    {isSection && (
                      <span
                        className={`shrink-0 pt-[3px] font-roboto text-[9px] tabular-nums tracking-[0.12em] transition-colors duration-300 ${
                          isActive ? "text-sand" : "text-white/20"
                        }`}
                      >
                        {String(sectionNumber).padStart(2, "0")}
                      </span>
                    )}
                    <span className="font-roboto text-[12px] leading-[1.45]">
                      {heading.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default ReadingRail;
