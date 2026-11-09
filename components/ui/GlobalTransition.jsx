"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const GREETINGS = ["Hi", "Hola", "Bonjour", "Hallo", "Ciao", "Sawasdee", "Aloha", "Salaam", "হ্যালো", "Namaste"];
const GREETING_LANG = { 8: "bn", 9: "hi" };
const EASE = [0.76, 0, 0.24, 1];

// What the opening sequence waits for besides its own timing: the web fonts and the
// hero photograph. Without this the sheet could lift onto a half-rendered page.
const HERO_IMAGE = "/portrait-hero-bw.jpg";
function useAssetsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let dead = false;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const img = new Image();
    img.src = HERO_IMAGE;
    const decoded = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    // Never block forever on a slow network: give assets 4 s, then proceed.
    const cap = new Promise((r) => setTimeout(r, 4000));
    Promise.race([Promise.all([fonts, decoded]), cap]).then(() => !dead && setReady(true));
    return () => { dead = true; };
  }, []);
  return ready;
}

const GlobalTransition = () => {
  const { isTransitioning, transitionText, direction, isInitialLoadComplete, setIsInitialLoadComplete } = useTransitionContext();
  const [index, setIndex] = useState(0);
  const [cycleDone, setCycleDone] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const assetsReady = useAssetsReady();

  // Greeting cycle: ten languages on a first visit (the idea this site already had),
  // one word on repeat visits so returning visitors are not made to wait.
  useEffect(() => {
    if (isInitialLoadComplete) { setShowInitial(false); return; }
    const visited = typeof window !== "undefined" && sessionStorage.getItem("hasVisited");
    const total = visited ? 1 : GREETINGS.length;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i < total) setIndex(i);
      else { clearInterval(id); if (!visited) sessionStorage.setItem("hasVisited", "true"); setCycleDone(true); }
    }, visited ? 350 : 210);
    return () => clearInterval(id);
  }, [isInitialLoadComplete]);

  useEffect(() => {
    if (!cycleDone || !assetsReady || isInitialLoadComplete) return;
    const t = setTimeout(() => { setShowInitial(false); setTimeout(() => setIsInitialLoadComplete(true), 150); }, 250);
    return () => clearTimeout(t);
  }, [cycleDone, assetsReady, isInitialLoadComplete, setIsInitialLoadComplete]);

  const progress = Math.round(((index + 1) / GREETINGS.length) * 100);
  const label = String(transitionText || "").replace(/^[•\s]+/, "");

  return (
    <>
      <AnimatePresence>
        {showInitial && !isInitialLoadComplete && (
          <motion.div
            key="folio-loader"
            role="status"
            aria-live="polite"
            aria-label="Loading portfolio"
            initial={{ y: 0 }}
            exit={{ y: "-104%", borderBottomLeftRadius: "50% 8vh", borderBottomRightRadius: "50% 8vh", transition: { duration: 1.1, ease: EASE } }}
            className="fixed inset-0 z-[9999] flex flex-col justify-between bg-ground px-[4vw] py-[4vh] text-ink"
          >
            <div className="folio flex justify-between text-ink/70">
              <span>Folio</span>
              <span>{String(index + 1).padStart(2, "0")} / {String(GREETINGS.length).padStart(2, "0")}</span>
            </div>
            <div key={index} lang={GREETING_LANG[index] || "en"} className="display select-none text-center text-[clamp(5rem,20vw,19rem)] font-light italic leading-[0.9] animate-[folioIn_.26s_cubic-bezier(.22,1,.36,1)_both]">
              {GREETINGS[index]}<span className="text-vermilion-bright">.</span>
            </div>
            <div className="folio flex items-center justify-between text-ink/70">
              <span>Aniket Saha — Portfolio</span>
              <span aria-hidden="true" className="block h-px w-[min(28vw,260px)] bg-ink/20">
                <i className="block h-full origin-left bg-ink transition-transform duration-200" style={{ transform: `scaleX(${progress / 100})` }} />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Turn: a paper sheet with a curved edge travels through the viewport. */}
      <AnimatePresence>
        {isTransitioning && isInitialLoadComplete && (
          <motion.div
            key="page-turn"
            aria-hidden="true"
            initial={{ y: direction === "down" ? "104%" : "-104%", borderTopLeftRadius: "50% 8vh", borderTopRightRadius: "50% 8vh" }}
            animate={{ y: "0%", borderTopLeftRadius: "0% 0vh", borderTopRightRadius: "0% 0vh", transition: { duration: 0.8, ease: EASE } }}
            exit={{ y: direction === "down" ? "-104%" : "104%", borderBottomLeftRadius: "50% 8vh", borderBottomRightRadius: "50% 8vh", transition: { duration: 0.8, ease: EASE } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-ink text-ground dark:bg-[#2c221b] dark:text-ink"
          >
            <span className="folio text-ground/60 dark:text-ink/60">Folio</span>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="display px-6 text-center text-[clamp(3rem,12vw,9rem)] font-light italic leading-none text-vermilion-bright"
            >
              {label}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalTransition;
