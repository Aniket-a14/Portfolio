import { projects } from '@/lib/data';

export default function sitemap() {
    const baseUrl = 'https://aniketdesign.in';

    const projectUrls = projects.map((project) => ({
        url: `${baseUrl}/project/${project.title.toLowerCase().replace(/\s+/g, '-')}`,
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
