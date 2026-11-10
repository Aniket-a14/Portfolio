"use client";

import React, { useEffect, useRef, useState } from "react";

const HOVERABLE = 'a, button, [role="button"], input, textarea, .cursor-pointer';

/**
 * Custom cursor.
 *
 * The previous implementation did three expensive things on every pointer
 * move: `document.elementFromPoint()` (a forced synchronous layout), an
 * unthrottled style write, and — worst of all — a `MutationObserver` on the
 * whole body that re-ran `querySelectorAll` over the entire document and
 * re-attached listeners on every mutation. With Framer Motion animating, that
 * fired continuously and leaked duplicate listeners.
 *
 * It is now one rAF-throttled transform write plus delegated pointer events,
 * and it does not mount at all on touch devices.
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const pointRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [onDark, setOnDark] = useState(false); // over a black stage (the trailer): the ink dot would vanish, so it turns paper-coloured

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const apply = () => setEnabled(fine.matches);
    apply();
    fine.addEventListener("change", apply);
    return () => fine.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const paint = () => {
      frameRef.current = 0;
      const node = dotRef.current;
      if (!node) return;
      const { x, y } = pointRef.current;
      node.style.transform = `translate3d(${x - 10}px, ${y - 10}px, 0)`;
      node.style.opacity = "1";
    };

    const onMove = (event) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(paint);
    };

    // Delegated: `mouseover` bubbles, so one listener covers every element that
    // will ever exist, including ones added later.
    const onOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      setIsHovered(Boolean(target.closest(HOVERABLE)));
      setOnDark(Boolean(target.closest("[data-cursor-dark]")));
    };

    const onLeave = () => {
      const node = dotRef.current;
      if (node) node.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [enabled]);

  if (!enabled) return null;

  // Pinhole: a small ink dot; over anything interactive it becomes an asterisk.
  // The system cursor is hidden only for fine pointers (globals.css), and keyboard
  // focus rings are untouched.
  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] hidden opacity-0 pointer-events-none will-change-transform sm:block"
    >
      <div className="relative grid size-5 place-items-center">
        <span
          className={`absolute rounded-full shadow-[0_0_0_1px_rgba(0,0,0,.35)] transition-[width,height,opacity] duration-200 ease-[cubic-bezier(.22,1,.36,1)] ${onDark ? "bg-[#ebe7dd]" : "bg-ink"}`}
          style={{ width: isHovered ? 0 : 8, height: isHovered ? 0 : 8, opacity: isHovered ? 0 : 1 }}
        />
        <span
          className="absolute text-[26px] leading-none text-vermilion-bright transition-[opacity,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ opacity: isHovered ? 1 : 0, transform: `scale(${isHovered ? 1 : 0.4}) rotate(${isHovered ? 0 : -90}deg)` }}
        >
          ✶
        </span>
      </div>
    </div>
  );
};

export default CustomCursor;
