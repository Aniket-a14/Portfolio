export const SEO_CONFIG = {
  baseUrl: "https://aniketdesign.in",
  name: "Aniket Saha",
  titleSuffix: " | Portfolio",
  defaultDescription: "Explore Aniket Saha's portfolio – a Full Stack Developer, AI Engineer, and Machine Learning Enthusiast. Showcasing projects, skills, and experience.",
  keywords: [
    "Aniket Saha",
    "Full Stack Developer",
    "AI Engineer",
    "Machine Learning",
    "Web Developer",
    "Software Engineer",
    "Portfolio",
    "React",
    "Next.js",
    "Python",
    "Deep Learning",
    "Data Analysis"
  ],
  xHandle: "@AniketSaha41043",
};

export function getMetadata({ title, description, path = "", image = "/logo.jpeg" } = {}) {
  const fullTitle = title ? `${title}${SEO_CONFIG.titleSuffix}` : `Aniket Saha - Portfolio`;
  const url = `${SEO_CONFIG.baseUrl}${path}`;

  return {
    metadataBase: new URL(SEO_CONFIG.baseUrl),
    title: fullTitle,
    description: description || SEO_CONFIG.defaultDescription,
    keywords: SEO_CONFIG.keywords,
    authors: [{ name: SEO_CONFIG.name }],
    icons: {
      icon: "/logo.jpeg",
      apple: [
        { url: "/logo.jpeg" }
      ],
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: description || SEO_CONFIG.defaultDescription,
      url: url,
      siteName: SEO_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `Preview of ${fullTitle}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || SEO_CONFIG.defaultDescription,
      site: SEO_CONFIG.xHandle,
      creator: SEO_CONFIG.xHandle,
      images: [image],
    },
    appleWebApp: {
      capable: true,
      title: SEO_CONFIG.name,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: false,
    },
    other: {
      "theme-color": "#000000",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
