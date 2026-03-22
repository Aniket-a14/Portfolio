import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import Marquee from "@/components/ui/Marquee";
import { projects as initialProjects } from "../lib/data";

const ProjectCard = ({ project }) => (
  // Use w-full and max-w-sm to ensure it shrinks on small screens but doesn't grow too large
  <div className="transition-all duration-300 ease-in-out w-full max-w-[350px] h-[520px] text-left flex flex-col items-center border border-white/25 rounded-2xl bg-white/0 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] backdrop-blur-[18px] hover:translate-y-[-10px] hover:translate-x-[2px] hover:shadow-[0_16px_64px_0_rgba(255,255,255,0.15)] p-4">
    <Image
      height={300}
      width={300} 
      src={project.image}
      alt={project.title}
      className="w-full h-[350px] object-cover object-top rounded-lg" // Fixed height for uniformity, full width for centering
    />
    <div className="repo-content w-full flex flex-col flex-grow mt-2">
      <h6 className="flex items-center justify-between mt-3">
        <Link
          href={project.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-semibold hover:underline hover:underline-offset-2 ml-2 truncate max-w-[80%]"
        >
          {project.title}
        </Link>
        <span className="flex items-center text-yellow-500 mr-2 shrink-0">
          <FaStar />
          <span className="ml-1">{project.stars}</span>
        </span>
      </h6>
      <div className="repo-stats text-sm text-gray-300 mt-2 ml-2 truncate">
        {project.languages.map((lang, index) => (
          <span key={index} className="language-item text-xs md:text-sm">
            {lang}
            {index < project.languages.length - 1 && ", "}
          </span>
        ))}
      </div>
      <p className="mt-2 text-gray-400 ml-2 mb-2 line-clamp-3 text-sm flex-grow" title={project.description}>
        {project.description}
      </p>
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
