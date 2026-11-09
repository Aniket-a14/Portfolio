"use client";
import React, { useEffect } from "react";
import { useLenis } from "lenis/react";
import Navbar from "@/components/Navbar";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

// The page body is composed on the server (app/page.js) and arrives as children, so
// only the genuinely interactive sections ship client JavaScript. This shell owns the
// two things that need the browser: the persistent masthead and in-page scrolling.
const HEADER_OFFSET = 72;

export default function HomeClient({ children }) {
  const lenis = useLenis();
  const { isInitialLoadComplete } = useTransitionContext();

  useEffect(() => {
    const handleNav = (e) => {
      const target = e.detail.target;
      if (target === "home") { lenis?.scrollTo(0, { duration: 0 }); return; }
      const element = document.getElementById(target) || document.querySelector(`[data-section="${target}"]`);
      if (element) lenis?.scrollTo(element, { duration: 0, offset: -HEADER_OFFSET });
    };
    window.addEventListener("nav-scroll", handleNav);
    return () => window.removeEventListener("nav-scroll", handleNav);
  }, [lenis]);

  // Arriving from another page via /#section: the target does not exist until the
  // home page has mounted, so scroll once the opening sequence has finished.
  useEffect(() => {
    if (!isInitialLoadComplete || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    const t = setTimeout(() => window.dispatchEvent(new CustomEvent("nav-scroll", { detail: { target: id } })), 200);
    return () => clearTimeout(t);
  }, [isInitialLoadComplete]);

  return (
    <div className="relative min-h-screen w-full bg-ground">
      <Navbar />
      <main className={`transition-opacity duration-1000 ease-in-out ${isInitialLoadComplete ? "opacity-100" : "opacity-0"}`}>{children}</main>
    </div>
  );
}
