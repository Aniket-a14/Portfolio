import { NextResponse } from 'next/server';
import { projects } from '@/app/lib/data';

export async function GET() {
  try {
    const updatedProjects = await Promise.all(
      projects.map(async (project) => {
        if (!project.repoLink || !project.repoLink.includes('github.com')) {
          return project;
        }

        const urlParts = project.repoLink.split('github.com/');
        if (urlParts.length < 2) return project;
        
        const repoPath = urlParts[1].replace(/\/$/, ""); // e.g., "Aniket-a14/SRA"
        
        // Fetch repo details (description, stars)
        // We use GitHub API v3
        const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`, {
          next: { revalidate: 3600 },
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        });
        
        let stars = project.stars;
        let description = project.description;
        
        if (repoRes.ok) {
          const repoData = await repoRes.json();
          stars = repoData.stargazers_count !== undefined ? repoData.stargazers_count : stars;
          description = repoData.description || description;
        }

        // Fetch languages
        const langRes = await fetch(`https://api.github.com/repos/${repoPath}/languages`, {
          next: { revalidate: 3600 },
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        });

        let languages = project.languages;
        if (langRes.ok) {
          const langData = await langRes.json();
          const fetchedLanguages = Object.keys(langData);
          if (fetchedLanguages.length > 0) {
            // Keep up to 4 most used languages to fit the UI nicely
            languages = fetchedLanguages.slice(0, 4);
          }
        }

        return {
          ...project,
          stars,
          description,
          languages
        };
      })
    );

    return NextResponse.json(updatedProjects);
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json(projects); // fallback to hardcoded
  }
}
