"use client";

import React, { useEffect, useRef, useState } from "react";

/** Fades/raises its children in once, the first time they enter the viewport. */
export function Reveal({ as: Tag = "div", delay = 0, y, className = "", style, children, ...rest }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`rv ${on ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms`, ...(y ? { "--y": y } : null), ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Words slide up out of a mask. The real string stays in `aria-label` and the
 * visual spans are `aria-hidden`, so assistive tech reads one clean heading.
 */
export function Words({ text, on = true, step = 40, base = 0, className = "" }) {
  const words = String(text).split(" ");
  return (
    <span className={`words ${on ? "in" : ""} ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className="wi" style={{ "--i": i, "--st": `${step}ms`, "--b": `${base}ms` }}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </span>
  );
}

/** Runs `Words` when its container scrolls into view instead of on mount. */
export function WordsInView({ text, ...props }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <span ref={ref}><Words text={text} on={on} {...props} /></span>;
}
