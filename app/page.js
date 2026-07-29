import HomeClient from "./HomeClient";
import { getAllProjects } from "@/lib/projects";

// The listing is read from MDX frontmatter on the server, so the home page no
// longer fetches /api/projects on mount and the rows render with their real
// titles in the initial HTML.
export default function Home() {
  const projects = getAllProjects().map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    image: project.image,
    languages: project.languages || [],
  }));

  return <HomeClient projects={projects} />;
}
