import { flushSync } from "react-dom";

export const THEME_KEY = "theme";
const LIGHT_BG = "#ebe7dd";
const DARK_BG = "#1a1410";

export const readTheme = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export const storedTheme = () => {
  try { return window.localStorage.getItem(THEME_KEY); } catch { return null; }
};

// Applies a theme to <html>, keeps the browser chrome colour in step and tells subscribers (Mermaid, the toggle).
export function applyTheme(theme) {
  const r = document.documentElement;
  r.dataset.theme = theme;
  r.classList.toggle("dark", theme === "dark");
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.removeAttribute("media");
    m.setAttribute("content", theme === "dark" ? DARK_BG : LIGHT_BG);
  });
  window.dispatchEvent(new Event("themechange"));
}

// Light <-> dark with the diagonal ink sweep (View Transitions API). The choice is saved, so it wins over the
// system setting from then on. Browsers without the API, and visitors who prefer reduced motion, switch instantly.
// Used by the navbar toggle and by the command palette.
export function toggleTheme() {
  const next = readTheme() === "dark" ? "light" : "dark";
  try { window.localStorage.setItem(THEME_KEY, next); } catch { /* choice just won't persist */ }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !document.startViewTransition) return applyTheme(next);

  const root = document.documentElement;
  root.dataset.vt = "theme";
  const t = document.startViewTransition(() => flushSync(() => applyTheme(next)));
  t.ready.then(() => {
    root.animate(
      { clipPath: ["polygon(0 0, 0 0, -28% 100%, 0 100%)", "polygon(0 0, 128% 0, 100% 100%, 0 100%)"] },
      { duration: 850, easing: "cubic-bezier(.76,0,.24,1)", pseudoElement: "::view-transition-new(root)", fill: "both" }
    );
  }).catch(() => {});
  t.finished.finally(() => { delete root.dataset.vt; });
}
