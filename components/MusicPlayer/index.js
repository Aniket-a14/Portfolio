"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { musicTracks } from "@/lib/data";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const LANGS = ["All", "English", "Hindi"];

// true: music keeps playing after the card is closed (the video is then hidden).
// YouTube's embed rules (Required Minimum Functionality, "background player") do not allow
// that. Set to false to pause on close, so the video is always visible while it plays.
const BACKGROUND_PLAY = true;
const ERRORS = {
  100: "This track is unavailable.",
  101: "This track can't be played here.",
  150: "This track can't be played here.",
  153: "This track can't be played here.",
};
const mmss = (s) => {
  const n = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
};

// The YouTube IFrame API is only fetched the first time the card is opened, so visitors
// who never touch the player never load YouTube's scripts.
let apiPromise = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === "function") prev();
        resolve(window.YT);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      s.onerror = () => {
        apiPromise = null;
        reject(new Error("YouTube API failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

const Glyph = ({ name }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
    {name === "pause" && <path d="M3.5 2h3.2v12H3.5zM9.3 2h3.2v12H9.3z" />}
    {name === "play" && <path d="M4 2.2v11.6L13.2 8z" />}
    {name === "next" && <path d="M2.5 2.5v11l8-5.5zM11.5 2.5h2.2v11h-2.2z" />}
    {name === "prev" && <path d="M13.5 2.5v11l-8-5.5zM2.3 2.5h2.2v11H2.3z" />}
  </svg>
);

/**
 * Floating record in the bottom-left corner of every page. Opening it shows the
 * YouTube player (visible, per YouTube's embed rules) with our own controls, an
 * English / Hindi filter and the track list. Nothing loads or plays until the visitor
 * opens it and presses play; closing the card pauses the music.
 */
export default function MusicPlayer() {
  const { isInitialLoadComplete } = useTransitionContext();
  const [open, setOpen] = useState(false);
  const [ask, setAsk] = useState(false);
  const [engaged, setEngaged] = useState(false); // the player is created once the card is opened or music accepted
  const [lang, setLang] = useState("All");
  const [currentId, setCurrentId] = useState(musicTracks[0].id);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(80);
  const [message, setMessage] = useState("");

  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const discRef = useRef(null);
  const live = useRef({ queue: [], currentId: musicTracks[0].id, playing: false, fails: 0 });
  const wantPlay = useRef(false); // "Play music" was clicked before the player finished loading

  const queue = useMemo(() => musicTracks.filter((t) => lang === "All" || t.lang === lang), [lang]);
  const track = musicTracks.find((t) => t.id === currentId) || musicTracks[0];
  live.current.queue = queue;
  live.current.currentId = currentId;
  live.current.playing = playing;

  const load = useCallback((id, autoplay) => {
    const p = playerRef.current;
    setCurrentId(id);
    live.current.currentId = id;
    setMessage("");
    setTime(0);
    setDur(0);
    if (!p) return;
    if (autoplay) p.loadVideoById(id);
    else p.cueVideoById(id);
  }, []);

  const step = useCallback((dir, autoplay) => {
    const { queue: q, currentId: cur } = live.current;
    if (!q.length) return;
    const i = q.findIndex((t) => t.id === cur);
    load(q[(i + dir + q.length) % q.length].id, autoplay);
  }, [load]);

  // Create the player the first time the card opens.
  useEffect(() => {
    if (!(open || engaged) || playerRef.current || !hostRef.current) return;
    let cancelled = false;
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || playerRef.current || !hostRef.current) return;
        playerRef.current = new YT.Player(hostRef.current, {
          width: "100%",
          height: 200,
          videoId: live.current.currentId,
          host: "https://www.youtube-nocookie.com",
          playerVars: { controls: 0, playsinline: 1, rel: 0, disablekb: 1, fs: 0, iv_load_policy: 3, origin: window.location.origin },
          events: {
            onReady: (e) => {
              e.target.setVolume(80);
              setReady(true);
              if (wantPlay.current) { wantPlay.current = false; e.target.playVideo(); }
            },
            onStateChange: (e) => {
              const s = e.data;
              if (s === 1) { live.current.fails = 0; setPlaying(true); setDur(e.target.getDuration()); }
              else if (s === 2 || s === 5) setPlaying(false);
              else if (s === 0) step(1, true);
            },
            onAutoplayBlocked: () => { setPlaying(false); setMessage("Your browser blocked playback. Press play."); },
            onError: (e) => {
              setPlaying(false);
              setMessage(ERRORS[e.data] || "Playback error.");
              live.current.fails += 1;
              // Skip an unplayable track, but stop if every track in the list has failed in a row.
              if (live.current.fails < live.current.queue.length) setTimeout(() => step(1, true), 1200);
            },
          },
        });
      })
      .catch(() => setMessage("The player couldn't load. Check your connection."));
    return () => { cancelled = true; };
  }, [open, engaged, step]);

  // Offer the music once, a moment after the intro, unless the visitor already said no.
  useEffect(() => {
    if (!isInitialLoadComplete) return;
    let said = null;
    try { said = window.localStorage.getItem("music-prompt"); } catch { /* storage blocked: just ask */ }
    if (said === "no") return;
    const id = setTimeout(() => setAsk(true), 2500);
    return () => clearTimeout(id);
  }, [isInitialLoadComplete]);

  const decline = useCallback(() => {
    setAsk(false);
    try { window.localStorage.setItem("music-prompt", "no"); } catch { /* ignore */ }
  }, []);

  // Starting playback needs a click: this is it. The music plays in the background; the card stays closed.
  const accept = () => {
    setAsk(false);
    setEngaged(true);
    if (playerRef.current && ready) playerRef.current.playVideo();
    else wantPlay.current = true;
  };

  // Progress while playing.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (p?.getCurrentTime) { setTime(p.getCurrentTime()); setDur(p.getDuration() || 0); }
    }, 500);
    return () => clearInterval(id);
  }, [playing]);

  const close = useCallback(() => {
    if (!BACKGROUND_PLAY) {
      playerRef.current?.pauseVideo?.();
      setPlaying(false);
    }
    setOpen(false);
    discRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!ask) return;
    const onKey = (e) => e.key === "Escape" && decline();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ask, decline]);

  const toggle = () => {
    const p = playerRef.current;
    if (!p || !ready) return;
    if (playing) p.pauseVideo();
    else { setMessage(""); p.playVideo(); }
  };

  const chooseLang = (l) => {
    setLang(l);
    const q = musicTracks.filter((t) => l === "All" || t.lang === l);
    live.current.queue = q;
    if (!q.some((t) => t.id === currentId)) load(q[0].id, playing);
  };

  const onSeek = (v) => {
    setTime(v);
    playerRef.current?.seekTo?.(v, true);
  };
  const onVolume = (v) => {
    setVol(v);
    playerRef.current?.setVolume?.(v);
  };

  const count = (l) => musicTracks.filter((t) => l === "All" || t.lang === l).length;

  return (
    <>
      {ask && !open && !playing && (
        <div
          role="dialog"
          aria-labelledby="music-ask-title"
          className="fixed bottom-[5.2rem] left-4 z-40 w-[min(19rem,calc(100vw-2rem))] border border-ink bg-ground p-4 shadow-[6px_6px_0_0_rgb(var(--hard-shadow))] md:bottom-[5.6rem] md:left-6"
        >
          <p className="folio text-[10.5px] text-vermilion">Soundtrack</p>
          <p id="music-ask-title" className="display mt-1 text-[1.35rem] font-light leading-[1.15]">Want some music while you look around?</p>
          <p className="mt-1.5 text-[.88rem] leading-snug text-ink/70">A short playlist in English and Hindi. Pause it any time.</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              type="button"
              onClick={accept}
              className="border border-ink bg-ink px-4 py-2.5 text-[.88rem] font-medium text-ground transition-colors hover:border-vermilion hover:bg-vermilion"
            >
              Play music
            </button>
            <button type="button" onClick={decline} className="border-b border-ink py-2 text-[.88rem] font-medium hover:border-vermilion hover:text-vermilion">
              No thanks
            </button>
          </div>
        </div>
      )}
      <div
        id="music-player"
        role="region"
        aria-label="Music player"
        aria-hidden={!open}
        data-lenis-prevent
        className={`${open ? "" : "invisible pointer-events-none"} fixed bottom-[5.2rem] left-4 z-40 w-[min(20rem,calc(100vw-2rem))] border border-ink bg-ground p-3 shadow-[6px_6px_0_0_rgb(var(--hard-shadow))] md:left-6 md:bottom-[5.6rem]`}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="folio text-[10.5px] text-vermilion">{playing ? "Now playing" : "Music"}</p>
          <button type="button" onClick={close} className="folio -mr-1 px-2 py-2 text-[10.5px] hover:text-vermilion focus-visible:text-vermilion">Close ×</button>
        </div>

        {/* YouTube's embed rules require the player to be visible (at least 200 x 200) while it plays. */}
        <div className="relative h-[200px] w-full overflow-hidden bg-ink">
          <div ref={hostRef} />
        </div>

        <div aria-live="polite" className="mt-3 min-h-[2.6rem]">
          <p className="display text-[1.15rem] font-normal leading-tight">{track.title}</p>
          <p className="text-[.85rem] text-ink/70">{track.artist}</p>
        </div>

        <input
          type="range"
          min="0"
          max={Math.max(1, Math.round(dur))}
          step="1"
          value={Math.min(Math.round(time), Math.max(1, Math.round(dur)))}
          onChange={(e) => onSeek(+e.target.value)}
          disabled={!ready || !dur}
          aria-label="Seek"
          aria-valuetext={`${mmss(time)} of ${mmss(dur)}`}
          className="mp-range mt-1 w-full"
        />
        <div className="folio flex justify-between text-[10.5px] normal-case tracking-[0.04em] text-ink/70">
          <span>{mmss(time)}</span>
          <span>{mmss(dur)}</span>
        </div>

        <div className="mt-1 flex items-center gap-1">
          <button type="button" onClick={() => step(-1, playing)} aria-label="Previous track" disabled={!ready} className="grid h-11 w-11 place-items-center hover:text-vermilion disabled:opacity-40"><Glyph name="prev" /></button>
          <button
            type="button"
            onClick={toggle}
            disabled={!ready}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink bg-ink text-ground transition-colors hover:border-vermilion hover:bg-vermilion disabled:opacity-40"
          >
            <Glyph name={playing ? "pause" : "play"} />
          </button>
          <button type="button" onClick={() => step(1, playing)} aria-label="Next track" disabled={!ready} className="grid h-11 w-11 place-items-center hover:text-vermilion disabled:opacity-40"><Glyph name="next" /></button>
          <input
            type="range"
            min="0"
            max="100"
            value={vol}
            onChange={(e) => onVolume(+e.target.value)}
            aria-label="Volume"
            className="mp-range ml-auto w-24"
          />
        </div>

        <p role="status" className="folio min-h-[1.2rem] text-[10.5px] normal-case tracking-[0.04em] text-vermilion">
          {message || (!ready && open ? "Loading player…" : "")}
        </p>

        <div role="group" aria-label="Filter by language" className="mt-1 flex gap-1.5 border-t border-ink/20 pt-3">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => chooseLang(l)}
              className={`folio border px-3 py-2 text-[10.5px] ${lang === l ? "border-ink bg-ink text-ground" : "border-ink/30 hover:border-ink"}`}
            >
              {l} <span className="opacity-70">{count(l)}</span>
            </button>
          ))}
        </div>

        <ol className="mt-2 max-h-[8.6rem] overflow-y-auto [scrollbar-width:thin]" data-lenis-prevent aria-label={`${lang} tracks`}>
          {queue.map((t, i) => {
            const on = t.id === currentId;
            return (
              <li key={t.id} className="border-b border-ink/15 last:border-0">
                <button
                  type="button"
                  onClick={() => load(t.id, true)}
                  aria-current={on ? "true" : undefined}
                  disabled={!ready}
                  className={`grid min-h-11 w-full grid-cols-[1.6rem_1fr_auto] items-center gap-2 py-1.5 text-left hover:text-vermilion disabled:opacity-50 ${on ? "text-vermilion" : ""}`}
                >
                  <span className="folio text-[10.5px]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[.9rem] leading-tight">{t.title}</span>
                    <span className="block truncate text-[.75rem] text-ink/70">{t.artist}</span>
                  </span>
                  <span className="folio text-[9.5px] text-ink/70">{t.lang === "Hindi" ? "HI" : "EN"}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <button
        ref={discRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="music-player"
        aria-label={open ? "Close music player" : playing ? "Open music player (playing)" : "Open music player"}
        className="fixed bottom-4 left-4 z-40 h-14 w-14 rounded-full md:bottom-6 md:left-6"
      >
        <span
          aria-hidden="true"
          className={`relative block h-full w-full rounded-full shadow-[0_0_0_1px_rgb(var(--ink)),0_6px_18px_rgb(var(--ink)/.25)] ${playing ? "motion-safe:animate-[spin_3.4s_linear_infinite]" : ""}`}
          style={{ background: "radial-gradient(circle, rgb(var(--vermilion-fill)) 0 22%, rgb(13 11 9) 23% 100%)" }}
        >
          <span className="absolute inset-[10%] rounded-full border border-[rgb(235_231_221/.2)]" />
          <span className="absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-[rgb(235_231_221)]" />
        </span>
      </button>
    </>
  );
}
