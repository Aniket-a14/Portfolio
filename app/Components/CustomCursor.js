"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOnLight, setIsOnLight] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
        cursorRef.current.style.opacity = "1";
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setIsOnLight(!!el?.closest("[data-light-cursor]"));
    };

    const handleHover = () => setIsHovered(true);
    const handleUnhover = () => setIsHovered(false);

    window.addEventListener("mousemove", moveCursor);

    const updateHoverables = () => {
      const hoverables = document.querySelectorAll('a, button, [role="button"], input, textarea, .cursor-pointer');
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", handleHover);
        el.addEventListener("mouseleave", handleUnhover);
      });
    };

    updateHoverables();
    const observer = new MutationObserver(updateHoverables);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, []);

  const baseColor = isOnLight ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.9)";
  const hoverColor = isOnLight ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)";

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] hidden sm:block will-change-transform"
      style={{
        left: 0,
        top: 0,
        opacity: 0,
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 2.5 : 1,
          borderColor: isHovered ? hoverColor : baseColor,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.1 }}
        className="w-5 h-5 rounded-full border mix-blend-difference shadow-sm"
        style={{
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
};

export default CustomCursor;
