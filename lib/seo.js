export const SEO_CONFIG = {
  baseUrl: "https://www.aniketdesign.in",
  name: "Aniket Saha",
  titleSuffix: " | Portfolio",
  defaultDescription: "Aniket Saha is an AI Engineer and Full Stack Developer building multi-agent systems, LLM agents and RAG pipelines. Case studies, research and writing.",
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
    "Data Analysis",
    "LLM Agents",
    "RAG Pipelines",
    "Prompt Engineering",
    "Multi-Agent Systems",
    "Ollama",
    "Rust",
    "Open Source"
  ],
  xHandle: "@AniketSaha41043",
};

export function getMetadata({ title, description, path = "", image = "/og-portfolio.png" } = {}) {
  const fullTitle = title ? `${title}${SEO_CONFIG.titleSuffix}` : `Aniket Saha - Portfolio`;
  const url = `${SEO_CONFIG.baseUrl}${path}`;

  return {
    metadataBase: new URL(SEO_CONFIG.baseUrl),
    title: fullTitle,
    description: description || SEO_CONFIG.defaultDescription,
    keywords: SEO_CONFIG.keywords,
    authors: [{ name: SEO_CONFIG.name }],
    icons: {
      icon: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
    },
    other: {
      "theme-color": "#ebe7dd",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
