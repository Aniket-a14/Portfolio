"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * The email address as a link that copies itself ("Letter roll" concept). Click: the address rolls up and out
 * while "Copied. Paste it anywhere." rolls in, then it rolls back. Without JavaScript, or when the browser
 * blocks the clipboard, it is a plain mailto: link and opens the visitor's mail app instead. Modified clicks
 * (new tab, etc.) are left alone. Reduced motion swaps the text without the roll.
 */
const MESSAGE = "Copied. Paste it anywhere.";

const Chars = ({ text }) =>
  [...text].map((ch, i) => (
    <span key={i} className="ce-ch" style={{ "--i": i }}>{ch === " " ? " " : ch}</span>
  ));

export default function CopyEmail({ email, className = "" }) {
  const [on, setOn] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`; // clipboard blocked: fall back to the mail app
      return;
    }
    setOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), 2200);
  };

  return (
    <>
      <a
        href={`mailto:${email}`}
        onClick={onClick}
        title="Copy to clipboard"
        data-copied={on ? "true" : "false"}
        className={`ce relative inline-block max-w-full overflow-hidden pb-[.12em] leading-[1.1] ${className}`}
      >
        <span className="sr-only">{email} (click to copy)</span>
        <span className="ce-line" aria-hidden="true"><Chars text={email} /></span>
        <span className="ce-line ce-msg absolute inset-x-0 top-0" aria-hidden="true"><Chars text={MESSAGE} /></span>
      </a>
      <span role="status" aria-live="polite" className="sr-only">{on ? "Email address copied" : ""}</span>
    </>
  );
}
