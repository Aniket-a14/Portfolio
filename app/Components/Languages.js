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
  "Redux": "redux",
  "Java": "openjdk"
};

const SkillItem = ({ skill, index }) => {
  const slug = ICON_MAPPING[skill] || skill.toLowerCase().replace(".", "dot").replace(" ", "");
  const needsFilter = ["nextdotjs", "express", "github", "git", "openjdk"].includes(slug);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      className="group flex items-center gap-3 md:gap-5 py-3 md:py-4 px-4 cursor-pointer relative transition-all duration-300 rounded-lg hover:bg-white/[0.03]"
    >
      <div className="relative size-7 md:size-9 flex-shrink-0 transition-all duration-700 group-hover:scale-110">
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={skill}
          className="size-full object-contain transition-all duration-700"
          style={needsFilter ? { filter: 'brightness(0) invert(1)' } : {}}
          onError={(e) => {
            e.target.src = "https://cdn.simpleicons.org/blueprint/ffffff";
          }}
        />
        {/* Refined Glow */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 rounded-full" />
      </div>

      <div className="relative flex flex-col">
        <motion.span 
          whileHover={{ x: 4 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/40 font-roboto text-[14px] sm:text-[15px] lg:text-[16px] group-hover:text-white transition-colors duration-500 tracking-wider font-light uppercase"
        >
          {skill}
        </motion.span>
        <div
          className="absolute -bottom-1 left-0 h-[1px] bg-white/20 w-0 group-hover:w-full transition-all duration-500"
          style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
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
    <div className="flex items-center gap-4 md:gap-6">
      <div className={`h-[1px] bg-white transition-all duration-700 ${isActive ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-30"}`} />
      <div className="flex items-baseline gap-3 md:gap-4 transition-transform duration-500 group-hover:translate-x-1">
        <span className="font-roboto text-[9px] md:text-[10px] opacity-30 tracking-[0.3em]">
          0{index + 1}
        </span>
        <span
          className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair ${isActive ? "italic font-black" : "font-normal"}`}
        >
          {name}
        </span>
      </div>
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
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const categories = [
    { name: "Core", skills: profileData.skills.core },
    { name: "Frameworks", skills: profileData.skills.frameworks },
    { name: "AI & Data", skills: profileData.skills.aiAndData },
    { name: "Stack Hub", skills: profileData.skills.databaseAndTools },
  ];

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.25) setActiveCategory("Core");
      else if (latest < 0.5) setActiveCategory("Frameworks");
      else if (latest < 0.75) setActiveCategory("AI & Data");
      else setActiveCategory("Stack Hub");
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activeSkills = categories.find(c => c.name === activeCategory)?.skills || [];

  return (
    <div
      ref={scrollRef}
      className="relative w-full h-[400vh] bg-black scroll-mt-20"
      id="languages"
    >
      <div className="sticky top-0 left-0 h-screen w-full flex flex-col items-center overflow-hidden z-20">
        <div
          ref={containerRef}
          className="w-full max-w-7xl px-6 md:px-12 relative h-full flex flex-col pt-16 md:pt-20 pb-12"
        >
          {/* Subtle Cursor Follow */}
          <motion.div
            style={{ left: springX, top: springY }}
            className="absolute pointer-events-none w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block"
          />

          <header className="border-t border-white/10 pt-10 mb-8 w-full shrink-0 relative z-10">
            <p className="text-white/40 font-roboto text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4">
              Technical Stack
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
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
