import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import Marquee from "@/components/ui/Marquee";
import { projects } from "../lib/data";

const ProjectCard = ({ project }) => (
  // Use w-full and max-w-sm to ensure it shrinks on small screens but doesn't grow too large
  <div className="transition-all duration-300 ease-in-out w-full max-w-[350px] h-full text-left flex flex-col items-center border border-white/25 rounded-2xl bg-white/0 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] backdrop-blur-[18px] hover:translate-y-[-10px] hover:translate-x-[2px] hover:shadow-[0_16px_64px_0_rgba(255,255,255,0.15)] group-hover:blur-[3px] hover:!blur-none p-4">
    <Image
      height={300}
      width={300} // Set width to match the displayed size or intrinsic aspect ratio
      src={project.image}
      alt={project.title}
      className="w-full h-auto object-cover rounded-lg aspect-square" // Ensure image scales correcty
    />
    <div className="repo-content w-full">
      <h6 className="flex items-center justify-between mt-5">
        <Link
          href={project.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-semibold hover:underline hover:underline-offset-2 ml-2"
        >
          {project.title}
        </Link>
        <span className="flex items-center text-yellow-500 mr-5">
          <FaStar />
          <span className="ml-1">{project.stars}</span>
        </span>
      </h6>
      <div className="repo-stats text-sm text-gray-300 mt-2 ml-2">
        {project.languages.map((lang, index) => (
          <span key={index} className="language-item">
            {lang}
            {index < project.languages.length - 1 && ", "}
          </span>
        ))}
      </div>
      <p className="mt-2 text-gray-400 ml-2 mb-5">{project.description}</p>
    </div>
  </div>
);

const Project = () => {
  return (
    <div className="w-full text-white mt-0" id="projects">
      <h4 className={`text-2xl sm:text-3xl md:text-4xl xl:text-5xl flex relative justify-center items-center pb-2 font-bold font-roboto`}>
        <Marquee texts={["RECENT", "WORKS"]} speed={40} />
      </h4>
      <div className="flex flex-wrap max-w-[1200px] justify-center gap-10 pt-6 pb-56 mx-auto group px-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Project;
