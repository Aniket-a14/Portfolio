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
            // Press Edition: ink on paper. (The previous palette was pale-on-dark and
            // rendered as near-invisible boxes on the light ground.)
            background: "#ebe7dd",
            primaryColor: "#f4f1e8",
            primaryTextColor: "#15140f",
            primaryBorderColor: "#15140f",
            secondaryColor: "#e2ddd0",
            tertiaryColor: "#ebe7dd",
            lineColor: "#15140f",
            textColor: "#15140f",
            edgeLabelBackground: "#ebe7dd",
            clusterBkg: "#e2ddd0",
            clusterBorder: "#8a8676",
            noteBkgColor: "#f4f1e8",
            noteTextColor: "#15140f",
            actorBkg: "#f4f1e8",
            actorBorder: "#15140f",
            actorTextColor: "#15140f",
            signalColor: "#15140f",
            signalTextColor: "#15140f",
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "14px",
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
