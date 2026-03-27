"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects as initialProjects } from "../lib/data";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ProjectRow = ({ project, index }) => {
  const slug = project.title.toLowerCase().replace(/\s+/g, "-");
  const [isHovered, setIsHovered] = useState(false);
  const rowRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 120, mass: 0.5 };
  const imgX = useSpring(x, springConfig);
  const imgY = useSpring(y, springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      if (!rowRef.current) return;
      const rect = rowRef.current.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    },
    [x, y]
  );

  const category = project.languages.slice(0, 2).join(" & ");

  return (
    <Link href={`/project/${slug}`} className="block">
      <div
        ref={rowRef}
        className={`group relative ${index > 0 ? 'border-t border-white/[0.07]' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex items-center justify-between py-8 md:py-10 lg:py-12 px-2">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-playfair text-white/[0.18] group-hover:text-white transition-colors duration-500 ease-out leading-[1.1] tracking-[-0.01em] select-none">
            {project.title}
          </h3>

          <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0 ml-8">
            <span className="text-[13px] text-white/25 group-hover:text-white/50 transition-colors duration-500 font-roboto tracking-[0.08em]">
              {category}
            </span>
          </div>
        </div>

        <motion.div
          className="absolute top-0 left-0 pointer-events-none z-30 hidden md:block"
          style={{
            x: imgX,
            y: imgY,
          }}
        >
          <motion.div
            className="relative"
            style={{ translateX: "-50%", translateY: "-60%" }}
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.6,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative w-[300px] h-[190px] lg:w-[360px] lg:h-[225px] rounded-md overflow-hidden shadow-[0_25px_60px_-10px_rgba(0,0,0,0.7)]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="360px"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px] rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "rgba(247, 248, 253, 0.9)",
                backdropFilter: "blur(4px)",
              }}
              initial={false}
              animate={{
                scale: isHovered ? 1 : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{
                duration: 0.35,
                delay: isHovered ? 0.08 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="text-black text-[13px] font-medium font-roboto tracking-wide">
                View
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="md:hidden relative z-10 px-2 pb-6 -mt-2 flex items-center gap-4">
          <div className="relative w-[72px] h-[48px] rounded overflow-hidden shrink-0 border border-white/[0.06]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="72px"
            />
          </div>
          <span className="text-[11px] text-white/30 font-roboto tracking-[0.1em] uppercase">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
};

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
    <div
      className="w-full text-white mt-0 bg-black pt-16 px-6 md:px-12 lg:px-20 overflow-hidden"
      id="projects"
    >
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-white/10 pt-10 mb-16">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-white/40 font-roboto text-sm tracking-[0.2em] uppercase">
              Selected Work
            </p>
            <span className="text-white/20 font-roboto text-sm tracking-wider">
              ({String(projectsData.length).padStart(2, "0")})
            </span>
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight">
            Recent projects
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {projectsData.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} />
        ))}

      </div>
    </div>
  );
};

export default Project;
