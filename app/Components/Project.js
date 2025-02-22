import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({
  weight: ["700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const projects = [
  {
    id: 1,
    title: "404-Page",
    repoLink: "https://github.com/Aniket-a14",
    image: "/logo.jpeg",
    languages: ["JavaScript", "CSS", "HTML"],
    description: "Page similar to the macOS terminal with cool Easter eggs.",
    stars: 0,
  },
  {
    id: 2,
    title: "Patreon Clone",
    repoLink: "https://github.com/Aniket-a14",
    image: "/logo.jpeg",
    languages: ["React", "Node.js", "MongoDB"],
    description: "A fully functional Patreon-like platform with subscriptions.",
    stars: 0,
  },
  {
    id: 3,
    title: "Virtual Quiz Game",
    repoLink: "https://github.com/Aniket-a14",
    image: "/logo.jpeg",
    languages: ["Python", "Tkinter", "SQLite"],
    description: "A Python-based quiz game with a leaderboard.",
    stars: 0,
  },
];

const ProjectCard = ({ project }) => (
  <div className="transition-all duration-300 ease-in-out w-[350px] h-full text-left flex flex-col items-center border border-white/25 rounded-2xl bg-white/0 shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] backdrop-blur-[18px] hover:translate-y-[-10px] hover:translate-x-[2px] hover:shadow-[0_16px_64px_0_rgba(31,38,135,0.25)] group-hover:blur-[3px] hover:!blur-none p-4">
    <Image
      height={300}
      width={300}
      src={project.image}
      alt={project.title}
      className="w-[300px] h-[300px] object-cover rounded-lg"
    />
    <div className="repo-content w-full">
      <h3 className="flex items-center justify-between mt-5">
        <Link
          href={project.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline ml-2"
        >
          {project.title}
        </Link>
        <span className="flex items-center text-yellow-500 mr-5">
          <FaStar />
          <span className="ml-1">{project.stars}</span>
        </span>
      </h3>
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
    <div className="container text-white min-h-[120vh] mx-auto" id="projects">
      <h1 className={`text-5xl flex relative underline justify-center items-center pt-36 font-bold ${playfair.className}`}>
        Recent Projects 
      </h1>
      <div className="flex flex-wrap max-w-[1200px] justify-center gap-10 pt-16 mx-auto group">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Project;
