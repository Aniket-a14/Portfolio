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

  const backgroundColor = useTransform(
    scrollY,
    [vh * 0.1, vh * 0.4],
    ["#ffffff", "#040407"]
  );

  const textColor = useTransform(
    scrollY,
    [vh * 0.1, vh * 0.4],
    ["#000000", "#ffffff"]
  );

  useMotionValueEvent(backgroundColor, "change", (latest) => {
    if (typeof window !== "undefined") {
      document.documentElement.style.backgroundColor = latest;
      document.body.style.backgroundColor = latest;
    }
  });

  const handleLoaderComplete = useCallback(() => {
    startTransition(() => setShowContent(true));
  }, []);

  return (
    <div className="relative transition-colors duration-1000 min-h-[100dvh]">
      {!showContent && <Loader onComplete={handleLoaderComplete} aria-hidden="true" role="status" />}

      <motion.div 
        style={{ backgroundColor, color: textColor }}
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <div className="pt-[4rem] h-full overflow-hidden">
          <Body />
        </div>
      </motion.div>

      <div className={`relative z-10 w-full pointer-events-none transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
        <div className="h-[100vh]" />

        <div className="bg-[#040407] min-h-[300px] pointer-events-auto" role="region" aria-labelledby="about-section">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <About />
          </Suspense>
        </div>

        <div className="overflow-auto bg-[#040407] min-h-[300px] pointer-events-auto" role="region" aria-labelledby="languages-section">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Languages />
          </Suspense>
        </div>

        <div className="bg-[#040407] transition-colors duration-1000 min-h-[300px] pointer-events-auto" role="region" aria-labelledby="project-section">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Project />
          </Suspense>
        </div>

        <div className="bg-[#040407] min-h-[800px] pointer-events-auto">
          <Suspense fallback={<MiniLoader aria-hidden="true" />}>
            <Comments />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
