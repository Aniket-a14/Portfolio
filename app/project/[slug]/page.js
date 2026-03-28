import { getMetadata } from "@/lib/seo";
import { projects } from "@/lib/data";
import ProjectClient from "./ProjectClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find(
    (p) => p.title.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!project) {
    return getMetadata({ title: "Project Not Found" });
  }

  return getMetadata({
    title: project.title,
    description: project.description,
    path: `/project/${slug}`,
    image: project.image,
  });
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  return <ProjectClient slug={slug} />;
}
