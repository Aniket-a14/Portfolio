"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useRef,
} from "react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";
import { useLenis } from "lenis/react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MiniLoader from "@/components/Miniloader";
import Comments from "@/components/Comments";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, animate, AnimatePresence } from "framer-motion";

const About = lazy(() => import("@/components/About"));
const Project = lazy(() => import("@/components/Projects"));
const initialProjects = [
  { title: "SRA" },
  { title: "Wizard-w1" },
  { title: "AI Friend" }
];

const App = () => {
  const lenis = useLenis();
  const { isInitialLoadComplete } = useTransitionContext();
  const timeoutRef = useRef(null);

  const { scrollY } = useScroll();

  const [vh, setVh] = useState(0);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const heroOpacity = useTransform(
    scrollY,
    [0, vh || 1000],
    [1, 0]
  );

  const heroScale = useTransform(
    scrollY,
    [0, vh || 1000],
    [1, 1.1]
  );

  const textColor = useTransform(
    scrollY,
    [vh * 0.2, vh * 0.5],
    ["#ffffff", "#ffffff"]
  );


  const entranceOpacity = useMotionValue(0);

  useEffect(() => {
    if (isInitialLoadComplete) {
      animate(entranceOpacity, 1, {
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1]
      });

      // BACKEND WARMING: Proactively trigger Next.js to compile project pages
      initialProjects.forEach(p => {
        const slug = p.title.toLowerCase().replace(/ /g, "-");
        fetch(`/project/${slug}`, { priority: 'low' }).catch(() => {});
      });
    }
  }, [isInitialLoadComplete, entranceOpacity]);

  useEffect(() => {
    const handleNav = (e) => {
      const target = e.detail.target;
      if (target === 'home') {
        lenis?.scrollTo(0, { duration: 0 });
        return;
      }

      const element = document.getElementById(target) || document.querySelector(`[data-section="${target}"]`);
      if (element) {
        lenis?.scrollTo(element, { 
          duration: 0,
          offset: -80 
        });
      }
    };

    window.addEventListener('nav-scroll', handleNav);
    return () => window.removeEventListener('nav-scroll', handleNav);
  }, [lenis]);

  const combinedHeroOpacity = useTransform(
    [heroOpacity, entranceOpacity],
    ([s, e]) => s * e
  );

  const combinedHeroScale = useTransform(
    [heroScale, entranceOpacity],
    ([s, e]) => s + (1 - e) * 0.05
  );

  return (
    <div className="relative min-h-screen w-full bg-black">

      <motion.div
        style={{
          opacity: combinedHeroOpacity,
          scale: combinedHeroScale,
          color: textColor
        }}
        className={`fixed inset-0 z-0`}
      >
        <motion.div className="absolute inset-0 z-[-1] bg-black">
          <Image
            src="/bg_logo.png"
            alt="Hero Background"
            fill
            priority
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent w-full md:w-[65%]" />
        </motion.div>

        <motion.div
          style={{ opacity: entranceOpacity }}
          className="absolute top-0 left-0 w-full z-50"
        >
          <Navbar />
        </motion.div>
        <motion.div
          style={{ opacity: entranceOpacity }}
          className="pt-[4rem] h-full overflow-hidden relative z-10"
        >
          <Hero />
        </motion.div>
      </motion.div>

      <div className={`relative z-10 w-full pointer-events-none transition-opacity duration-1000 ease-in-out ${isInitialLoadComplete ? "opacity-100" : "opacity-0"}`}>
        <div className="h-[100dvh]" />

        <div className="bg-black pb-24 pointer-events-auto" role="region" id="about">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <About />
          </Suspense>
        </div>

        <div id="projects" className="bg-black transition-colors duration-1000 min-h-fit pointer-events-auto relative" role="region" aria-labelledby="project-section">

          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Project />
          </Suspense>
        </div>

        <div className="bg-black pointer-events-auto relative" data-section="testimonials">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Comments />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
