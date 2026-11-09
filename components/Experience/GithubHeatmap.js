import React from "react";

const CELL = 14;
const GAP = 3;
const PITCH = CELL + GAP;
const LEFT = 34; // room for the day labels
const TOP = 22; // room for the month labels
const LEVELS = [
  "rgb(var(--ink) / 0.08)",
  "rgb(var(--vermilion) / 0.32)",
  "rgb(var(--vermilion) / 0.55)",
  "rgb(var(--vermilion) / 0.8)",
  "rgb(var(--vermilion))",
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Contribution data comes from ghchart (the same source the old profile drawer used),
 * parsed and redrawn here so the chart takes the site's own palette and type instead of
 * a scaled third-party image. Cached for a day; returns null if the service is down,
 * in which case the row simply doesn't render.
 */
export async function getContributions(username) {
  try {
    const res = await fetch(`https://ghchart.rshah.org/${username}`, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const svg = await res.text();

    const days = [...svg.matchAll(/data-score="(\d+)" data-date="([\d-]+)" x="(\d+)" y="(\d+)"/g)].map((m) => ({
      level: Math.min(4, Number(m[1])),
      date: m[2],
      x: Number(m[3]),
      y: Number(m[4]),
    }));
    if (days.length < 50) return null;

    const xs = [...new Set(days.map((d) => d.x))].sort((a, b) => a - b);
    const ys = [...new Set(days.map((d) => d.y))].sort((a, b) => a - b);
    return days.map((d) => ({ ...d, col: xs.indexOf(d.x), row: ys.indexOf(d.y) }));
  } catch {
    return null;
  }
}

export function summarise(days) {
  const active = days.filter((d) => d.level > 0).length;
  return { active, total: days.length };
}

export default function GithubHeatmap({ days }) {
  const cols = Math.max(...days.map((d) => d.col)) + 1;
  const width = LEFT + cols * PITCH - GAP;
  const height = TOP + 7 * PITCH - GAP;

  // A month label wherever the first day of a column falls in a new month.
  const labels = [];
  let last = -1;
  for (let c = 0; c < cols; c++) {
    const first = days.find((d) => d.col === c && d.row === 0);
    if (!first) continue;
    const month = Number(first.date.slice(5, 7)) - 1;
    if (month !== last) {
      if (c <= cols - 3) labels.push({ c, text: MONTHS[month] });
      last = month;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Heatmap of GitHub contributions over the last year"
      className="block h-auto w-full"
    >
      {labels.map((l) => (
        <text key={l.c} x={LEFT + l.c * PITCH} y={11} className="folio" fill="rgb(var(--ink) / 0.7)" style={{ fontSize: 10, letterSpacing: "0.08em" }}>
          {l.text}
        </text>
      ))}
      {[["Mon", 1], ["Wed", 3], ["Fri", 5]].map(([t, r]) => (
        <text key={t} x={0} y={TOP + r * PITCH + CELL - 3} className="folio" fill="rgb(var(--ink) / 0.7)" style={{ fontSize: 10, letterSpacing: "0.08em" }}>
          {t}
        </text>
      ))}
      {days.map((d) => (
        <rect
          key={d.date}
          x={LEFT + d.col * PITCH}
          y={TOP + d.row * PITCH}
          width={CELL}
          height={CELL}
          rx={2}
          fill={LEVELS[d.level]}
        >
          <title>{`${d.date}: ${d.level ? "contributions" : "no contributions"}`}</title>
        </rect>
      ))}
    </svg>
  );
}

export function Legend() {
  return (
    <p className="folio mt-3 flex items-center justify-end gap-1.5 text-[10px] text-ink/70" aria-hidden="true">
      Less
      {LEVELS.map((c) => (
        <i key={c} className="inline-block h-[11px] w-[11px] rounded-[2px]" style={{ background: c }} />
      ))}
      More
    </p>
  );
}
