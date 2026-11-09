"use client";

import React, { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { THEME_KEY, applyTheme as apply, readTheme as read } from "./theme";

const subscribe = (cb) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};

/**
 * Light / dark switch. First visit follows the system setting and keeps following it; pressing the
 * button saves an explicit choice that wins from then on. The change is a diagonal ink sweep using the
 * View Transitions API; browsers without it, and visitors who prefer reduced motion, get an instant switch.
 */
export default function ThemeToggle({ className = "" }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light");
  const dark = theme === "dark";

  const onClick = () => {
    const next = dark ? "light" : "dark";
    try { window.localStorage.setItem(THEME_KEY, next); } catch { /* choice just won't persist */ }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !document.startViewTransition) return apply(next);

    const root = document.documentElement;
    root.dataset.vt = "theme";
    const t = document.startViewTransition(() => flushSync(() => apply(next)));
    t.ready.then(() => {
      root.animate(
        { clipPath: ["polygon(0 0, 0 0, -28% 100%, 0 100%)", "polygon(0 0, 128% 0, 100% 100%, 0 100%)"] },
        { duration: 850, easing: "cubic-bezier(.76,0,.24,1)", pseudoElement: "::view-transition-new(root)", fill: "both" }
      );
    }).catch(() => {});
    t.finished.finally(() => { delete root.dataset.vt; });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`folio inline-flex items-center justify-center gap-2 border border-ink px-3 py-1.5 transition-colors hover:border-vermilion hover:text-vermilion focus-visible:border-vermilion focus-visible:text-vermilion max-sm:size-[34px] max-sm:!p-0 ${className}`}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
        {dark ? (
          <g><circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" /></g>
        ) : (
          <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z" fill="currentColor" stroke="none" />
        )}
      </svg>
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
