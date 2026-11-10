"use client";

import React, { useEffect, useState } from "react";

export const PALETTE_EVENT = "palette:open";

/** Visible way into the palette (most visitors will never guess the shortcut). Same look as the theme toggle. */
export default function SearchButton({ className = "", labelFrom = "sm" }) {
  const [mac, setMac] = useState(null);
  useEffect(() => { setMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)); }, []);

  const label = labelFrom === "lg" ? "hidden lg:inline" : "hidden sm:inline";
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(PALETTE_EVENT))}
      aria-label="Search the site"
      aria-keyshortcuts="Control+K Meta+K"
      className={`folio inline-flex items-center justify-center gap-2 border border-ink px-3 py-1.5 transition-colors hover:border-vermilion hover:text-vermilion focus-visible:border-vermilion focus-visible:text-vermilion max-sm:size-[34px] max-sm:!p-0 ${className}`}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="7" cy="7" r="4.6" /><path d="M10.6 10.6L14 14" />
      </svg>
      <span className={label}>Search</span>
      {mac !== null && <kbd className="hidden border border-ink/25 px-1 text-[9px] normal-case tracking-normal lg:inline">{mac ? "⌘K" : "Ctrl K"}</kbd>}
    </button>
  );
}
