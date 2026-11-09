import HomeClient from "./HomeClient";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Blogs from "@/components/Blogs";
import Comments from "@/components/Comments";
import { getAllProjects } from "@/lib/projects";

// The listing is read from MDX frontmatter on the server, so the rows render with
// their real titles in the initial HTML. The page is composed here (not in a client
// component) so static sections — About, Skills, Experience, Testimonials — send no
// JavaScript of their own.
export default function Home() {
  const projects = getAllProjects().map((project) => ({
    id: project.id,
    slug: project.slug,
    order: project.order ?? project.id,
    title: project.title,
    fullTitle: project.fullTitle || project.title,
    tagline: project.tagline || "",
    role: project.role || "",
    timeline: project.timeline || "",
    image: project.image,
    languages: project.languages || [],
    stack: project.stack || [],
  }));

  return (
    <HomeClient>
      <Hero />
      <About />
      <Skills projects={projects} />
      <Projects projects={projects} />
      <Experience />
      <Blogs />
      <Comments />
    </HomeClient>
  );
}
