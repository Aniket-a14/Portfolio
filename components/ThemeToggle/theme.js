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
