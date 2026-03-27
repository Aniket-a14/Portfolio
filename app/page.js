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
import Navbar from "./Components/Navbar";
import Body from "./Components/Body";
import MiniLoader from "../components/ui/Miniloader";
import Comments from "./Components/Comments";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const About = lazy(() => import("./Components/About"));
const Languages = lazy(() => import("./Components/Languages"));
const Project = lazy(() => import("./Components/Project"));

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


  const textColor = useTransform(
    scrollY,
    [vh * 0.2, vh * 0.5],
    ["#ffffff", "#ffffff"]
  );


  const handleLoaderComplete = useCallback(() => {
    startTransition(() => setShowContent(true));
  }, []);

  return (
    <div className="relative transition-colors duration-1000 min-h-[100dvh] overflow-x-hidden w-full max-w-[100vw] bg-[#e8e6e1]">
      {!showContent && <Loader onComplete={handleLoaderComplete} aria-hidden="true" role="status" />}

      <motion.div
        style={{ color: textColor }}
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}
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

        <div className="absolute top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <div className="pt-[4rem] h-full overflow-hidden relative z-10">
          <Body />
        </div>
      </motion.div>

      <div className={`relative z-10 w-full pointer-events-none transition-opacity duration-1000 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}>
        <div className="h-[100vh]" />

        <div className="bg-black min-h-fit pointer-events-auto" role="region" aria-labelledby="about-section">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <About />
          </Suspense>
        </div>

        <div className="overflow-auto bg-black min-h-fit pointer-events-auto" role="region" aria-labelledby="languages-section">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Languages />
          </Suspense>
        </div>

        <div className="bg-black transition-colors duration-1000 min-h-fit pointer-events-auto" role="region" aria-labelledby="project-section">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Project />
          </Suspense>
        </div>

        <div className="bg-black min-h-fit pointer-events-auto">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Comments />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
