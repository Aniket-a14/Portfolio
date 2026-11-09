"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";
import { socialLinks, profileData } from "@/lib/data";

const TOPICS = ["a role", "a project", "your work", "something else"];

// Set the inline letter fields apart from body copy: italic, vermilion, ruled.
const INLINE =
  "display bg-transparent border-0 border-b border-vermilion px-1 italic font-light text-vermilion " +
  "placeholder:text-vermilion/45 rounded-none focus:outline-none focus:bg-vermilion/10";

/**
 * Contact, as a letter. The form is a sentence ("My name is ___, and I'd like to
 * talk about [a role | a project | …]") so it reads as writing to a person rather
 * than filling in a form. Same Formspree endpoint, honeypot and states as before.
 */
export default function ContactHub() {
  const { navigate } = useTransitionContext();
  const [status, setStatus] = useState("idle");
  const [honeypot, setHoneypot] = useState("");
  const [copied, setCopied] = useState(false);
  const email = profileData.contact.email;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address is still a visible mailto link */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeypot) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    const formData = new FormData(e.target);
    formData.set("_subject", `Portfolio: ${formData.get("topic") || "message"} — ${formData.get("name") || "visitor"}`);

    try {
      const response = await fetch("https://formspree.io/f/mqegqqaz", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-ground text-ink selection:bg-vermilion-bright selection:text-ground">
      <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-10 md:px-12">
        <button
          onClick={() => navigate("/", "• Home", "up")}
          className="folio mb-10 flex w-fit items-center gap-2 text-ink/70 hover:text-vermilion focus:outline-none focus-visible:text-vermilion"
        >
          <ArrowUpRight size={14} className="-rotate-90" />
          Back to home
        </button>

        <div className="mx-auto max-w-[48rem]">
          <p className="folio border-t border-ink pt-4 text-vermilion">№ 05 — Letter to the author</p>

          {status === "success" ? (
            <div role="status" className="py-[10vh] text-center">
              <p className="display text-[4rem] font-light leading-none text-vermilion" aria-hidden="true">✓</p>
              <h1 className="display mt-4 text-[clamp(2rem,4.4vw,3.4rem)] font-light leading-[1.05]">Message received.</h1>
              <p className="mx-auto mt-4 max-w-[30em] text-ink/70">
                Thank you for reaching out. I&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 grid gap-3.5">
              <h1 className="sr-only">Contact Aniket Saha</h1>

              {/* Honeypot: hidden from people, irresistible to bots. */}
              <input
                type="text"
                name="b_phone"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <p className="display text-[clamp(1.4rem,2.6vw,2.1rem)] font-light leading-[1.5]">Dear Aniket,</p>

              <p className="display text-[clamp(1.4rem,2.6vw,2.1rem)] font-light leading-[1.55]">
                My name is{" "}
                <input
                  aria-label="Your name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="your name"
                  className={`${INLINE} w-[9em] max-w-full`}
                />
                , and I&apos;d like to talk about{" "}
                <span role="radiogroup" aria-label="What would you like to talk about?" className="inline-flex flex-wrap gap-2 align-middle">
                  {TOPICS.map((topic, i) => (
                    <label key={topic} className="cursor-pointer">
                      <input type="radio" name="topic" value={topic} required={i === 0} className="peer sr-only" />
                      <span className="display inline-block rounded-full border border-ink px-3 py-0.5 text-[.75em] italic font-light peer-checked:border-vermilion peer-checked:bg-vermilion peer-checked:text-ground peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-vermilion hover:bg-ink/5">
                        {topic}
                      </span>
                    </label>
                  ))}
                </span>
                .
              </p>

              <label className="flex flex-col-reverse gap-2">
                <span className="folio text-[10.5px] text-ink/70">A few lines, in your own words *</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="What would you like to say?"
                  className="display w-full resize-y rounded-none border border-ink/20 bg-ink/[0.04] p-4 text-[1.2rem] font-light leading-[1.6] focus:border-vermilion focus:outline-none"
                />
              </label>

              <p className="display text-[clamp(1.4rem,2.6vw,2.1rem)] font-light leading-[1.55]">
                You can reach me at{" "}
                <input
                  aria-label="Your email address"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`${INLINE} w-[min(14em,100%)]`}
                />
                .
              </p>

              <p className="display text-[clamp(1.4rem,2.6vw,2.1rem)] font-light leading-[1.5]">
                Yours, <i className="text-ink/70">— a visitor</i>
              </p>

              {status === "error" && (
                <p role="alert" className="folio w-fit border border-vermilion px-4 py-3 text-[11px] normal-case tracking-[0.04em] text-vermilion">
                  That didn&apos;t send. Please try again, or write to{" "}
                  <a href={`mailto:${email}`} className="underline">{email}</a> directly.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3.5 text-[.95rem] font-medium text-ground transition-colors hover:border-vermilion hover:bg-vermilion disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : "Send the letter"}
                  <ArrowUpRight size={15} />
                </button>
                <span className="folio text-[11px] normal-case tracking-[0.04em] text-ink/70">Reply within 24 hours</span>
              </div>
            </form>
          )}
        </div>

        {/* Other ways to reach me */}
        <footer className="folio mt-16 grid gap-x-8 gap-y-6 border-t border-ink pt-5 text-[11px] normal-case tracking-[0.04em] md:grid-cols-3">
          <div>
            <p className="mb-2 uppercase tracking-[0.14em] text-vermilion">Email</p>
            <a href={`mailto:${email}`} className="break-all border-b border-ink/40 hover:text-vermilion">{email}</a>
            <button type="button" onClick={copyEmail} aria-live="polite" className="ml-3 border border-ink px-2 py-0.5 uppercase tracking-[0.1em] hover:bg-ink hover:text-ground">
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div>
            <p className="mb-2 uppercase tracking-[0.14em] text-vermilion">Elsewhere</p>
            <ul className="grid gap-1">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 border-b border-ink/40 hover:text-vermilion">
                    {s.name} <ArrowUpRight size={11} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 uppercase tracking-[0.14em] text-vermilion">Based in</p>
            <p>India</p>
            <p className="text-ink/70">Available for global freelance opportunities</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
