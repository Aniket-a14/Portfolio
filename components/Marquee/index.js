import React from "react";
import { profileData } from "@/lib/data";

// The role ticker. It used to close the hero; it now follows the trailer, which makes it the strip that
// carries the page from the black cinema block back to the paper. Its top padding equals About's own top padding (6vh),
// so the text sits exactly halfway between the black block and the About rule. Decorative, so hidden from assistive tech.
const items = [...profileData.roles, "Python", "TypeScript", "Next.js", "LLM systems", "Automation"];

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-ground pt-[6vh] leading-none" aria-hidden="true">
      <div className="flex w-max items-center gap-[2.4rem] whitespace-nowrap font-display text-[clamp(1.4rem,2.6vw,2.4rem)] italic [--duration:46s] [--gap:2.4rem]">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 animate-marquee items-center gap-[2.4rem]">
            {items.map((t) => (
              <span key={t + k} className="inline-flex items-center gap-[.45em] pb-[.12em] leading-none">{t} <em className="not-italic text-vermilion-bright">✶</em></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
