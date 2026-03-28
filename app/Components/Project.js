"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects as initialProjects } from "../lib/data";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ProjectRow = ({ project, index, isActive }) => {
  const slug = project.title.toLowerCase().replace(/\s+/g, "-");
  const category = project.languages.slice(0, 2).join(" & ");

  return (
    <Link href={`/project/${slug}`} className="block relative z-10">
      <div
        className={`group relative ${index > 0 ? 'border-t border-white/[0.1]' : ''}`}
        data-project-id={project.id}
      >
        <div className={`absolute inset-0 bg-white/[0.03] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

        <div className="relative z-20 flex items-center justify-between py-8 md:py-10 lg:py-12 px-2">
          <h3
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl transition-colors duration-500 ease-out leading-[1.1] tracking-tighter select-none uppercase ${isActive ? 'text-white' : 'text-white/[0.25]'}`}
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {project.title}
          </h3>

          <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0 ml-8">
            <span className={`text-[13px] transition-colors duration-500 font-roboto tracking-[0.08em] ${isActive ? 'text-white/50' : 'text-white/25'}`}>
              {category}
            </span>
          </div>
        </div>

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
  const [activeProjectId, setActiveProjectId] = useState(null);
  const containerRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 120, mass: 0.5 };
  const imgX = useSpring(x, springConfig);
  const imgY = useSpring(y, springConfig);

  const updateActiveState = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    x.set(mousePos.current.x - containerRect.left);
    y.set(mousePos.current.y - containerRect.top);

    const element = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
    const row = element?.closest("[data-project-id]");

    if (row && containerRef.current.contains(row)) {
      setActiveProjectId(parseInt(row.getAttribute("data-project-id")));
    } else {
      setActiveProjectId(null);
    }
  }, [x, y]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      updateActiveState();
    };

    const handleScroll = () => {
      updateActiveState();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateActiveState]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjectsData(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects data:", error);
      }
    };
    fetchProjects();
  }, []);

  const activeProject = projectsData.find(p => p.id === activeProjectId);
  const activeIndex = projectsData.findIndex(p => p.id === activeProjectId);

  return (
    <div
      ref={containerRef}
      className="w-full text-white mt-0 bg-transparent pt-16 pb-20 md:pb-32 px-6 md:px-12 lg:px-20 relative"
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
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            isActive={activeProjectId === project.id}
          />
        ))}
      </div>

      <motion.div
        className="absolute top-0 left-0 pointer-events-none z-0 hidden md:block"
        style={{
          x: imgX,
          y: imgY,
          opacity: activeProject ? 1 : 0,
          scale: activeProject ? 1 : 0.6,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }}
      >
        <div
          className="relative"
          style={{ translateX: "-50%", translateY: "1.5rem" }}
        >
          <div className="relative w-[300px] h-[190px] lg:w-[360px] lg:h-[225px] rounded-sm overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-black/5">
            <motion.div
              className="absolute inset-0 w-full"
              animate={{
                y: activeIndex >= 0
                  ? -1 * activeIndex * (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 225 : 190)
                  : 0
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {projectsData.map((project) => (
                <div
                  key={`img-${project.id}`}
                  className="relative w-full h-[190px] lg:h-[225px]"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="360px"
                    priority={activeProjectId === project.id}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center pointer-events-none z-10"
            style={{
              backgroundColor: "rgba(26, 25, 25, 0.9)",
              backdropFilter: "blur(4px)",
            }}
            animate={{
              scale: activeProject ? 1 : 0,
              opacity: activeProject ? 1 : 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="text-white text-[12px] font-medium font-roboto tracking-wide">
              View
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Project;
