"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";
import { heroData, profileData } from "@/lib/data";
import { readTheme, toggleTheme } from "@/components/ThemeToggle/theme";
import { PALETTE_EVENT } from "./SearchButton";

/**
 * Command palette ("Index card" concept): Ctrl/Cmd+K, or the Search button, opens an index of the whole site.
 * Type to filter, arrows and Enter to choose, Esc to close. It is a combobox + listbox (focus stays in the
 * input, the highlighted row is announced through aria-activedescendant). Pages and projects are known at
 * build time; articles are fetched from /api/blogs the first time it opens.
 */

const PAGES = [
  { label: "Home", href: "/", text: "• HOME", dir: "up" },
  { label: "About", href: "about", text: "• ABOUT", dir: "down" },
  { label: "Projects", href: "projects", text: "• PROJECTS", dir: "down" },
  { label: "Experience", href: "experience", text: "• EXPERIENCE", dir: "down" },
  { label: "Articles", href: "/blogs", text: "• BLOGS", dir: "down" },
  { label: "Contact", href: "/contact", text: "• CONTACT", dir: "down" },
];

// Substring beats in-order letters; earlier matches rank higher. 0 means no match.
const score = (q, s) => {
  if (!q) return 1;
  const t = s.toLowerCase();
  const i = t.indexOf(q);
  if (i >= 0) return 100 - i;
  let j = 0;
  for (const c of t) if (c === q[j]) j++;
  return j === q.length ? 10 : 0;
};

const open_ = (url) => window.open(url, "_blank", "noopener,noreferrer");

export default function Palette({ projects }) {
  const { navigate } = useTransitionContext();
  const lenis = useLenis();
  const uid = useId();
  const listId = `${uid}-list`;

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [articles, setArticles] = useState(null);
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState("");

  const openRef = useRef(false);
  openRef.current = open;
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocus = useRef(null);
  const toastTimer = useRef(0);

  const say = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const show = useCallback(() => {
    lastFocus.current = document.activeElement;
    setDark(readTheme() === "dark");
    setQ("");
    setSel(0);
    setOpen(true);
  }, []);

  const hide = useCallback((restore = true) => {
    setOpen(false);
    if (restore) setTimeout(() => lastFocus.current?.isConnected && lastFocus.current.focus?.(), 0);
  }, []);

  // Ctrl/Cmd+K toggles it; the Search button dispatches PALETTE_EVENT.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) hide(); else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, show);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener(PALETTE_EVENT, show); };
  }, [show, hide]);

  // Page scroll is frozen while it is open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    inputRef.current?.focus();
    return () => lenis?.start();
  }, [open, lenis]);

  // Articles come from the Medium feed; load them the first time the palette opens.
  useEffect(() => {
    if (!open || articles) return;
    let alive = true;
    fetch("/api/blogs")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => alive && setArticles(Array.isArray(list) ? list : []))
      .catch(() => alive && setArticles([]));
    return () => { alive = false; };
  }, [open, articles]);

  const items = useMemo(() => {
    const goPage = (p) => () => navigate(p.href, p.text, p.dir);
    const email = profileData.contact.email;
    return [
      ...PAGES.map((p, i) => ({ group: "Pages", label: p.label, no: String(i + 1).padStart(2, "0"), hint: "Go", run: goPage(p) })),
      ...projects.map((p, i) => ({ group: "Projects", label: p.title, no: `P${i + 1}`, hint: p.year, run: () => navigate(`/project/${p.slug}`, `• ${p.title.toUpperCase()}`, "down", "project") })),
      ...(articles ?? []).map((a, i) => ({ group: "Articles", label: a.title.split(":")[0], no: `A${i + 1}`, hint: "Medium ↗", run: () => open_(a.link) })),
      { group: "Actions", label: dark ? "Switch to light mode" : "Switch to dark mode", no: "→", hint: "Theme", run: toggleTheme },
      { group: "Actions", label: "Play or pause music", no: "→", hint: "Music", run: () => window.dispatchEvent(new Event("music-toggle")) },
      { group: "Actions", label: "Copy email address", no: "→", hint: "Copy", run: () => { navigator.clipboard?.writeText(email).then(() => say("Email address copied"), () => say(email)); } },
      { group: "Actions", label: "Download résumé (PDF)", no: "→", hint: "PDF", run: () => open_(heroData.links.resume) },
      { group: "Actions", label: "Open GitHub", no: "→", hint: "↗", run: () => open_(profileData.contact.github) },
      { group: "Actions", label: "Open LinkedIn", no: "→", hint: "↗", run: () => open_(profileData.contact.linkedin) },
    ];
  }, [projects, articles, dark, navigate, say]);

  // Ranked results. With no query: the site's own order. With a query: best matches first, and the group that
  // holds the best match comes first, so Enter on "dark" lands on "Switch to dark mode" and not a loose match.
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    const scored = items.map((it, n) => ({ it, n, s: score(query, `${it.label} ${it.group}`) })).filter((r) => r.s > 0);
    if (!query) return scored.map((r) => r.it);
    const best = new Map();
    scored.forEach((r) => best.set(r.it.group, Math.max(best.get(r.it.group) ?? 0, r.s)));
    // Groups ordered by their best match (ties keep the site's order), so a group's rows stay contiguous.
    const order = [...best.keys()].sort((a, b) => best.get(b) - best.get(a));
    return scored
      .sort((a, b) => order.indexOf(a.it.group) - order.indexOf(b.it.group) || b.s - a.s || a.n - b.n)
      .map((r) => r.it);
  }, [items, q]);

  useEffect(() => setSel(0), [q]);

  const choose = (item) => {
    if (!item) return;
    hide(false);
    setTimeout(item.run, 140); // let the dialog unmount first so focus and scroll are settled
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(rows.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Home" && !q) { e.preventDefault(); setSel(0); }
    else if (e.key === "End" && !q) { e.preventDefault(); setSel(rows.length - 1); }
    else if (e.key === "Enter") { e.preventDefault(); choose(rows[sel]); }
  };

  // Escape closes; Tab stays inside the dialog (input <-> close button).
  const onDialogKey = (e) => {
    if (e.key === "Escape") { e.stopPropagation(); hide(); return; }
    if (e.key !== "Tab") return;
    const f = [...dialogRef.current.querySelectorAll("input, button")];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  useEffect(() => {
    if (open) document.getElementById(`${uid}-o${sel}`)?.scrollIntoView({ block: "nearest" });
  }, [sel, open, uid]);

  const groups = [];
  rows.forEach((it, i) => {
    let g = groups.find((x) => x.name === it.group);
    if (!g) groups.push((g = { name: it.group, items: [] }));
    g.items.push({ it, i });
  });

  return (
    <>
      {toast && (
        <p role="status" className="folio fixed bottom-6 left-1/2 z-[210] -translate-x-1/2 bg-ink px-4 py-2 text-ground">{toast}</p>
      )}

      {open && (
        <div
          className="pal-in fixed inset-0 z-[200] flex items-start justify-center bg-ink/35 px-3 pt-[6vh] backdrop-blur-[2px] md:pt-[9vh]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) hide(); }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            onKeyDown={onDialogKey}
            className="flex max-h-[80dvh] w-full max-w-[780px] flex-col border-[3px] border-double border-ink bg-ground px-5 pt-4 text-ink md:px-8 md:pt-5"
          >
            <div className="folio flex items-center justify-between gap-4 text-vermilion">
              <span className="hidden sm:inline">Index of this edition</span>
              <span className="tabular-nums" aria-live="polite">{rows.length} {rows.length === 1 ? "entry" : "entries"}</span>
              <button type="button" onClick={() => hide()} className="-mr-2 flex min-h-[40px] items-center px-2 text-ink/70 hover:text-vermilion focus-visible:text-vermilion">
                Close <span aria-hidden="true" className="ml-2">✕</span>
              </button>
            </div>

            <input
              ref={inputRef}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={rows.length ? `${uid}-o${sel}` : undefined}
              aria-label="Search pages, projects, articles and actions"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Look something up…"
              autoComplete="off"
              spellCheck={false}
              className="display mb-3 mt-1 w-full border-0 border-b border-ink bg-transparent pb-3 text-[clamp(1.8rem,5vw,3rem)] font-light leading-[1.1] tracking-[-0.03em] text-ink outline-none placeholder:text-ink/40 focus-visible:[box-shadow:inset_0_-2px_0_rgb(var(--vermilion))]"
            />

            <div id={listId} role="listbox" aria-label="Results" data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {rows.length === 0 && <p className="py-6 text-ink/70">No match. Try “project”, “dark” or “résumé”.</p>}
              {groups.map((g) => (
                <div key={g.name} role="group" aria-label={g.name}>
                  <p aria-hidden="true" className="folio mt-2 border-t border-ink/15 pb-1 pt-3 text-[11px] text-ink/70">{g.name}</p>
                  {g.items.map(({ it, i }) => (
                    <div
                      key={`${g.name}-${it.label}`}
                      id={`${uid}-o${i}`}
                      role="option"
                      aria-selected={i === sel}
                      onMouseMove={() => i !== sel && setSel(i)}
                      onClick={() => choose(it)}
                      className={`display flex min-h-[44px] cursor-pointer items-baseline gap-2.5 px-2 py-2 text-[1.2rem] font-light md:text-[1.35rem] ${i === sel ? "bg-ink text-ground" : ""}`}
                    >
                      <span className={`folio w-9 shrink-0 text-[11px] ${i === sel ? "text-ground" : "text-vermilion"}`}>{it.no}</span>
                      <span>{it.label}</span>
                      <span aria-hidden="true" className="-translate-y-1 flex-1 self-end border-b border-dotted border-current opacity-40" />
                      <span className="folio text-[11px] opacity-80">{it.hint}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="folio flex flex-wrap gap-x-5 gap-y-1 border-t border-ink/15 py-2.5 text-[11px] text-ink/70" aria-hidden="true">
              <span><kbd className="border border-ink/25 px-1">↑</kbd> <kbd className="border border-ink/25 px-1">↓</kbd> move</span>
              <span><kbd className="border border-ink/25 px-1">↵</kbd> open</span>
              <span><kbd className="border border-ink/25 px-1">esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
