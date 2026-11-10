"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders the print sheet on the home page only and flags <html data-print="cv"> there, which is what the
 * @media print rules key on. On every other page the browser prints the page itself, as before.
 */
export default function PrintGate({ children }) {
  const home = usePathname() === "/";

  useEffect(() => {
    const root = document.documentElement;
    if (home) root.dataset.print = "cv";
    return () => { delete root.dataset.print; };
  }, [home]);

  return home ? children : null;
}
