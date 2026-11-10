import { getAllProjects } from "@/lib/projects";
import Palette from "./Palette";

// Projects are read from the MDX frontmatter on the server, so the palette needs no extra request for them.
export default function CommandPalette() {
  const projects = getAllProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
    year: String(p.timeline || p.year || ""),
  }));
  return <Palette projects={projects} />;
}
