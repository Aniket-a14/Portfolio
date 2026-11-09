"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileData } from "@/lib/data";
import ProfileSheet from "@/components/ProfileSheet";
import ThemeToggle from "@/components/ThemeToggle";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

// `href` without a leading slash is a section on the home page; with one it is a route.
const navLinks = [
  { name: "About", href: "about" },
  { name: "Projects", href: "projects" },
  { name: "Experience", href: "experience" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];
const SPY_IDS = ["hero", "about", "skills", "projects", "experience", "blogs", "testimonials", "contact"];
const SPY_TO_NAV = { hero: null, about: "about", skills: "about", projects: "projects", experience: "experience", blogs: "blogs", testimonials: null, contact: null };

const pad = (n) => String(n).padStart(2, "0");
const realHref = (href) => (href.startsWith("/") ? href : `/#${href}`);

const Navbar = () => {
  const { navigate } = useTransitionContext();
  const pathname = usePathname();
  const lenis = useLenis();
  const [isOpen, setIsOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [slim, setSlim] = useState(false);
  const [spy, setSpy] = useState(null);
  const [date, setDate] = useState("");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }));
  }, []);

  useEffect(() => {
    const on = () => setSlim(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Scroll-spy: only meaningful on the home page where the sections exist.
  useEffect(() => {
    if (pathname !== "/") { setSpy(null); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSpy(SPY_TO_NAV[e.target.id] ?? null)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SPY_IDS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (isOpen || isSheetOpen) lenis?.stop(); else lenis?.start();
    return () => lenis?.start();
  }, [isOpen, isSheetOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Real anchors keep middle-click / open-in-new-tab / crawlability; a plain left
  // click is intercepted so the page-turn transition still runs.
  const onNav = (e, link, afterClose) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const text = `• ${link.name.toUpperCase()}`;
    if (afterClose) { setIsOpen(false); setTimeout(() => navigate(link.href, text, "down"), 350); }
    else navigate(link.href, text, "down");
  };

  const isActive = (link) => (link.href.startsWith("/") ? pathname === link.href : pathname === "/" && spy === link.href);

  const indexButton = (cls) => (
    <button
      onClick={() => setIsOpen((o) => !o)}
      aria-expanded={isOpen}
      aria-controls="mobile-index"
      className={`folio border border-ink px-3 py-1.5 ${cls}`}
    >
      {isOpen ? "Close" : "Index"}
    </button>
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-ink bg-ground">
      <div
        className={`folio flex items-center justify-between overflow-hidden px-[3vw] transition-all duration-500 ease-[cubic-bezier(.76,0,.24,1)] md:grid md:grid-cols-[1fr_auto_1fr] md:border-b md:border-ink/15 ${slim ? "max-h-0 border-transparent py-0 opacity-0" : "max-h-16 py-2.5 opacity-100 md:py-2"}`}
        aria-hidden={slim}
      >
        <span className="hidden text-ink/70 md:block">{date || " "}</span>
        <button
          onClick={() => setIsSheetOpen(true)}
          className="group flex items-center gap-3 justify-self-start md:justify-self-center"
          aria-label="Aniket Saha, open profile"
        >
          <Avatar className="h-7 w-7 border border-ink/20">
            <AvatarImage src="/logo.jpeg" loading="eager" alt="" />
            <AvatarFallback className="bg-ink/5 text-[9px]">AS</AvatarFallback>
          </Avatar>
          <span className="display text-[clamp(1.4rem,3vw,2.2rem)] font-normal normal-case leading-none tracking-[-0.02em]">Aniket Saha</span>
        </button>
        <div className="hidden items-center justify-end gap-5 md:flex">
          <span className="text-ink/70">Portfolio · Vol. 2026</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {indexButton("")}
        </div>
      </div>

      <nav aria-label="Primary" className={`relative min-h-[3.4rem] items-center justify-center px-[3vw] py-2.5 md:min-h-0 md:flex md:gap-[clamp(1rem,3.4vw,3.4rem)] ${slim ? "flex" : "hidden"}`}>
        <button
          onClick={() => setIsSheetOpen(true)}
          className={`absolute left-[3vw] items-center gap-2 md:hidden ${slim ? "flex" : "hidden"}`}
          aria-label="Aniket Saha, open profile"
        >
          <span className="display text-xl leading-none tracking-[-0.02em]">Aniket Saha</span>
        </button>

        <div className="hidden items-center gap-[clamp(1rem,3.4vw,3.4rem)] md:flex">
          {navLinks.map((link, i) => (
            <a
              key={link.name}
              href={realHref(link.href)}
              onClick={(e) => onNav(e, link)}
              aria-current={isActive(link) ? "page" : undefined}
              className="group relative py-1 text-[0.85rem] font-medium"
            >
              <em className="folio mr-2 align-super text-[10px] not-italic text-vermilion">{pad(i + 1)}</em>
              {link.name}
              <span className={`absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] ${isActive(link) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
            </a>
          ))}
        </div>

        <div className="absolute right-[3vw] flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {indexButton("")}
        </div>
        {slim && (
          <div className="absolute right-[3vw] hidden md:block">
            <ThemeToggle />
          </div>
        )}
      </nav>

      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-vermilion-bright" aria-hidden="true" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-index"
            key="mobile-index"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="absolute left-0 right-0 top-full max-h-[calc(100dvh-100%)] overflow-y-auto border-b border-ink bg-ground md:hidden"
            data-lenis-prevent
          >
            <div className="px-[4vw] pb-8 pt-3">
              <p className="folio my-3 text-ink/70">Contents</p>
              {navLinks.map((link, i) => (
                <a
                  key={link.name}
                  href={realHref(link.href)}
                  onClick={(e) => onNav(e, link, true)}
                  className="flex items-baseline justify-between border-t border-ink/15 py-3.5"
                >
                  <span className="display text-[2.6rem] font-light leading-none">{link.name}</span>
                  <i className="folio not-italic text-vermilion">{pad(i + 1)}</i>
                </a>
              ))}
              <div className="folio mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink pt-4 text-ink/70">
                {[["LinkedIn", profileData.contact.linkedin], ["GitHub", profileData.contact.github], ["X", profileData.contact.x]].map(([n, u]) => (
                  <a key={n} href={u} target="_blank" rel="noopener noreferrer" className="hover:text-vermilion">{n} ↗</a>
                ))}
              </div>
              <a href={`mailto:${profileData.contact.email}`} className="mt-4 block break-all font-body text-base underline underline-offset-4">{profileData.contact.email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </header>
  );
};

export default Navbar;
