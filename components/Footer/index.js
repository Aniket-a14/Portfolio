"use client";

import React, { useState, useEffect } from "react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";
import { profileData, socialLinks } from "@/lib/data";
import { Words } from "@/components/ui/Reveal";

const Footer = () => {
  const { navigate } = useTransitionContext();
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Newsletter States
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    if (honeypot) {
      console.warn("Honeypot filled. Bot detected.");
      setSubscribeStatus("success");
      setSubscribeMessage("Successfully joined.");
      setEmail("");
      setHoneypot("");
      return;
    }

    setSubscribeStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribeStatus("success");
        if (data.message === 'already_subscribed') {
          setSubscribeMessage("Already subscribed!");
        } else {
          setSubscribeMessage("Successfully joined.");
        }
        setEmail("");
        setHoneypot("");
        setTimeout(() => {
          setSubscribeStatus("idle");
          setSubscribeMessage("");
        }, 5000);
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
    <footer id="contact" className="relative z-10 overflow-hidden bg-ground px-[3vw] pt-[8vh] text-ink">
      <div className="mx-auto flex min-h-[80vh] max-w-[1500px] flex-col">
        <p className="folio border-t border-ink pt-4 text-vermilion">№ 08 — Correspondence</p>

        <button
          onClick={() => navigate("/contact", "• Contact", "down")}
          className="group mt-[3vh] w-fit text-left focus:outline-none focus-visible:outline-2 focus-visible:outline-vermilion"
        >
          <span className="display block text-[clamp(3.6rem,13vw,14rem)] font-light leading-[.9] tracking-[-0.05em]">
            <Words text="Write to me." />
          </span>
          <span className="folio mt-4 inline-flex items-center gap-3 text-ink/70 transition-colors group-hover:text-vermilion">
            Got a project in mind? Let&apos;s work together
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </span>
        </button>

        <a
          href={`mailto:${profileData.contact.email}`}
          className="display mt-[3vh] w-max max-w-full break-all border-b border-vermilion text-[clamp(1.4rem,4vw,4rem)] font-light italic leading-none text-vermilion transition-colors hover:border-ink hover:text-ink"
        >
          {profileData.contact.email}
        </a>

        <div className="mt-[8vh] grid gap-[3vw] border-t border-ink pt-5 text-[12px] leading-[1.7] text-ink/70 md:grid-cols-3">
          <div>
            <h3 className="folio mb-2 text-ink">Elsewhere</h3>
            {socialLinks.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="block w-fit py-1 hover:text-vermilion">{s.name} ↗</a>
            ))}
          </div>

          <div>
            <h3 className="folio mb-2 text-ink">Dispatch</h3>
            <p>Monthly deep-dives into technical architecture, design systems, and creative experiments.</p>
            <form onSubmit={handleSubscribe} className="relative mt-3">
              {/* Honeypot field - hidden from people, filled by bots */}
              <input type="text" name="b_phone" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex="-1" autoComplete="off" />
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <div className="flex border-b border-ink">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  disabled={subscribeStatus === "loading" || subscribeStatus === "success"}
                  className="flex-1 bg-transparent py-2 text-[14px] text-ink outline-none placeholder:text-ink/50 disabled:opacity-50"
                />
                <button type="submit" aria-label="Subscribe" disabled={subscribeStatus === "loading" || subscribeStatus === "success"} className="px-2 text-lg transition-colors hover:text-vermilion disabled:opacity-50">
                  {subscribeStatus === "loading" ? <span className="block size-4 animate-spin rounded-full border border-ink/20 border-t-ink" /> : "→"}
                </button>
              </div>
              <p role="status" aria-live="polite" className={`folio mt-2 min-h-4 text-[10px] ${subscribeStatus === "error" ? "text-vermilion" : "text-green-800"}`}>
                {subscribeStatus === "success" || subscribeStatus === "error" ? subscribeMessage : ""}
              </p>
            </form>
          </div>

          <div>
            <h3 className="folio mb-2 text-ink">Colophon</h3>
            <nav aria-label="Footer" className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
              {[
                { name: "Home", href: "home" },
                { name: "Projects", href: "projects" },
                { name: "Blogs", href: "/blogs" },
                { name: "Testimonials", href: "testimonials" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href.startsWith("/") ? link.href : link.href === "home" ? "/" : `/#${link.href}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    navigate(link.href, `• ${link.name.toUpperCase()}`, "down");
                  }}
                  className="hover:text-vermilion"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <p className="flex items-center gap-2">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-700 opacity-60 dark:bg-green-500" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-700 dark:bg-green-500" />
              </span>
              Available for new projects
            </p>
            <p className="mt-1">Local time <span className="tabular-nums">{mounted ? formatIST(time) : "--:--:--"}</span> IST</p>
            <p className="mt-3">Set in Fraunces, Inter Tight and IBM Plex Mono. Built with Next.js.</p>
            <p>© 2026 Aniket Saha</p>
          </div>
        </div>

        <p aria-hidden="true" className="display mt-auto select-none whitespace-nowrap pt-[6vh] text-[clamp(5rem,19vw,20rem)] font-light italic leading-[.78] tracking-[-0.05em] translate-y-[.12em]">
          Aniket Saha<span className="text-vermilion-bright">.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
