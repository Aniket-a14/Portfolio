"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const BlogEntry = ({ blog, index, onFocusRow, onBlurRow, isActive }) => {
  return (
    <a
      href={blog.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative z-10"
      data-blog-index={index}
      // Pointer hover is resolved from geometry in the parent so that scrolling
      // updates it too; focus/blur stay here for keyboard users.
      onFocus={onFocusRow}
      onBlur={onBlurRow}
    >
      <div className="group relative">
        <div className={`absolute inset-0 bg-white/[0.025] transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`} />

        {/* Desktop Layout (hidden on mobile) */}
        <div className="hidden md:block relative z-20 py-7 md:py-8 lg:py-10 px-2 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 lg:gap-5 lg:w-44 shrink-0">
              <span className="font-roboto text-xs tabular-nums tracking-wider transition-colors duration-500 text-white/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="w-1 h-1 rounded-full transition-colors duration-500 bg-white/20" />
              <span className="font-roboto text-[10px] tracking-[0.15em] uppercase transition-colors duration-500 text-white/40">
                {new Date(blog.pubDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h2
                className="text-2xl sm:text-3xl md:text-[2.25rem] lg:text-[2.5rem] leading-[1.15] tracking-tight transition-colors duration-500 mb-2 text-white/90"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {blog.title}
              </h2>
              <p className="font-roboto text-xs font-light leading-relaxed max-w-xl transition-colors duration-500 line-clamp-1 text-white/30">
                {blog.snippet}
              </p>
            </div>

            <div className="hidden lg:flex items-center shrink-0">
              <ArrowUpRight
                className={`size-5 transition-all duration-500 ease-out ${isActive ? "text-white opacity-100 translate-x-0" : "text-white/20 opacity-0 -translate-x-4"}`}
                strokeWidth={1}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout (card style) */}
        <div className="md:hidden flex flex-col gap-6 px-2 pb-12 pt-6">
          <div className="relative w-full aspect-[1.4] bg-white/[0.03] overflow-hidden rounded-sm border border-white/5 shadow-2xl">
            {blog.thumbnail ? (
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.01]">
                <span className="text-white/5 font-playfair text-4xl uppercase tracking-widest">Medium</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[2.5rem] font-medium tracking-tight leading-[0.95] text-white/90 font-roboto uppercase">
              {blog.title}
            </h3>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-white/40 font-roboto tracking-widest uppercase">
                  {new Date(blog.pubDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="size-8 rounded-full border border-white/10 flex items-center justify-center">
                <ArrowUpRight strokeWidth={1.5} className="size-4 text-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

const BlogSkeleton = () => (
  <div className="animate-pulse max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-32">
    <div className="h-3 w-24 bg-white/5 rounded-full mb-8" />
    <div className="h-12 w-72 bg-white/5 rounded-sm mb-4" />
    <div className="h-4 w-96 bg-white/[0.03] rounded-full mb-16" />
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="py-8 border-b border-white/[0.04]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 w-44 shrink-0">
            <div className="h-3 w-5 bg-white/5 rounded" />
            <div className="h-3 w-20 bg-white/[0.03] rounded" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-8 w-3/4 bg-white/5 rounded" />
            <div className="h-3 w-1/2 bg-white/[0.03] rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function BlogsClient() {
  const { navigate } = useTransitionContext();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);
  const rowsRef = useRef([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 18, stiffness: 120, mass: 0.5 };
  const imgX = useSpring(x, springConfig);
  const imgY = useSpring(y, springConfig);

  /**
   * Pointer tracking and hover resolution — see the matching comment in
   * `components/Projects`. Moving the pointer and scrolling underneath a
   * stationary pointer both change which row is hovered, so both resolve it
   * from cached row bands rather than from `document.elementFromPoint()` on
   * every event. One layout read per frame, whatever the event rate.
   */
  const measureRows = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const base = container.getBoundingClientRect().top;
    rowsRef.current = Array.from(
      container.querySelectorAll("[data-blog-index]")
    ).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        index: Number(el.dataset.blogIndex),
        top: rect.top - base,
        bottom: rect.bottom - base,
      };
    });
  }, []);

  const update = useCallback(() => {
    frameRef.current = 0;

    const container = containerRef.current;
    if (!container) return;

    const point = mousePos.current;
    // The preview is `fixed`, so viewport coordinates go straight through.
    x.set(point.x);
    y.set(point.y);

    const rect = container.getBoundingClientRect();
    const withinX = point.x >= rect.left && point.x <= rect.right;
    const relativeY = point.y - rect.top;

    let next = null;
    if (withinX) {
      for (const row of rowsRef.current) {
        if (relativeY >= row.top && relativeY < row.bottom) {
          next = row.index;
          break;
        }
      }
    }

    setActiveIndex((current) => (current === next ? current : next));
  }, [x, y]);

  useEffect(() => {
    const schedule = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(update);
    };

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const handleScroll = () => schedule();

    const handleResize = () => {
      measureRows();
      schedule();
    };

    // Pointer leaving the window while still over a row would otherwise strand
    // the preview on screen.
    const handleWindowLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
      setActiveIndex(null);
    };

    measureRows();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measureRows)
        : null;
    if (observer && containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    document.documentElement.addEventListener("mouseleave", handleWindowLeave);
    window.addEventListener("blur", handleWindowLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.documentElement.removeEventListener("mouseleave", handleWindowLeave);
      window.removeEventListener("blur", handleWindowLeave);
      observer?.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [update, measureRows]);

  // Rows arrive asynchronously from the feed, so their bands must be measured
  // once they exist, not only on mount.
  useEffect(() => {
    measureRows();
  }, [blogs, measureRows]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <BlogSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-roboto text-sm tracking-wider uppercase">
          Unable to load articles
        </p>
      </div>
    );
  }

  const activePost = activeIndex !== null ? blogs[activeIndex] : null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <main className="pt-12 pb-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto mb-8">
          <button
            onClick={() => navigate("/", "• Home", "up")}
            className="text-white/40 hover:text-white transition-colors font-roboto text-sm uppercase tracking-widest flex items-center gap-2 w-fit focus:outline-none"
          >
            <ArrowUpRight size={16} className="-rotate-90" />
            Back to Home
          </button>
        </div>

        <header className="max-w-6xl mx-auto mb-6 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-baseline justify-between mb-6">
              <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl tracking-tight text-white/90 leading-[1.1] font-normal">
                From my desk
              </h1>
              <span className="text-white/15 font-roboto text-xs tracking-wider hidden sm:block">
                ({String(blogs.length).padStart(2, "0")})
              </span>
            </div>
            <p className="text-white/30 font-roboto text-sm md:text-base font-light leading-relaxed max-w-2xl">
              I write about the things I build, break, and learn along the way,  from training neural networks
              at 3 AM to designing interfaces that feel alive. These are my notes from the frontier of
              code, creativity, and everything in between.
            </p>
          </motion.div>
        </header>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-px bg-white/20 origin-left"
          />
        </div>

        <div ref={containerRef} className="max-w-6xl mx-auto relative">
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.4 + index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <BlogEntry
                blog={blog}
                index={index}
                isActive={activeIndex === index}
                onFocusRow={() => setActiveIndex(index)}
                onBlurRow={() => setActiveIndex(null)}
              />
            </motion.div>
          ))}

          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block"
            animate={{
              opacity: activePost ? 1 : 0,
              scale: activePost ? 1 : 0,
            }}
            style={{
              x: imgX,
              y: imgY,
            }}
            transition={{
              opacity: { duration: 0.4 },
              scale: {
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 1.2,
              },
            }}
          >
            <div
              className="relative"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <div className="relative w-[280px] h-[175px] lg:w-[320px] lg:h-[200px] rounded-sm overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-black/5">
                <motion.div
                  className="absolute inset-0 w-full"
                  animate={{
                    y:
                      activeIndex !== null && activeIndex >= 0
                        ? -1 *
                        activeIndex *
                        (typeof window !== "undefined" &&
                          window.innerWidth >= 1024
                          ? 200
                          : 175)
                        : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {blogs.map((blog, i) => (
                    <div
                      key={`img-${i}`}
                      className="relative w-full h-[175px] lg:h-[200px]"
                    >
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="320px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-white/[0.03] flex items-center justify-center">
                          <span className="text-white/10 font-playfair text-2xl uppercase tracking-widest">
                            Medium
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  ))}
                </motion.div>
              </div>
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center pointer-events-none z-10"
                style={{
                  backgroundColor: "rgba(26, 25, 25, 0.9)",
                  backdropFilter: "blur(4px)",
                }}
                animate={{
                  scale: activePost ? 1 : 0,
                  opacity: activePost ? 1 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  delay: 0.15,
                }}
              >
                <span className="text-white text-[11px] font-medium font-roboto tracking-wide">
                  Read
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-6xl mx-auto mt-20 flex justify-center"
        >
          <a
            href="https://medium.com/@aniketsahaworkspace"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-white/30 hover:text-white transition-all duration-500 font-roboto text-[10px] uppercase tracking-[0.3em] py-4 px-8 border border-white/[0.08] rounded-full hover:bg-white/[0.03] hover:border-white/[0.15]"
          >
            Follow on Medium
            <ArrowUpRight
              className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500"
              strokeWidth={1.5}
            />
          </a>
        </motion.div>
      </main>
    </div>
  );
}
