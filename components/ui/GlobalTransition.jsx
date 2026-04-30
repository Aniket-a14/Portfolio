"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const GlobalTransition = () => {
  const { 
    isTransitioning, 
    transitionText, 
    direction, 
    transitionType,
    isInitialLoadComplete, 
    setIsInitialLoadComplete 
  } = useTransitionContext();
  
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showInitial, setShowInitial] = useState(true);

  const greetings = [
    "• Hi", "• Hola", "• Bonjour", "• Hallo", "• Ciao", 
    "• Sawasdee", "• Aloha", "• Salaam", "• হ্যালো", "• Namaste"
  ];

  // Initial Loader Logic
  useEffect(() => {
    if (isInitialLoadComplete) {
       setShowInitial(false);
       return;
    }

    const hasVisited = sessionStorage.getItem("hasVisited");
    const delayBeforeGreetings = 500;
    let greetingInterval;

    const startGreetings = setTimeout(() => {
      let index = 0;
      const maxGreetings = hasVisited ? 1 : greetings.length;

      greetingInterval = setInterval(() => {
        index++;
        if (index < maxGreetings) {
          setGreetingIndex(index);
        } else {
          clearInterval(greetingInterval);
          if (!hasVisited) sessionStorage.setItem("hasVisited", "true");
          
          setShowInitial(false);
          setTimeout(() => {
              setIsInitialLoadComplete(true);
          }, 100);
        }
      }, 150);
    }, delayBeforeGreetings);

    return () => {
      clearTimeout(startGreetings);
      if (greetingInterval) clearInterval(greetingInterval);
    };
  }, [isInitialLoadComplete, setIsInitialLoadComplete, greetings.length]);

  return (
    <>
      <AnimatePresence mode="wait">
        {/* 1. INITIAL LOAD CURTAIN (Identical to legacy Loader) */}
        {showInitial && !isInitialLoadComplete && (
          <motion.div
            key="initial-loader"
            initial={{ y: 0 }}
            exit={{
              y: "-100%",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 flex flex-col justify-center items-center bg-black z-[9999] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-white text-5xl mb-4 font-medium font-roboto"
            >
              {greetings[greetingIndex]}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* 2. PAGE TRANSITION CURTAIN (Bi-Directional Context) */}
        {isTransitioning && isInitialLoadComplete && (
          <motion.div
            key="page-transition"
            initial={{ y: direction === 'down' ? "-100%" : "100%" }}
            animate={{ 
              y: "0%",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
            }}
            exit={{ 
              y: direction === 'down' ? "100%" : "-100%",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="fixed inset-0 flex flex-col justify-center items-center bg-black z-[9999] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              className={
                transitionType === 'project'
                  ? "text-white text-3xl md:text-4xl lg:text-5xl font-playfair font-normal uppercase tracking-normal"
                  : "text-white text-5xl mb-4 font-medium font-roboto"
              }
            >
              {transitionText}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalTransition;
