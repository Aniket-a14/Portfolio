// lib/projectCache.js
const cache = new Map();

export const fetchProjectData = async (slug) => {
  if (cache.has(slug)) {
    return cache.get(slug);
  }
  const res = await fetch(`/api/projects/${slug}/readme`);
  if (!res.ok) throw new Error("Project not found");
  const data = await res.json();
  cache.set(slug, data);
  return data;
};

export const preloadProjects = (projects) => {
  if (typeof window === "undefined") return;
  
  projects.forEach((p) => {
    const slug = p.title.toLowerCase().replace(/\s+/g, "-");
    // Fire and forget, caching silently
    fetchProjectData(slug).catch(() => {}); 
  });
};
