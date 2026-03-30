"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { profileData } from "@/lib/data";

const ICON_MAPPING = {
  "C/C++": "cplusplus",
  "Python": "python",
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "React": "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  "Fast API": "fastapi",
  "Express.js": "express",
  "MongoDB": "mongodb",
  "Postgres SQL": "postgresql",
  "MySQL": "mysql",
  "Git": "git",
  "GitHub": "github",
  "Tailwind CSS": "tailwindcss",
  "Terraform": "terraform",
  "Vercel": "vercel",
  "GitHub Actions": "githubactions",
  "Postman": "postman",
  "Linux": "linux",
  "Docker": "docker",
  "Data Structures & Algorithm": "blueprint",
  "OOP": "blueprint",
  "System Design": "blueprint",
  "API Development": "blueprint",
  "Computer Networks": "blueprint",
  "CI/CD Pipelines": "blueprint"
};

const SkillItem = ({ skill, index }) => {
  const slug = ICON_MAPPING[skill] || skill.toLowerCase().replace(".", "dot").replace(" ", "");
  const needsFilter = ["nextdotjs", "express", "github", "git", "openjdk", "vercel"].includes(slug);

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
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-playfair ${isActive ? "italic font-black" : "font-normal"}`}
        >
          {name}
        </span>
      </div>
    </div>
  </button>
);

const Languages = () => {
  const [activeCategory, setActiveCategory] = useState("Languages");
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    { name: "Languages", skills: profileData.skills.languages },
    { name: "Core", skills: profileData.skills.core },
    { name: "Development", skills: profileData.skills.development },
    { name: "Databases", skills: profileData.skills.databases },
    { name: "Cloud & DevOps", skills: profileData.skills.cloudAndDevops },
    { name: "Tools", skills: profileData.skills.tools },
  ];

  useEffect(() => {
    if (isMobile) return; 

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const step = 1 / categories.length;
      const index = Math.min(Math.floor(latest / step), categories.length - 1);
      setActiveCategory(categories[index].name);
    });
    return () => unsubscribe();
  }, [scrollYProgress, categories, isMobile]);

  const activeSkills = categories.find(c => c.name === activeCategory)?.skills || [];
  const activeCategoryIndex = categories.findIndex(c => c.name === activeCategory);

  return (
    <div
      ref={scrollRef}
      className={`relative w-full ${isMobile ? "h-auto" : "h-[600vh]"} bg-black scroll-mt-20`}
      id="languages"
    >
      <div className={`${isMobile ? "relative" : "sticky top-0 left-0 h-screen"} w-full flex flex-col items-center overflow-hidden z-20`}>
        <div
          ref={containerRef}
          className="w-full max-w-7xl px-6 md:px-12 relative h-full flex flex-col pt-10 md:pt-12 md:pb-12"
        >
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
                    if (isMobile) {
                      setActiveCategory(cat.name);
                    } else if (lenis && scrollRef.current) {
                      const section = scrollRef.current;
                      const targetProgress = (idx / categories.length) + 0.05;
                      const scrollPos = section.offsetTop + (targetProgress * section.offsetHeight);
                      
                      lenis.scrollTo(scrollPos, {
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                      });
                    }
                  }}
                />
              ))}

              {/* Mobile Arrow Carousel */}
              {isMobile && (
                <div className="flex lg:hidden items-center justify-between w-full mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (activeCategoryIndex > 0) {
                        setActiveCategory(categories[activeCategoryIndex - 1].name);
                      }
                    }}
                    disabled={activeCategoryIndex === 0}
                    className={`size-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm transition-all duration-300 border border-white/5 active:scale-95 ${
                      activeCategoryIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 active:bg-white/20"
                    }`}
                    aria-label="Previous Category"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M15 19L8 12L15 5"/></svg>
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="font-roboto text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">
                      0{activeCategoryIndex + 1} / 0{categories.length}
                    </span>
                    <span className="text-white font-playfair italic font-black text-lg md:text-xl">
                      {activeCategory}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (activeCategoryIndex < categories.length - 1) {
                        setActiveCategory(categories[activeCategoryIndex + 1].name);
                      }
                    }}
                    disabled={activeCategoryIndex === categories.length - 1}
                    className={`size-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm transition-all duration-300 border border-white/5 active:scale-95 ${
                      activeCategoryIndex === categories.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 active:bg-white/20"
                    }`}
                    aria-label="Next Category"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M9 19L16 12L9 5"/></svg>
                  </button>
                </div>
              )}
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
