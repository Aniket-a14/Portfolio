import { renderCard } from "@/lib/og/card";
import { getAllProjects, getProjectBySlug, getProjectSlugs } from "@/lib/projects";

export const alt = "Case study by Aniket Saha";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const fm = project?.frontmatter ?? {};
  const position = Math.max(1, getAllProjects().findIndex((p) => p.slug === slug) + 1);
  return renderCard({
    kicker: `Case study · ${String(position).padStart(2, "0")}`,
    title: fm.title ?? "Case study",
    standfirst: fm.tagline ?? fm.description ?? "",
    left: String(fm.timeline || fm.year || ""),
  });
}
