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
  const reactId = useId();
  const idRef = useRef(`mermaid-${reactId.replace(/:/g, "")}`);

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
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            background: "transparent",
            primaryColor: "rgba(255,255,255,0.035)",
            primaryTextColor: "#eae6de",
            primaryBorderColor: "rgba(198,168,120,0.35)",
            secondaryColor: "rgba(255,255,255,0.05)",
            tertiaryColor: "rgba(255,255,255,0.02)",
            lineColor: "rgba(198,168,120,0.45)",
            textColor: "#b9b4aa",
            fontFamily: "var(--font-roboto), sans-serif",
            fontSize: "13px",
          },
          flowchart: { curve: "basis", padding: 16 },
          sequence: { actorMargin: 40 },
        });

        const { svg: rendered } = await mermaid.render(idRef.current, chart.trim());
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setSvg("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, visible]);

  return (
    <figure
      ref={containerRef}
      className="my-12 -mx-2 overflow-x-auto border-y border-white/10 bg-white/[0.012] px-2 py-8 sm:mx-0 sm:px-6 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      // A diagram with no accessible fallback is noise for a screen reader.
      role="img"
      aria-label="Architecture diagram"
    >
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-40 animate-pulse rounded-sm bg-white/[0.02]" />
      )}
    </figure>
  );
};

export default Mermaid;
