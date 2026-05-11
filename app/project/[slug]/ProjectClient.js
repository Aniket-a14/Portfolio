"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, GitFork, Eye, ExternalLink, Github } from "lucide-react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { SEO_CONFIG } from "@/lib/seo";
import { useTransitionContext } from "@/components/providers/TransitionProvider";
import { fetchProjectData } from "@/lib/projectCache";
import ProjectCarousel from "@/components/ProjectCarousel";

const MermaidRenderer = dynamic(
  () => import("@/components/ui/MermaidRenderer"),
  { ssr: false }
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const LanguageBar = ({ languages }) => {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Shell: "#89e051",
    Jupyter: "#DA5B0B",
    "Rich Text Format": "#83AA51",
    "Jupyter Notebook": "#DA5B0B",
    HCL: "#844FBA",
    Dockerfile: "#384d54",
    PowerShell: "#012456",
    default: "#8b949e",
  };

  return (
    <div className="space-y-3">
      <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
        {Object.entries(languages).map(([lang, bytes]) => (
          <div
            key={lang}
            style={{
              width: `${(bytes / total) * 100}%`,
              backgroundColor: colors[lang] || colors.default,
            }}
            title={`${lang}: ${((bytes / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {Object.entries(languages).map(([lang, bytes]) => (
          <span key={lang} className="flex items-center gap-1.5 text-sm text-white/60">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors[lang] || colors.default }}
            />
            {lang}{" "}
            <span className="text-white/30">
              {((bytes / total) * 100).toFixed(1)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------- Markdown body (lazy-loaded, client only) ---------- */
const MarkdownBody = dynamic(
  () =>
    import("react-markdown").then((mod) => {
      const ReactMarkdown = mod.default;
      const remarkGfm = require("remark-gfm").default;
      const rehypeRaw = require("rehype-raw").default;

      const Wrapper = ({ content }) => (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const lang = match?.[1];
              const value = String(children).replace(/\n$/, "");

              if (lang === "mermaid") {
                return <MermaidRenderer chart={value} />;
              }

              if (lang) {
                return (
                  <div className="relative group my-4">
                    <span className="absolute top-2 right-3 text-[10px] uppercase tracking-widest text-white/20 font-roboto">
                      {lang}
                    </span>
                    <pre className="bg-white/[0.03] border border-white/10 rounded-md p-4 pt-8 overflow-x-auto text-sm leading-relaxed text-white/80">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              }

              return (
                <code
                  className="bg-white/10 text-white/80 rounded-md px-1.5 py-0.5 text-[13px] font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return <>{children}</>;
            },
            h1: ({ children }) => (
              <h1 className="text-[32px] font-semibold text-white/90 mt-8 mb-4 pb-2 border-b border-white/10">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-[24px] font-semibold text-white/85 mt-8 mb-3 pb-2 border-b border-white/10">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-[20px] font-semibold text-white/80 mt-6 mb-2">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-[16px] font-semibold text-white/75 mt-4 mb-2">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-[15px] text-white/55 leading-[1.7] mb-4 font-light [&>img]:inline [&>img]:my-0.5 [&>img]:mr-1">
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400/80 hover:text-blue-400 hover:underline transition-colors [&>img]:inline [&>img]:my-0.5 [&>img]:mr-1"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className="space-y-1 mb-4 ml-4 list-disc list-outside marker:text-white/20">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-1 mb-4 ml-4 list-decimal list-outside marker:text-white/30">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-[15px] text-white/55 font-light leading-[1.7] pl-1">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-[3px] border-white/15 pl-4 my-4 text-white/40">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4 rounded-md border border-white/10">
                <table className="w-full text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-white/[0.04] border-b border-white/10">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="text-left px-4 py-2.5 text-white/70 font-semibold text-sm">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2.5 text-white/55 text-sm border-t border-white/[0.06]">
                {children}
              </td>
            ),
            img: ({ src, alt }) => {
              const isBadge = src && (
                src.includes("shields.io") ||
                src.includes("github.com/") && src.includes("/actions/") ||
                src.includes("img.shields.io") ||
                src.includes("badge") ||
                src.includes("socket.dev") ||
                src.includes("vercel.com")
              );

              if (isBadge) {
                return (
                  <img
                    src={src}
                    alt={alt || ""}
                    className="inline-block h-5 mr-1 my-0.5"
                    loading="lazy"
                  />
                );
              }

              return (
                <span className="block my-6">
                  <img
                    src={src}
                    alt={alt || ""}
                    className="rounded-md max-w-full h-auto border border-white/10"
                    loading="lazy"
                  />
                </span>
              );
            },
            details: ({ children }) => (
              <details className="my-4 border border-white/10 rounded-md overflow-hidden">
                {children}
              </details>
            ),
            summary: ({ children }) => (
              <summary className="px-4 py-2 bg-white/[0.04] text-white/80 text-sm font-medium cursor-pointer hover:bg-white/[0.07] transition-colors">
                {children}
              </summary>
            ),
            hr: () => <hr className="border-white/10 my-6" />,
          }}
        >
          {content}
        </ReactMarkdown>
      );

      Wrapper.displayName = "MarkdownBody";
      return Wrapper;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="text-white/20 font-roboto text-sm py-8 animate-pulse">
        Rendering README...
      </div>
    ),
  }
);

const ProjectClient = ({ slug }) => {
  const router = useRouter();
  const { navigate } = useTransitionContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await fetchProjectData(slug);
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  const processedReadme = useMemo(() => {
    if (!data?.readme || !data?.repoPath) return "";
    const repoPath = data.repoPath;
    const branch = data.repoMeta?.defaultBranch || "main";
    return data.readme.replace(
      /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
      (match, alt, path) =>
        `![${alt}](https://raw.githubusercontent.com/${repoPath}/${branch}/${path})`
    );
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black" />
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <p className="text-white/50 font-roboto text-lg">Project not found</p>
        <button
          onClick={() => navigate("/", "• Home", "up")}
          className="text-white/40 hover:text-white/70 transition-colors font-roboto text-sm flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to home
        </button>
      </div>
    );
  }

  const { project, repoMeta, languages } = data;

  return (
    <div className="min-h-screen bg-black text-white" suppressHydrationWarning>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": SEO_CONFIG.baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Projects",
                "item": `${SEO_CONFIG.baseUrl}/#projects`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": project.title,
                "item": `${SEO_CONFIG.baseUrl}/project/${slug}`
              }
            ]
          })
        }}
      />
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="max-w-[900px] mx-auto px-6 sm:px-10 pt-28 pb-20">
        <motion.button
          custom={0}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          onClick={() => navigate("/", "• Home", "up")}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors font-roboto text-sm mb-10 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to home
        </motion.button>

        <motion.div custom={1} variants={fadeIn} initial="hidden" animate="visible">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-white/95 leading-tight">
            {project.title}
          </h1>
          {repoMeta?.description && (
            <p className="font-roboto text-lg text-white/45 font-light mt-4 leading-relaxed max-w-[700px]">
              {repoMeta.description}
            </p>
          )}
        </motion.div>

        <motion.div
          custom={2}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-6 mt-8 pb-8 border-b border-white/10"
        >
          {repoMeta?.stars !== undefined && (
            <span className="flex items-center gap-1.5 text-sm text-white/50">
              <Star size={14} className="text-yellow-500" />
              {repoMeta.stars} stars
            </span>
          )}
          {repoMeta?.forks !== undefined && (
            <span className="flex items-center gap-1.5 text-sm text-white/50">
              <GitFork size={14} />
              {repoMeta.forks} forks
            </span>
          )}
          {repoMeta?.watchers !== undefined && (
            <span className="flex items-center gap-1.5 text-sm text-white/50">
              <Eye size={14} />
              {repoMeta.watchers} watchers
            </span>
          )}
          {repoMeta?.language && (
            <span className="text-sm text-white/50 font-roboto">
              {repoMeta.language}
            </span>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <a
              href={project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors border border-white/10 rounded-full px-4 py-1.5"
            >
              <Github size={14} /> Source
            </a>
            {(repoMeta?.homepage || project.liveLink) && (
              <a
                href={repoMeta?.homepage || project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors border border-white/10 rounded-full px-4 py-1.5"
              >
                <ExternalLink size={14} /> Live
              </a>
            )}
          </div>
        </motion.div>

        {repoMeta?.topics?.length > 0 && (
          <motion.div
            custom={3}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-2 mt-6"
          >
            {repoMeta.topics.map((topic) => (
              <span
                key={topic}
                className="text-xs font-roboto text-blue-400/70 bg-blue-400/10 border border-blue-400/10 rounded-full px-3 py-1"
              >
                {topic}
              </span>
            ))}
          </motion.div>
        )}

        {languages && Object.keys(languages).length > 0 && (
          <motion.div
            custom={4}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <LanguageBar languages={languages} />
          </motion.div>
        )}

        {processedReadme && (
          <motion.div
            custom={5}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-12"
          >
            <h3 className="font-roboto text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-6">
              README
            </h3>
            <MarkdownBody content={processedReadme} />
          </motion.div>
        )}

        <ProjectCarousel currentSlug={slug} />
      </div>
    </div>
  );
};

export default ProjectClient;
