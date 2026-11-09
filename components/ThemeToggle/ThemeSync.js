"use client";

import { useEffect } from "react";
import { applyTheme, readTheme, storedTheme } from "./theme";

/** Mounted once in the root layout (renders nothing): keeps the page in step with the system setting until the visitor has chosen. */
export default function ThemeSync() {
  useEffect(() => {
    applyTheme(readTheme()); // aligns the browser-chrome colour with the theme the inline script chose
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => { if (!storedTheme()) applyTheme(mq.matches ? "dark" : "light"); };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);
  return null;
}
