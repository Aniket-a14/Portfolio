"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, X } from "lucide-react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const MobileToast = () => {
  const { isInitialLoadComplete } = useTransitionContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const hasShownFound = sessionStorage.getItem("mobileToastShown");

    if (isMobile && !hasShownFound && isInitialLoadComplete) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem("mobileToastShown", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isInitialLoadComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -80, x: "-50%", opacity: 0, scale: 0.9 }}
          animate={{ y: 0, x: "-50%", opacity: 1, scale: 1 }}
          exit={{ y: -80, x: "-50%", opacity: 0, scale: 0.9 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 0.8
          }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[10001] w-fit max-w-[90vw] md:hidden"
        >
          <div className="p-1 flex items-center bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {/* High-Contrast Icon Anchor */}
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 m-0.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Laptop size={16} className="text-black" strokeWidth={2.5} />
            </div>

            {/* Content Hub */}
            <div className="flex flex-col px-4 min-w-[140px]">
              <h4 className="font-playfair italic text-white/95 text-[15px] leading-tight tracking-tight">
                Refined viewing
              </h4>
              <p className="font-mono text-[8.5px] text-white/30 uppercase tracking-[0.05em] -mt-0.5">
                Laptop recommended
              </p>
            </div>

            {/* Dismissal Section */}
            <div className="h-6 w-px bg-white/10 mx-1" />
            <button
              onClick={() => setIsVisible(false)}
              className="w-9 h-9 flex items-center justify-center group active:scale-95 transition-transform"
              aria-label="Dismiss notification"
            >
              <X size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
            </button>
          </div>
          
          {/* Edge Shimmer Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileToast;
