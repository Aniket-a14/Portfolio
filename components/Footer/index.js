import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RiCopyrightLine } from "react-icons/ri";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

const Footer = () => {
  const { navigate } = useTransitionContext();
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Newsletter States
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribeStatus("success");
        setEmail("");
        setTimeout(() => setSubscribeStatus("idle"), 5000);
      } else {
        setSubscribeStatus("error");
        setSubscribeMessage(data.error || "Failed to subscribe.");
      }
    } catch (err) {
      setSubscribeStatus("error");
      setSubscribeMessage("Service unavailable.");
    }
  };

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


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
            className="group w-fit sm:cursor-pointer text-left focus:outline-none"
          >
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 group-hover:text-white transition-colors duration-300 leading-tight font-normal">
              Let&apos;s work{" "}
              <span className="inline-flex items-center gap-2 sm:gap-4 md:gap-6 whitespace-nowrap">
                together
                <span className="w-9 h-9 sm:w-16 sm:h-16 md:w-[5.5rem] md:h-[5.5rem] rounded-full bg-white text-black flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-[1.05] group-active:scale-95 relative overflow-hidden translate-y-[1px] sm:translate-y-0">
                  <span className="absolute inset-0 border border-black/10 rounded-full animate-ping opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  <ArrowUpRight
                    strokeWidth={1.5}
                    className="size-4 sm:size-8 md:size-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                  />
                </span>
              </span>
            </h2>
          </button>
          <p className="font-roboto text-white/30 text-base md:text-lg mt-6 md:mt-8 font-light italic">
            aniketsahaworkspace@gmail.com
          </p>

          <div className="mt-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <h3 className="text-white/90 text-[10px] font-roboto tracking-[0.3em] uppercase">
                  Newsletter
                </h3>
              </div>
              
              <h4 className="font-playfair text-3xl md:text-5xl text-white/90 mb-6 leading-[1.1]">
                Stay updated with my <br />
                <span className="italic text-white/50">latest explorations.</span>
              </h4>
              
              <p className="text-white/30 text-sm md:text-base font-roboto font-light leading-relaxed">
                Monthly deep-dives into technical architecture, design systems, and creative experiments.
              </p>
            </div>

            <div className="w-full lg:w-96 shrink-0 pb-2">
              <form onSubmit={handleSubscribe} className="relative group/news">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR@EMAIL.COM"
                  disabled={subscribeStatus === "loading" || subscribeStatus === "success"}
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-sm text-white focus:outline-none focus:border-white transition-all placeholder:text-white/40 disabled:opacity-50 font-roboto font-light uppercase tracking-[0.2em]"
                />
                <button 
                  type="submit"
                  disabled={subscribeStatus === "loading" || subscribeStatus === "success"}
                  className="absolute right-0 top-0 text-white/40 hover:text-white transition-all p-1"
                >
                  {subscribeStatus === "loading" ? (
                    <div className="size-4 border border-white/10 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowUpRight className="size-8 transition-transform group-hover/news:translate-x-1 group-hover/news:-translate-y-1" strokeWidth={0.5} />
                  )}
                </button>
                
                <AnimatePresence>
                  {subscribeStatus === "success" && (
                    <motion.p 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-full mt-4 left-0 text-[10px] text-green-400 font-roboto tracking-[0.2em] uppercase"
                    >
                      Successfully joined.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
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
                { name: "Home", href: "home" },
                { name: "Projects", href: "projects" },
                { name: "Blogs", href: "/blogs" },
                { name: "Testimonials", href: "testimonials" },
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    const text = `• ${link.name.toUpperCase()}`;
                    navigate(link.href, text, 'down');
                  }}
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
              2026 Aniket Saha
            </span>
            <span className="text-white/70 text-[8px] font-roboto tracking-widest uppercase">
              Dev & Design
            </span>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <span className="text-white/80 text-[9px] font-roboto tracking-[0.2em] uppercase">
              Portfolio
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
