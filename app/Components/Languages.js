"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useScroll } from "framer-motion";
import { profileData } from "../lib/data";

const ICON_MAPPING = {
  "C": "c",
  "C++": "cplusplus",
  "Python": "python",
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "React": "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  "FastAPI": "fastapi",
  "Express.js": "express",
  "Pandas": "pandas",
  "NumPy": "numpy",
  "Scikit-learn": "scikitlearn",
  "TensorFlow": "tensorflow",
  "PyTorch": "pytorch",
  "MongoDB": "mongodb",
  "PostgreSQL": "postgresql",
  "Git": "git",
  "GitHub": "github",
  "TailwindCSS": "tailwindcss",
  "Framer Motion": "framer",
  "jQuery": "jquery",
  "React Router": "reactrouter",
  "Redux": "redux"
};

const SkillItem = ({ skill, index }) => {
  const slug = ICON_MAPPING[skill] || skill.toLowerCase().replace(".", "dot").replace(" ", "");
  const needsFilter = ["nextdotjs", "express", "github", "git"].includes(slug);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      className="group flex items-center gap-3 md:gap-4 py-2 md:py-3 px-3 md:px-4 cursor-pointer relative"
    >
      <div className="relative size-6 md:size-9 flex-shrink-0 transition-all duration-500 group-hover:scale-110">
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={skill}
          className="size-full object-contain transition-all duration-500"
          style={needsFilter ? { filter: 'brightness(0) invert(1)' } : {}}
          onError={(e) => {
            e.target.src = "https://cdn.simpleicons.org/blueprint/ffffff";
          }}
        />
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 blur-xl transition-opacity rounded-full" />
      </div>

      <div className="relative flex flex-col">
        <span className="text-white/60 font-roboto text-[13px] sm:text-base lg:text-lg group-hover:text-white transition-colors duration-500 tracking-tight font-light">
          {skill}
        </span>
        <div
          className="absolute -bottom-1 left-0 h-[1px] bg-white/40 w-0 group-hover:w-full transition-all duration-500 ease-[0.22,1,0.36,1]"
        />
      </div>
    </motion.div>
  );
};

const CategoryButton = ({ name, index, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`text-left transition-all duration-700 relative py-1 md:py-2 group ${isActive ? "text-white" : "text-white/20 hover:text-white/40"
      }`}
  >
    <div className="flex items-baseline gap-3 md:gap-4">
      <span className="font-roboto text-[9px] md:text-[10px] opacity-30 group-hover:opacity-60 transition-opacity tracking-[0.2em]">
        0{index + 1}
      </span>
      <span className={`font-playfair text-xl sm:text-3xl md:text-4xl lg:text-5xl ${isActive ? "italic" : "font-normal"}`}>
        {name}
      </span>
    </div>
  </button>
);

const Languages = () => {
  const [activeCategory, setActiveCategory] = useState("Core");
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const categories = [
    { name: "Core", skills: profileData.skills.core },
    { name: "Frameworks", skills: profileData.skills.frameworks },
    { name: "AI & Data", skills: profileData.skills.aiAndData },
    { name: "Database and Tools", skills: profileData.skills.databaseAndTools },
  ];

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (latest < 0.25) setActiveCategory("Core");
      else if (latest < 0.5) setActiveCategory("Frameworks");
      else if (latest < 0.75) setActiveCategory("AI & Data");
      else setActiveCategory("Database and Tools");
    });
  }, [scrollYProgress]);

  const activeSkills = categories.find(c => c.name === activeCategory)?.skills || [];

  return (
    <div
      ref={scrollRef}
      className="relative w-full h-[350vh] bg-black scroll-mt-20"
      id="languages"
    >
      <div className="sticky top-0 left-0 h-screen w-full flex flex-col items-center overflow-hidden z-20">
        <div
          ref={containerRef}
          className="w-full max-w-6xl px-6 md:px-12 lg:px-0 relative pt-8 flex flex-col" 
        >
          <motion.div
            style={{ left: springX, top: springY }}
            className="absolute pointer-events-none w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0"
          />

          <header className="border-t border-white/10 pt-10 mb-10 w-full">
            <p className="text-white/40 font-roboto text-sm tracking-[0.2em] uppercase mb-4">
              Technical Stack
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight">
              Languages and tools proficiency
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full">
            <div className="lg:col-span-4 flex flex-col gap-1 md:gap-2">
              {categories.map((cat, idx) => (
                <CategoryButton
                  key={cat.name}
                  name={cat.name}
                  index={idx}
                  isActive={activeCategory === cat.name}
                  onClick={() => {
                    const section = scrollRef.current;
                    if (section) {
                      const targetProgress = (idx / categories.length) + 0.05;
                      const scrollPos = section.offsetTop + (targetProgress * section.offsetHeight);
                      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>

            <div className="lg:col-span-8 pb-10 relative">
                <div className="min-h-[280px] md:min-h-[320px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        visible: { transition: { staggerChildren: 0.05 } }
                      }}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-0.5"
                    >
                      {activeSkills.map((skill, i) => (
                        <SkillItem key={skill} skill={skill} index={i} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <div className="absolute bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-10 opacity-60 md:hidden" />

              <div className="mt-4 md:mt-8 pt-4 md:pt-6 flex items-center justify-between ">
                <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="size-1 rounded-full bg-white/10" />
                  ))}
                </div>
                <span className="text-[9px] md:text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase">
                  {activeSkills.length} Modules Loaded
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Languages;
