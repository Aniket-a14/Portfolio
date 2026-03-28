import { NextResponse } from 'next/server';
import { projects } from '@/lib/data';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    // Find the project by slug (title lowercased, spaces replaced with hyphens)
    const project = projects.find(
      (p) => p.title.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.repoLink || !project.repoLink.includes('github.com')) {
      return NextResponse.json({ readme: '', project }, { status: 200 });
    }

    const urlParts = project.repoLink.split('github.com/');
    if (urlParts.length < 2) {
      return NextResponse.json({ readme: '', project }, { status: 200 });
    }

    const repoPath = urlParts[1].replace(/\/$/, '');

    // Fetch README content from GitHub API
    const readmeRes = await fetch(
      `https://api.github.com/repos/${repoPath}/readme`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    let readme = '';
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      // README content is base64 encoded
      readme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
    }

    // Fetch repo details for extra metadata
    const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    let repoMeta = {};
    if (repoRes.ok) {
      const repoData = await repoRes.json();
      repoMeta = {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        description: repoData.description,
        homepage: repoData.homepage,
        topics: repoData.topics || [],
        created_at: repoData.created_at,
        updated_at: repoData.updated_at,
        language: repoData.language,
        open_issues: repoData.open_issues_count,
      };
    }

    // Fetch languages
    const langRes = await fetch(
      `https://api.github.com/repos/${repoPath}/languages`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    let languages = {};
    if (langRes.ok) {
      languages = await langRes.json();
    }

    return NextResponse.json({
      readme,
      project,
      repoMeta,
      languages,
      repoPath,
    });
  } catch (error) {
    console.error('Error fetching project README:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project data' },
      { status: 500 }
    );
  }
}
