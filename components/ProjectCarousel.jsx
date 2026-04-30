"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { projects } from "@/lib/data";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const ProjectCarousel = ({ currentSlug }) => {
  const { navigate } = useTransitionContext();

  const otherProjects = React.useMemo(() => 
    projects.filter((p) => p.title.toLowerCase().replace(/ /g, "-") !== currentSlug),
    [currentSlug]
  );

  if (otherProjects.length === 0) return null;

  return (
    <section className="mt-40 pt-20 border-t border-white/5 relative">
      <div className="max-w-[900px] mx-auto px-6 sm:px-10 mb-12">
        <h3 className="text-[10px] font-roboto font-medium tracking-[0.4em] uppercase text-white/30">
          Discover More Work
        </h3>
      </div>

      <div className="w-full relative group/carousel">
        <div
           className="flex gap-8 px-6 sm:px-10 lg:pl-[calc((100vw-900px)/2+40px)] pr-20 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-8"
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {otherProjects.map((project) => {
            const slug = project.title.toLowerCase().replace(/ /g, "-");
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ opacity: 1 }}
                onClick={() => navigate(`/project/${slug}`, `• ${project.title.toUpperCase()}`, "down")}
                className="flex-shrink-0 w-[280px] md:w-[360px] aspect-[16/11] bg-white/[0.02] rounded-sm overflow-hidden border border-white/5 group transition-all snap-start cursor-pointer"
              >
                <div className="relative w-full h-[75%] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 280px, 360px"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-700" />
                </div>
                
                <div className="p-5 flex flex-col justify-between h-[25%] bg-black/20">
                  <div className="flex justify-between items-center text-left">
                    <h4 className="font-playfair text-xl text-white/80 group-hover:text-white transition-colors">
                      {project.title}
                    </h4>
                    <span className="text-[10px] font-roboto text-white/20 uppercase tracking-[0.2em] translate-y-1 group-hover:text-white/60 transition-all">
                        View →
                    </span>
                  </div>
                  <div className="flex gap-3 opacity-20 group-hover:opacity-60 transition-all duration-500">
                    {project.languages.slice(0, 2).map((lang) => (
                      <span key={lang} className="text-[9px] text-white uppercase font-roboto tracking-widest">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Hidden style for hiding scrollbars on webkit */}
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
      </div>
    </section>
  );
};


export default ProjectCarousel;
