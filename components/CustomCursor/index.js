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
  const [isOnLight, setIsOnLight] = useState(false);

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
      setIsOnLight(Boolean(target.closest("[data-light-cursor]")));
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

  const color = isOnLight
    ? isHovered
      ? "rgba(0, 0, 0, 0.4)"
      : "rgba(0, 0, 0, 0.9)"
    : isHovered
      ? "rgba(255, 255, 255, 0.4)"
      : "rgba(255, 255, 255, 0.9)";

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] hidden opacity-0 pointer-events-none will-change-transform sm:block"
    >
      <div
        className="h-5 w-5 rounded-full border bg-transparent shadow-sm mix-blend-difference"
        style={{
          borderColor: color,
          transform: `scale(${isHovered ? 2.5 : 1})`,
          transition:
            "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 260ms ease",
        }}
      />
    </div>
  );
};

export default CustomCursor;
