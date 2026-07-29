"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const ProjectRow = ({ project, index, isActive, onFocusRow, onBlurRow }) => {
  const { navigate } = useTransitionContext();
  const router = useRouter();
  const category = project.languages.slice(0, 2).join(" & ");

  // These rows are buttons, not links, so Next's automatic viewport prefetch
  // never fires. Hovering is a strong enough intent signal to warm the route.
  const prefetch = () => router.prefetch(`/project/${project.slug}`);

  return (
    <button
      data-project-id={project.id}
      onClick={() =>
        navigate(
          `/project/${project.slug}`,
          `• ${project.title}`,
          "down",
          "project"
        )
      }
      onMouseEnter={prefetch}
      // Pointer hover is resolved from geometry in the parent so that scrolling
      // updates it too; focus/blur stay here for keyboard users.
      onFocus={() => {
        prefetch();
        onFocusRow();
      }}
      onBlur={onBlurRow}
      className="block relative z-10 w-full text-left focus:outline-none"
    >
      <div
        className={`group relative ${index > 0 ? "border-t border-white/[0.1]" : ""}`}
      >
        <div
          className={`absolute inset-0 bg-white/[0.03] transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
        />

        <div className="relative z-20 flex items-center justify-between py-8 md:py-10 lg:py-12 px-2">
          <div className="flex items-center gap-4">
            <h3
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl transition-colors duration-500 ease-out leading-[1.1] tracking-tighter select-none uppercase ${isActive ? "text-white" : "text-white/[0.25]"}`}
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {project.title}
            </h3>
            <ArrowUpRight
              className={`size-6 sm:size-8 md:size-10 lg:size-12 transition-all duration-500 ease-out ${isActive ? "text-white opacity-100 translate-x-0" : "text-white/20 opacity-0 -translate-x-4"}`}
              strokeWidth={1}
            />
          </div>

          <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0 ml-8">
            <span
              className={`text-[13px] transition-colors duration-500 font-roboto tracking-[0.08em] ${isActive ? "text-white/50" : "text-white/25"}`}
            >
              {category}
            </span>
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-6 px-2 pb-12">
          <div className="relative w-full aspect-[1.4] bg-white/[0.03] overflow-hidden rounded-sm border border-white/5 shadow-2xl">
            <Image
              src={project.image}
              alt={project.title}
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 0px"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[2.5rem] font-medium tracking-tight leading-[0.95] text-white/90 font-roboto uppercase">
              {project.title}
            </h3>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center group-hover:border-white/20 transition-colors">
              <span className="text-[12px] text-white/40 font-roboto tracking-widest uppercase">
                {category}
              </span>
              <div className="size-8 rounded-full border border-white/10 flex items-center justify-center">
                <ArrowUpRight strokeWidth={1.5} className="size-4 text-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

const Project = ({ projects = [] }) => {
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const frameRef = useRef(0);
  const pendingRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 120, mass: 0.5 };
  const imgX = useSpring(x, springConfig);
  const imgY = useSpring(y, springConfig);

  /**
   * Pointer tracking and hover resolution.
   *
   * Both moving the pointer *and* scrolling underneath a stationary pointer
   * change which row is hovered, so both have to resolve it. Native
   * `mouseenter`/`mouseleave` only cover the first case — with Lenis driving
   * the scroll they do not re-fire as content moves under the cursor, which
   * left the preview latched to a row that had already scrolled away.
   *
   * The original code solved this with `document.elementFromPoint()` on every
   * move *and* every scroll event: a hit-test plus forced layout, unthrottled.
   * Instead, each row's band is measured once into container-relative
   * coordinates, and a frame only reads the container's own rect — one layout
   * read per frame, bounded, regardless of event rate.
   */
  const measureRows = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const base = container.getBoundingClientRect().top;
    rowsRef.current = Array.from(
      container.querySelectorAll("[data-project-id]")
    ).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        id: Number(el.dataset.projectId),
        top: rect.top - base,
        bottom: rect.bottom - base,
      };
    });
  }, []);

  const update = useCallback(() => {
    frameRef.current = 0;

    const point = pendingRef.current;
    const container = containerRef.current;
    if (!point || !container) return;

    // The preview is `fixed`, so it takes viewport coordinates directly and a
    // scroll cannot strand it behind the cursor.
    x.set(point.x);
    y.set(point.y);

    const rect = container.getBoundingClientRect();
    const withinX = point.x >= rect.left && point.x <= rect.right;
    const relativeY = point.y - rect.top;

    let next = null;
    if (withinX) {
      for (const row of rowsRef.current) {
        if (relativeY >= row.top && relativeY < row.bottom) {
          next = row.id;
          break;
        }
      }
    }

    // Functional form so an unchanged value bails out of re-rendering.
    setActiveProjectId((current) => (current === next ? current : next));
  }, [x, y]);

  useEffect(() => {
    // The floating preview is desktop-only; on touch layouts none of this
    // should exist at all.
    if (isMobile) return;

    const schedule = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(update);
    };

    const onMove = (event) => {
      pendingRef.current = { x: event.clientX, y: event.clientY };
      schedule();
    };

    // Only meaningful once the pointer's position is known.
    const onScroll = () => {
      if (pendingRef.current) schedule();
    };

    const onResize = () => {
      measureRows();
      schedule();
    };

    // The pointer can leave the window while still over a row (exiting via the
    // top edge, or switching windows), which would otherwise strand the preview
    // on screen.
    const onWindowLeave = () => {
      pendingRef.current = null;
      setActiveProjectId(null);
    };

    measureRows();

    // Row heights change when fonts land or the breakpoint shifts; re-measuring
    // on container resize keeps the cached bands honest without polling.
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measureRows)
        : null;
    if (observer && containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.documentElement.addEventListener("mouseleave", onWindowLeave);
    window.addEventListener("blur", onWindowLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.documentElement.removeEventListener("mouseleave", onWindowLeave);
      window.removeEventListener("blur", onWindowLeave);
      observer?.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [update, measureRows, isMobile]);

  const activeIndex = projects.findIndex((p) => p.id === activeProjectId);
  const hasActive = activeIndex >= 0;
  const visible = isMobile ? projects.slice(0, 2) : projects;

  return (
    <div
      ref={containerRef}
      className="w-full text-white mt-0 bg-transparent relative"
      id="projects"
    >
      <div className="pb-20 md:pb-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-white/10 pt-10 mb-16">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-white/40 font-roboto text-sm tracking-[0.2em] uppercase">
                Selected Work
              </p>
              <span className="text-white/20 font-roboto text-sm tracking-wider">
                ({String(projects.length).padStart(2, "0")})
              </span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight">
              Recent projects
            </h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto min-h-[400px] md:min-h-[600px]">
          {visible.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              isActive={activeProjectId === project.id}
              onFocusRow={() => setActiveProjectId(project.id)}
              onBlurRow={() => setActiveProjectId(null)}
            />
          ))}
        </div>
      </div>

      {!isMobile && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block"
          aria-hidden="true"
          animate={{
            opacity: hasActive ? 1 : 0,
            scale: hasActive ? 1 : 0,
          }}
          style={{ x: imgX, y: imgY }}
          transition={{
            opacity: { duration: 0.4 },
            scale: { type: "spring", stiffness: 150, damping: 15, mass: 1.2 },
          }}
        >
          <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
            <div className="relative w-[300px] h-[190px] lg:w-[360px] lg:h-[225px] rounded-sm overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-black/5">
              {/*
                A percentage `y` translate resolves against this element's own
                height, and this element is the full stack (N × the frame) — so
                one slide is 100/N percent, not 100%.
              */}
              <motion.div
                className="absolute left-0 top-0 w-full"
                animate={{
                  y: hasActive ? `${(-100 * activeIndex) / projects.length}%` : "0%",
                }}
                style={{ height: `${projects.length * 100}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {projects.map((project) => (
                  <div
                    key={`img-${project.id}`}
                    className="relative w-full"
                    style={{ height: `${100 / projects.length}%` }}
                  >
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="360px"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center pointer-events-none z-10"
              style={{
                backgroundColor: "rgba(26, 25, 25, 0.9)",
                backdropFilter: "blur(4px)",
              }}
              animate={{
                scale: hasActive ? 1 : 0,
                opacity: hasActive ? 1 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                delay: 0.15,
              }}
            >
              <span className="text-white text-[12px] font-medium font-roboto tracking-wide">
                View
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Project;
