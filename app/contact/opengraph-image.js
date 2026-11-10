import { renderCard } from "@/lib/og/card";

export const alt = "Contact Aniket Saha";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderCard({
    kicker: "Correspondence",
    title: "Write to me.",
    standfirst: "Got a project in mind? Let's work together. I reply within 24 hours.",
    left: "Letter to the author",
  });
}
