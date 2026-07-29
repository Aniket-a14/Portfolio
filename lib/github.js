/**
 * Server-side GitHub metadata.
 *
 * This used to run in the browser on every project page view, which cost three
 * uncached round trips before anything rendered. It now runs on the server with
 * a one-hour ISR window, so the page ships as static HTML with the numbers
 * already baked in and refreshes itself in the background.
 */

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const REVALIDATE_SECONDS = 3600;

function authHeaders() {
  return process.env.GITHUB_TOKEN
    ? { ...GITHUB_HEADERS, Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : GITHUB_HEADERS;
}

/** "https://github.com/Aniket-a14/SRA" -> "Aniket-a14/SRA" */
export function repoPathFromUrl(url) {
  if (!url || !url.includes("github.com/")) return null;
  const [, path] = url.split("github.com/");
  return path ? path.replace(/\/$/, "") : null;
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: authHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Live repo stats. Always resolves — an unreachable or rate-limited GitHub
 * degrades to nulls and the UI simply omits those rows rather than failing the
 * page, since the narrative content does not depend on this call.
 */
export async function getRepoStats(repoUrl) {
  const repoPath = repoPathFromUrl(repoUrl);
  if (!repoPath) return null;

  const [repo, languages] = await Promise.all([
    fetchJson(`https://api.github.com/repos/${repoPath}`),
    fetchJson(`https://api.github.com/repos/${repoPath}/languages`),
  ]);

  if (!repo) return { repoPath, languages: languages || {} };

  return {
    repoPath,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    description: repo.description,
    homepage: repo.homepage || null,
    topics: repo.topics || [],
    license: repo.license?.spdx_id || null,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    defaultBranch: repo.default_branch,
    languages: languages || {},
  };
}

/** Stats for many repos at once, keyed by slug. Used by the home page listing. */
export async function getRepoStatsBySlug(projects) {
  const entries = await Promise.all(
    projects.map(async (project) => [
      project.slug,
      await getRepoStats(project.repo),
    ])
  );

  return Object.fromEntries(entries);
}
