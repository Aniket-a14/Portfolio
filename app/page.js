"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useTransition,
  useRef,
} from "react";
import Loader from "./Loader";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import MiniLoader from "@/components/ui/Miniloader";
import Comments from "@/components/sections/Comments";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, animate, AnimatePresence } from "framer-motion";

const About = lazy(() => import("@/components/sections/About"));
const Languages = lazy(() => import("@/components/sections/Languages"));
const Project = lazy(() => import("@/components/sections/Projects"));

const App = () => {
  const [showContent, setShowContent] = useState(false);
  const [isPending, startTransition] = useTransition();
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
    if (showContent) {
      animate(entranceOpacity, 1, { 
        duration: 1.8, 
        ease: [0.22, 1, 0.36, 1] 
      });
    }
  }, [showContent, entranceOpacity]);

  const combinedHeroOpacity = useTransform(
    [heroOpacity, entranceOpacity],
    ([s, e]) => s * e
  );

  const combinedHeroScale = useTransform(
    [heroScale, entranceOpacity],
    ([s, e]) => s + (1 - e) * 0.05
  );

  const handleLoaderComplete = useCallback(() => {
    startTransition(() => {
      setShowContent(true);
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black">

      <AnimatePresence mode="wait">
        {!showContent && (
          <Loader 
            key="loader"
            onComplete={handleLoaderComplete} 
            aria-hidden="true" 
            role="status" 
          />
        )}
      </AnimatePresence>

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

      <div className={`relative z-10 w-full pointer-events-none transition-opacity duration-1000 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}>
        <div className="h-[100dvh]" />

        <div className="bg-black py-24 pointer-events-auto" role="region" id="about">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <About />
          </Suspense>
        </div>

        <div className="bg-black pointer-events-auto relative" role="region" id="languages-section">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Languages />
          </Suspense>
        </div>

        <div id="projects" className="bg-black transition-colors duration-1000 min-h-fit pointer-events-auto relative" role="region" aria-labelledby="project-section">

          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Project />
          </Suspense>
        </div>

        <div className="bg-black pointer-events-auto relative">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Comments />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
