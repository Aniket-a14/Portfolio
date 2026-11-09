import { profileData } from "@/lib/data";

// Which of the real case studies use a skill? Derived from each project's own
// frontmatter (`stack` + `languages`), never hand-assigned, so the index can only
// ever claim what the case studies actually document.
const NEEDLE = {
  "c/c++": null, "data structures & algorithm": null, oop: null, "system design": null,
  "api development": null, "computer networks": null, git: null, "github actions": null,
  "ci/cd pipelines": null, vercel: null, postman: null, linux: null, mysql: null,
  mongodb: null, "express.js": null,
  "postgres sql": "postgres", "fast api": "fastapi", "tailwind css": "tailwind",
};
const squash = (s) => s.toLowerCase().replace(/\s+/g, "");

export function skillReferences(skill, projects) {
  const key = skill.toLowerCase();
  const needle = key in NEEDLE ? NEEDLE[key] : key;
  if (!needle) return [];
  return projects.filter((p) => [...(p.stack || []), ...(p.languages || [])].some((s) => squash(s).includes(squash(needle))));
}

export const SKILL_GROUPS = [
  ["Languages", profileData.skills.languages],
  ["Core CS", profileData.skills.core],
  ["Development", profileData.skills.development],
  ["Databases", profileData.skills.databases],
  ["Cloud & DevOps", profileData.skills.cloudAndDevops],
  ["Tools", profileData.skills.tools],
];
