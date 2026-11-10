"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

/**
 * "Now showing": the 48-second trailer, directly under the hero.
 *
 * A black cinema block (the same in light and dark mode). The screen starts as a window and opens to full width
 * as it scrolls into view. Until someone asks, it plays a silent 9-second loop (1 MB) that only starts loading
 * when the section is near the viewport. "Play with sound" swaps in the full film (never autoplayed with sound,
 * downloaded only on request). The film's URL comes from NEXT_PUBLIC_TRAILER_URL; without it the section does not
 * render, so the site never shows a player that cannot play.
 */
const FILM = process.env.NEXT_PUBLIC_TRAILER_URL || ""; // 1440p film (hosted on Vercel Blob)
const FILM_SM = process.env.NEXT_PUBLIC_TRAILER_URL_SM || FILM; // 1080p film for phones and slow links
const LOOP = "/trailer/loop.mp4"; // 1080p silent loop
const LOOP_SM = "/trailer/loop-sm.mp4"; // 720p loop for phones
const POSTER = "/trailer/poster.jpg";
// Phones, data-saver and slow connections get the lighter files; everyone else gets the sharp ones.
const wantsLight = () => {
  const c = navigator.connection;
  return window.innerWidth < 768 || !!c?.saveData || /(^|-)(2g|3g)$/.test(c?.effectiveType || "");
};
// Lenis copies wheelMultiplier into its VirtualScroll at construction, so that is the copy that has to change.
const setWheel = (lenis, k) => { if (lenis.virtualScroll?.options) lenis.virtualScroll.options.wheelMultiplier = k; };
const ease = (x) => x * x * (3 - 2 * x); // smoothstep: the screen opens slowly, settles slowly
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

export const TRAILER_EVENT = "trailer:play";

function Cinema() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const loopRef = useRef(null);
  const filmRef = useRef(null);
  const playBtnRef = useRef(null);
  const ctlRef = useRef(null);

  const [reduced, setReduced] = useState(false);
  const [near, setNear] = useState(false); // close enough to the viewport to start fetching the loop
  const [visible, setVisible] = useState(false); // screen is actually on screen
  const [loopReady, setLoopReady] = useState(false);
  const [film, setFilm] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(48);
  const [failed, setFailed] = useState(false);
  const [light, setLight] = useState(false); // resolved on the client; the server never renders a video
  const lenis = useLenis();
  const heavy = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Once the section is ~15% into the viewport: start fetching the loop. Not earlier: the hero is exactly one viewport tall, so the
    // section starts on the viewport edge at page load, and a plain "intersecting" check would download 2.7 MB under the hero. On screen: play it. Off screen: pause it.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const a = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "0px 0px -15% 0px" });
    const b = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    a.observe(section);
    b.observe(stage);
    return () => { a.disconnect(); b.disconnect(); };
  }, []);

  // Scroll-driven entrance and exit. --s runs 0 -> 1 as the block rises into view and 1 -> 0 as it leaves, so
  // going in and coming out are mirror images: a black veil over the page fades up (the hero darkens), the screen
  // grows from a window to the whole viewport, then the same in reverse. --d is the pull quote, shown only while
  // the screen is fully open. Everything is written straight to the element, so scrolling never re-renders React.
  // When the screen fills the viewport <html data-cinema> slides the masthead away; the wheel is also made heavier.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const root = document.documentElement;
    const clamp01 = (x) => Math.min(1, Math.max(0, x));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const s = ease(Math.min(clamp01(1 - r.top / vh), clamp01(r.bottom / vh)));
      el.style.setProperty("--s", reduced ? "1" : s.toFixed(3));
      // reduced motion: no gradual fade, the veil is simply on while the screen is pinned
      const v = reduced ? (r.top <= 0 && r.bottom >= vh ? "1" : "0") : s.toFixed(3);
      el.style.setProperty("--v", v);
      root.style.setProperty("--cin", v); // the masthead sits above the veil, so it reads the same value and darkens with the page
      el.style.setProperty("--d", reduced ? "1" : ease(clamp01((s - 0.7) / 0.3)).toFixed(3));
      const inMovie = reduced ? r.top <= 0 && r.bottom >= vh : s > 0.55; // by now the masthead is already mostly dark
      if (inMovie) root.dataset.cinema = "on"; else delete root.dataset.cinema;
      const wantHeavy = r.top < vh * 0.5 && r.bottom > vh * 0.5;
      if (wantHeavy !== heavy.current && lenis) { heavy.current = wantHeavy; setWheel(lenis, wantHeavy ? 0.6 : 1); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on); window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
      delete root.dataset.cinema;
      root.style.removeProperty("--cin");
      if (lenis) setWheel(lenis, 1);
    };
  }, [reduced, lenis]);

  // While the film plays the masthead leaves entirely.
  useEffect(() => {
    const root = document.documentElement;
    if (film) root.dataset.film = "on"; else delete root.dataset.film;
    return () => { delete root.dataset.film; };
  }, [film]);

  // The silent loop: only while on screen, never for reduced motion.
  useEffect(() => {
    const v = loopRef.current;
    if (!v || film) return;
    if (near && visible && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [near, visible, reduced, film]);

  // Scrolling away from a playing film pauses it (sound should not follow you down the page).
  // Runs only when visibility changes, so a film started from the command palette (before the scroll lands) is not paused at once.
  useEffect(() => {
    if (!visible) filmRef.current?.pause();
  }, [visible]);

  const start = useCallback(() => {
    window.dispatchEvent(new Event("music-pause")); // the site's music player, if it is playing
    setLight(wantsLight());
    setFailed(false);
    setMuted(false);
    setFilm(true);
    const v = filmRef.current; // already open (paused by scrolling away): resume it
    if (v) { v.muted = false; v.play().catch(() => {}); }
    else setT(0);
  }, []);

  const stop = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    setFilm(false);
    setPlaying(false);
    requestAnimationFrame(() => playBtnRef.current?.focus());
  }, []);

  // Command palette: "Watch the trailer".
  useEffect(() => {
    const on = () => {
      window.dispatchEvent(new CustomEvent("nav-scroll", { detail: { target: "trailer" } }));
      start();
    };
    window.addEventListener(TRAILER_EVENT, on);
    return () => window.removeEventListener(TRAILER_EVENT, on);
  }, [start]);

  useEffect(() => {
    const v = filmRef.current;
    if (film && v) { v.play().catch(() => setPlaying(false)); ctlRef.current?.focus(); }
  }, [film]);

  const toggle = () => { const v = filmRef.current; if (!v) return; v.paused ? v.play().catch(() => {}) : v.pause(); };
  const fullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => {});
  };
  useEffect(() => {
    if (!film) return;
    const on = (e) => { if (e.key === "Escape" && !document.fullscreenElement) stop(); };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [film, stop]);

  return (
    <section
      ref={sectionRef}
      id="trailer"
      data-cursor-dark
      aria-labelledby="trailer-title"
      className="relative z-20 h-[130svh] text-[#ebe7dd]"
    >
      {/* The veil: black over the whole viewport, faded by scroll. It darkens the hero on the way in and lets the page
          come back on the way out. It sits behind the stage (-z-10 inside this section's stacking context). */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-black" style={{ opacity: "var(--v, 0)" }} />
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-x-[3vw] top-6 z-10 flex items-center justify-between gap-4 [text-shadow:0_1px_14px_rgba(0,0,0,.8)] md:top-8" style={{ opacity: "var(--s, 0)" }}>
          <p className="folio text-[#ebe7dd]/70"><span className="text-vermilion-bright">Now showing</span> — The trailer</p>
          <h2 id="trailer-title" className="sr-only">The trailer</h2>
          <p className="folio text-[#ebe7dd]/70" aria-hidden="true">0:48 · Sound on</p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={stageRef}
            className="tr-screen relative overflow-hidden bg-black shadow-[0_30px_80px_rgba(0,0,0,.6)]"
          >
            <img src={POSTER} alt="" width="2048" height="1152" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />

            {!film && near && !reduced && (
              <video
                ref={loopRef}
                src={wantsLight() ? LOOP_SM : LOOP}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
                onLoadedData={() => setLoopReady(true)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loopReady ? "opacity-100" : "opacity-0"}`}
              />
            )}

            {!film && (
              <button
                ref={playBtnRef}
                type="button"
                onClick={start}
                aria-label="Play the trailer with sound, 48 seconds"
                className="group absolute inset-0 flex items-end gap-4 bg-[linear-gradient(transparent_55%,rgba(0,0,0,.65))] p-5 text-left md:p-7"
              >
                <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-vermilion pl-1 text-[1.1rem] text-[#ebe7dd] shadow-[0_0_0_.45rem_rgba(184,50,26,.25)] transition-transform duration-300 group-hover:scale-105 md:size-16">▶</span>
                <span className="folio pb-1 text-[#ebe7dd]">Play with sound · 0:48</span>
              </button>
            )}

            {film && (
              <>
                <video
                  ref={filmRef}
                  src={light ? FILM_SM : FILM}
                  poster={POSTER}
                  playsInline
                  muted={muted}
                  preload="auto"
                  aria-label="The trailer"
                  onClick={toggle}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={stop}
                  onError={() => setFailed(true)}
                  onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setD(e.currentTarget.duration || 48)}
                  className="absolute inset-0 h-full w-full bg-black object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-[linear-gradient(transparent,rgba(0,0,0,.8))] py-3 pl-3 pr-[4.6rem] pt-8 md:gap-4 md:pl-5 md:pr-[5.6rem]">
                  <button ref={ctlRef} type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="folio min-h-9 min-w-9 border border-[#ebe7dd]/50 px-2 hover:bg-[#ebe7dd] hover:text-[#15140f]">{playing ? "❚❚" : "▶"}</button>
                  <input
                    type="range" min="0" max={d} step="0.1" value={t}
                    aria-label="Seek" aria-valuetext={`${mmss(t)} of ${mmss(d)}`}
                    onChange={(e) => { if (filmRef.current) filmRef.current.currentTime = Number(e.target.value); }}
                    className="h-1 min-w-0 flex-1 accent-[#b8321a]"
                  />
                  <span className="folio hidden text-[#ebe7dd]/80 sm:inline" aria-hidden="true">{mmss(t)} / {mmss(d)}</span>
                  <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={!muted} aria-label={muted ? "Sound on" : "Sound off"} className="folio min-h-9 border border-[#ebe7dd]/50 px-2 hover:bg-[#ebe7dd] hover:text-[#15140f]">{muted ? "Sound off" : "Sound on"}</button>
                  <button type="button" onClick={fullscreen} aria-label="Full screen" className="folio hidden min-h-9 border border-[#ebe7dd]/50 px-2 hover:bg-[#ebe7dd] hover:text-[#15140f] md:block">Full screen</button>
                  <button type="button" onClick={stop} aria-label="Close the film" className="folio min-h-9 border border-[#ebe7dd]/50 px-2 hover:bg-[#ebe7dd] hover:text-[#15140f]">Close ✕</button>
                </div>
                {failed && <p role="alert" className="absolute inset-0 grid place-items-center bg-black/80 px-6 text-center text-[.95rem]">The film could not be loaded. Try again in a moment.</p>}
              </>
            )}
          </div>
        </div>

        <p className={`display pointer-events-none absolute inset-x-[3vw] bottom-28 z-10 text-center text-[clamp(1.2rem,2.3vw,1.9rem)] font-light tracking-[-0.01em] [text-shadow:0_1px_18px_rgba(0,0,0,.9)] ${film ? "hidden" : ""}`} style={{ opacity: "var(--d, 0)" }}>
          <em className="text-vermilion-bright">I build systems,</em> not just applications.
        </p>
      </div>
      <p className="sr-only">
        A 48-second film with music and no speech. It shows the portfolio opening on the title card, a fly-over of the About and Skills pages,
        the four case studies (SRA, AI Friend, Wizard-w2 and Crime Analysis) numbered one to four, the line "I build systems, not just
        applications", the stats, and an end card that reads "Write to me".
      </p>
    </section>
  );
}

export default function Trailer() {
  return FILM ? <Cinema /> : null;
}
