import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RiCopyrightLine } from "react-icons/ri";
import { ArrowUpRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const Footer = () => {
  const { navigate } = useTransitionContext();
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lenis = useLenis();

  const handleScroll = (id) => {
    const sectionId = id.startsWith('#') ? id.substring(1) : id;

    if (sectionId === 'home') {
      lenis?.scrollTo(0, {
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      lenis?.scrollTo(`#${sectionId}`, {
        offset: -80,
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    }
  };


  const formatIST = (date) => {
    if (!date) return "--:--:--";
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <footer
      id="contact"
      className="text-white pt-20 pb-12 px-6 md:px-12 lg:px-20 bg-black relative z-10 overflow-hidden border-t border-white/[0.03]"
    >
      <div className="max-w-6xl mx-auto mb-16 md:mb-20">
        <div className="border-t border-white/10 pt-12 md:pt-16">
          <p className="text-white/40 font-roboto text-[10px] md:text-sm tracking-[0.3em] uppercase mb-6 md:mb-8">
            Got a project in mind?
          </p>
          <button
            onClick={() => navigate('/contact', '• Contact', 'down')}
            className="group flex flex-wrap items-center gap-4 md:gap-[1.5vw] w-fit sm:cursor-pointer text-left focus:outline-none"
          >
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 group-hover:text-white transition-colors duration-300 leading-tight font-normal">
              Let&apos;s work together
            </h2>
            <div className="w-16 h-16 md:w-[5.5rem] md:h-[5.5rem] rounded-full bg-white text-black flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-[1.05] group-active:scale-95 relative overflow-hidden hidden sm:flex">
              <span className="absolute inset-0 border border-black/10 rounded-full animate-ping opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <ArrowUpRight
                size={38}
                strokeWidth={1.5}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
              />
            </div>
          </button>
          <p className="font-roboto text-white/30 text-base md:text-lg mt-6 md:mt-8 font-light italic">
            aniketsahaworkspace@gmail.com
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/[0.08] pt-10 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 md:gap-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-y-4 gap-x-10">
            <span className="text-white/20 text-[9px] font-roboto tracking-[0.3em] uppercase shrink-0">
              Navigation
            </span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { name: "Home", href: "#home" },
                { name: "Projects", href: "#projects" },
                { name: "Testimonials", href: "#testimonials" },
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleScroll(link.href)}
                  className="text-white/50 hover:text-white transition-colors text-[14px] font-roboto font-normal relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full select-none"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-y-6 gap-x-12 md:justify-end">
            <div className="flex items-center gap-3 group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-white/40 text-[13px] font-roboto font-normal tracking-wide group-hover:text-white transition-colors">
                Available for New Projects
              </span>
            </div>

            <div className="flex flex-col items-start md:items-end min-w-[124px]">
              <span className="text-white/20 text-[9px] font-roboto tracking-[0.3em] uppercase mb-1">
                Local Time (IST)
              </span>
              <span className="text-white/80 text-lg md:text-xl font-roboto font-light tabular-nums">
                {mounted ? formatIST(time) : "--:--:--"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 md:mt-8 overflow-hidden relative border-t border-white/[0.03] pt-10 md:pt-12 pb-6 px-4">
        <p
          aria-hidden="true"
          role="presentation"
          className="font-playfair font-black text-[21vw] md:text-[22vw] leading-none text-white/[0.10] md:text-white/[0.12] text-center tracking-tighter sm:tracking-tightest select-none pointer-events-none uppercase"
        >
          WIZARD
        </p>


        <div className="mt-4 flex flex-row justify-between items-end gap-4 px-2">
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-white/80 text-[9px] font-roboto tracking-widest uppercase truncate max-w-[140px]">
              <RiCopyrightLine className="text-[10px]" />
              2025 Aniket Saha
            </span>
            <span className="text-white/70 text-[8px] font-roboto tracking-widest uppercase">
              Dev & Design
            </span>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <span className="text-white/80 text-[9px] font-roboto tracking-[0.2em] uppercase">
              Portfolio v2
            </span>
            <span className="text-white/70 text-[8px] font-roboto tracking-[0.2em] uppercase underline underline-offset-4 decoration-white/5">
              Next.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
