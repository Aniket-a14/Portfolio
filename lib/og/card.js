import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Share card ("Front page" concept): masthead rule, title in Fraunces Light, a vermilion rule, an italic
 * standfirst and a mono footer, on paper. Every page's opengraph-image / twitter-image calls this, so the
 * cards stay one design. Fonts are static instances (Fraunces 144pt Light for the title, Fraunces 36pt Light Italic for the standfirst, Plex Mono Medium; all OFL)
 * stored in ./fonts because the image renderer cannot use the site's variable web fonts.
 */
const INK = "#15140f";
const PAPER = "#ebe7dd";
const RED = "#b8321a";
const MUTE = "#66645d"; // ink at 62% on paper

let fontCache;
function loadFonts() {
  fontCache ??= (async () => {
    const dir = path.join(process.cwd(), "lib/og/fonts");
    const [roman, italic, mono] = await Promise.all([
      readFile(path.join(dir, "fraunces-300.ttf")),
      readFile(path.join(dir, "fraunces-300-italic-text.ttf")),
      readFile(path.join(dir, "plexmono-500.ttf")),
    ]);
    return [
      { name: "Fraunces", data: roman, weight: 300, style: "normal" },
      { name: "Fraunces", data: italic, weight: 300, style: "italic" },
      { name: "Plex", data: mono, weight: 500, style: "normal" },
    ];
  })();
  return fontCache;
}

// Cut to a word boundary so a long tagline never ends mid-word.
export function clip(text = "", max = 150) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "").replace(/[.,;:—-]+$/, "") + "…";
}

// One size per title length, so "SRA" is huge and a long title still fits on two lines.
const titleSize = (n) => (n <= 10 ? 128 : n <= 18 ? 108 : n <= 28 ? 88 : 70);

export async function renderCard({ kicker, title, standfirst, left, right = "aniketdesign.in" }) {
  const size = titleSize(title.length);
  const mono = { fontFamily: "Plex", fontSize: 20, letterSpacing: 2.8, textTransform: "uppercase" };
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: PAPER, color: INK, padding: "46px 64px", fontFamily: "Fraunces" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 14, ...mono }}>
            <span>Aniket Saha · Portfolio</span>
            <span>{kicker}</span>
          </div>
          <div style={{ display: "flex", height: 3, background: INK }} />
          <div style={{ display: "flex", height: 3 }} />
          <div style={{ display: "flex", height: 1, background: INK }} />
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: size, fontWeight: 300, lineHeight: 0.96, letterSpacing: -size * 0.02, maxWidth: 1060 }}>{title}</div>
        <div style={{ display: "flex", width: 150, height: 8, background: RED, marginTop: 30, marginBottom: 22 }} />
        <div style={{ display: "flex", fontStyle: "italic", fontSize: 36, lineHeight: 1.28, color: MUTE, maxWidth: 940 }}>{clip(standfirst, 150)}</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", ...mono }}>
          <span>{left}</span>
          <span>{right}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await loadFonts() }
  );
}
