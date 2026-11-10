import { renderCard } from "@/lib/og/card";

export const alt = "Articles by Aniket Saha";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderCard({
    kicker: "Articles",
    title: "Writing",
    standfirst: "Technology, art and literature: essays on AI, decisions and the people who use them.",
    left: "Essays · Medium",
  });
}
