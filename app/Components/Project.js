import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import Marquee from "@/components/ui/Marquee";
import { projects as initialProjects } from "../lib/data";

const ProjectCard = ({ project }) => (
  <div className="group relative transition-all duration-500 ease-in-out w-full max-w-[360px] h-[480px] text-left flex flex-col border border-white/20 rounded-xl shadow-[0_0_1px_rgba(255,255,255,0.2),0_10px_40px_rgba(0,0,0,0.8)] hover:translate-y-[-12px] hover:shadow-[0_20px_80px_0_rgba(0,0,0,0.9)] overflow-hidden">

    <div className="absolute inset-0 w-full h-full transition-all duration-700">
      <Image
        fill
        src={project.image}
        alt={project.title}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>

    <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black via-black/80 to-transparent transition-all duration-500" />

    <div className="relative z-10 w-full mt-auto p-8 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="text-white font-bold text-2xl truncate max-w-[80%] font-playfair"
        >
          {project.title}
        </span>
        <span className="flex items-center text-yellow-500 bg-white/5 backdrop-blur-xl px-3 py-1 rounded-full text-xs font-bold shadow-sm shrink-0 border border-white/10">
          <FaStar className="mr-1" />
          {project.stars}
        </span>
      </div>

      <div className="repo-stats flex flex-wrap gap-2">
        {project.languages.map((lang, index) => (
          <span key={index} className="text-[10px] uppercase tracking-widest font-bold text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md backdrop-blur-md">
            {lang}
          </span>
        ))}
      </div>

      <p className="mt-1 text-white/80 font-medium line-clamp-2 text-sm leading-relaxed" title={project.description}>
        {project.description}
      </p>

      <div className="mt-2 h-0 opacity-0 group-hover:h-6 group-hover:opacity-100 transition-all duration-500 overflow-hidden flex items-center gap-5">
        <Link
          href={project.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5 group/btn cursor-pointer transition-colors hover:text-blue-300"
        >
          Source Code <span className="text-base group-hover/btn:translate-x-1 transition-transform">→</span>
        </Link>

        {project.liveLink && (
          <Link
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 group/live cursor-pointer transition-colors hover:text-emerald-300"
          >
            Live Demo <span className="text-base group-hover/live:translate-x-0.5 group-hover/live:translate-y-[-0.5px] transition-transform">↗</span>
          </Link>
        )}
      </div>
    </div>
  </div>
);

const Project = () => {
  const [projectsData, setProjectsData] = useState(initialProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjectsData(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects data from GitHub:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="w-full text-white mt-0" id="projects">
      <h4 className={`text-2xl sm:text-3xl md:text-4xl xl:text-5xl flex relative justify-center items-center pb-2 font-bold font-roboto`}>
        <Marquee texts={["RECENT", "WORKS"]} speed={40} />
      </h4>
      <div className="flex flex-wrap max-w-[1200px] justify-center gap-10 pt-6 pb-56 mx-auto px-4">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Project;
