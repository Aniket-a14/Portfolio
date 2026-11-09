"use client";

import { useEffect, useRef } from "react";

/** Horizontal scroller that opens at its right edge, so a time-series shows the latest data first. */
export default function ScrollEnd({ children, className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
