"use client";

import React, { useEffect, useRef, useState, useId } from "react";

/**
 * Mermaid is ~500KB parsed. Loading it on mount would cost every project page
 * that expense before the reader has scrolled anywhere near a diagram, so the
 * import is deferred until the block is within 300px of the viewport.
 */
const Mermaid = ({ chart }) => {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState("");
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useState("light");
  const reactId = useId();
  const idRef = useRef(`mermaid-${reactId.replace(/:/g, "")}`);

  // Diagrams are drawn with the active theme's colours, so redraw when it changes.
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    read();
    window.addEventListener("themechange", read);
    return () => window.removeEventListener("themechange", read);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !chart) return;
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const dark = document.documentElement.dataset.theme === "dark";
        // Press Edition, both themes: ink on paper, and paper on espresso.
        const c = dark
          ? { bg: "#1a1410", node: "#241c16", fg: "#efe6d6", cluster: "#2d231b", clusterBorder: "#8a7f70" }
          : { bg: "#ebe7dd", node: "#f4f1e8", fg: "#15140f", cluster: "#e2ddd0", clusterBorder: "#8a8676" };
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            background: c.bg,
            primaryColor: c.node,
            primaryTextColor: c.fg,
            primaryBorderColor: c.fg,
            secondaryColor: c.cluster,
            tertiaryColor: c.bg,
            lineColor: c.fg,
            textColor: c.fg,
            edgeLabelBackground: c.bg,
            clusterBkg: c.cluster,
            clusterBorder: c.clusterBorder,
            noteBkgColor: c.node,
            noteTextColor: c.fg,
            actorBkg: c.node,
            actorBorder: c.fg,
            actorTextColor: c.fg,
            signalColor: c.fg,
            signalTextColor: c.fg,
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "14px",
          },
          flowchart: { curve: "basis", padding: 16 },
          sequence: { actorMargin: 40 },
        });

        const { svg: rendered } = await mermaid.render(`${idRef.current}-${document.documentElement.dataset.theme || "light"}`, chart.trim());
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setSvg("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, visible, theme]);

  return (
    <figure
      ref={containerRef}
      className="my-12 -mx-2 overflow-x-auto border-y border-ink/10 bg-ink/[0.012] px-2 py-8 sm:mx-0 sm:px-6 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      // A diagram with no accessible fallback is noise for a screen reader.
      role="img"
      aria-label="Architecture diagram"
    >
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-40 animate-pulse rounded-sm bg-ink/[0.02]" />
      )}
    </figure>
  );
};

export default Mermaid;
