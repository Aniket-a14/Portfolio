import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

/**
 * Reads every MDX case study once per request and returns the parsed
 * frontmatter, sorted by the explicit `order` field.
 *
 * Frontmatter is the single source of truth for project metadata: the home page
 * listing, the detail page hero, sitemap entries and OG tags all read from here.
 * Nothing about a project lives in two places.
 */
export const getAllProjects = cache(() => {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = data.slug || file.replace(/\.mdx$/, "");

      return {
        ...data,
        slug,
        readingTime: estimateReadingTime(content),
      };
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
});

/** Frontmatter + raw MDX body for a single project, or null when unknown. */
export const getProjectBySlug = cache((slug) => {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf-8"));

  return {
    frontmatter: {
      ...data,
      slug: data.slug || slug,
      readingTime: estimateReadingTime(content),
    },
    content,
    headings: extractHeadings(content),
  };
});

/** Slugs for `generateStaticParams` so every case study is prerendered. */
export const getProjectSlugs = cache(() =>
  getAllProjects().map((project) => project.slug)
);

/** The project before and after this one, for the foot-of-page navigation. */
export const getAdjacentProjects = cache((slug) => {
  const projects = getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
});

/**
 * `## ` and `### ` headings become the sticky table of contents. Slugs are
 * generated the same way `rehype-slug` generates its `id` attributes so the
 * anchors line up without a second pass over the tree.
 */
function extractHeadings(content) {
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
  const headings = [];

  for (const line of withoutCodeBlocks.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = match[2].replace(/`/g, "").replace(/\*\*/g, "");
    headings.push({
      depth: match[1].length,
      text,
      id: slugifyHeading(text),
    });
  }

  return headings;
}

export function slugifyHeading(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function estimateReadingTime(content) {
  const words = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 220));
}
