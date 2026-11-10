import { renderCard } from "@/lib/og/card";

export const alt = "Aniket Saha, AI Engineer and Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderCard({
    kicker: "Portfolio",
    title: "Aniket Saha",
    standfirst: "AI Engineer and Full Stack Developer building multi-agent systems, LLM agents and RAG pipelines.",
    left: "AI Engineer · Full Stack Developer",
  });
}
