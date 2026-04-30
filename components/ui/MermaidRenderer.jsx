"use client";

import React, { useEffect, useRef, useState, useId } from "react";

const MermaidRenderer = ({ chart }) => {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState("");
  const [mounted, setMounted] = useState(false);
  const reactId = useId();
  const idRef = useRef(`mermaid-${reactId.replace(/:/g, "")}`);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !chart) return;

    const renderChart = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#1a1a2e",
            primaryTextColor: "#e0e0e0",
            primaryBorderColor: "#333",
            lineColor: "#555",
            secondaryColor: "#16213e",
            tertiaryColor: "#0f3460",
            fontFamily: "Roboto, sans-serif",
          },
          flowchart: { curve: "basis" },
          sequence: { actorMargin: 50 },
        });

        const { svg: renderedSvg } = await mermaid.render(
          idRef.current,
          chart.trim()
        );
        setSvg(renderedSvg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setSvg(`<pre style="color: #ff6b6b; padding: 1rem;">${err.message}</pre>`);
      }
    };

    renderChart();
  }, [chart, mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="my-6 overflow-x-auto rounded-lg bg-[#0a0a12] p-4 border border-white/10"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidRenderer;
