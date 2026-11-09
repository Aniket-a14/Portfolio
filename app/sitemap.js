import { getAllProjects } from '@/lib/projects';

export default function sitemap() {
    const baseUrl = 'https://www.aniketdesign.in';

    const projectUrls = getAllProjects().map((project) => ({
        url: `${baseUrl}/project/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        ...projectUrls,
    ];
}
