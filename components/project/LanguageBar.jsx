import React from "react";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Swift: "#F05138",
  "C++": "#f34b7d",
  C: "#555555",
  Shell: "#89e051",
  MDX: "#fcb32c",
  HCL: "#844FBA",
  Dockerfile: "#384d54",
  PowerShell: "#012456",
  Batchfile: "#C1F12E",
  PLpgSQL: "#336790",
  "Jupyter Notebook": "#DA5B0B",
  Mermaid: "#ff3670",
};

const FALLBACK = "#7d8590";

/**
 * GitHub-style language breakdown. Rendered on the server from the languages
 * payload, so there is no client-side work and no layout shift.
 */
const LanguageBar = ({ languages = {}, max = 6 }) => {
  const entries = Object.entries(languages);
  if (!entries.length) return null;

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (!total) return null;

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const shown = sorted.slice(0, max);
  const otherBytes = sorted.slice(max).reduce((sum, [, bytes]) => sum + bytes, 0);

  const segments = otherBytes
    ? [...shown, ["Other", otherBytes]]
    : shown;

  return (
    <div className="space-y-4">
      <div className="flex h-[2px] overflow-hidden bg-ink/[0.07]">
        {segments.map(([name, bytes]) => (
          <div
            key={name}
            style={{
              width: `${(bytes / total) * 100}%`,
              backgroundColor: LANGUAGE_COLORS[name] || FALLBACK,
            }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {segments.map(([name, bytes]) => (
          <li
            key={name}
            className="flex items-baseline gap-2 font-body text-[11.5px] text-ink/70"
          >
            <span
              className="h-[6px] w-[6px] shrink-0 self-center"
              style={{ backgroundColor: LANGUAGE_COLORS[name] || FALLBACK }}
            />
            {name}
            <span className="tabular-nums text-ink/70">
              {((bytes / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageBar;
