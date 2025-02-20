"use client";

import React from "react";
import Link from "next/link";
import { Roboto, Playfair_Display } from "next/font/google";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { ReactTyped } from "react-typed";
import { SpinningText } from "@/components/magicui/spinning-text";

const robotoMin = Roboto({
  weight: ["300"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const robotoMedium = Roboto({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const robotoMax = Roboto({
  weight: ["500"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const UnderlineLink = ({ href, children }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative font-normal"
  >
    {children}
    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

export default function Page() {
  return (
    <main className="flex flex-col p-10 pt-24 min-h-[90vh] bg-custom-gradient">
      <h1 className={`text-5xl ${robotoMedium.className}`}>Hello</h1>
      <h2 className={`text-7xl mt-2 mb-3 ${playfair.className}`}>
        I'm{" "}
        <ReactTyped
          strings={["a Web Developer", "Aniket Saha", "a Software Dev"]}
          typeSpeed={80}
          backSpeed={90}
          loop
        />
      </h2>

      <p className={`text-2xl mt-1 ${robotoMin.className}`}>
        I build dynamic web apps with{" "}
        <UnderlineLink href="https://react.dev/">React</UnderlineLink> and{" "}
        <UnderlineLink href="https://nextjs.org/">Next.js</UnderlineLink> while
        exploring machine learning and data analysis. My projects span
        full-stack platforms to AI-driven solutions, aiming for efficiency and
        impact.
      </p>

      <p className={`text-xl mt-14 ${robotoMin.className}`}>
        Many know me from{" "}
        <UnderlineLink href="https://www.linkedin.com/in/aniketsaha2005/">
          LinkedIn
        </UnderlineLink>{" "}
        and{" "}
        <UnderlineLink href="https://github.com/Aniket-a14">
          GitHub
        </UnderlineLink>
        , where I share projects and learnings.
      </p>

      <p className={`text-lg mt-1 flex items-center ${robotoMax.className}`}>
        Let’s build something amazing together!
        <span className="ml-6">
          <Link href="microsoft.pdf" target="_blank">
            <ShinyButton className="bg-[rgba(255,255,255,.55)]">
              Resume
            </ShinyButton>
          </Link>
        </span>
      </p>
      <div className="relative justify-end bottom-0 sm:bottom-5 md:bottom-10 lg:bottom-14 mt-28 mr-20 sm:flex hidden">
        <SpinningText>adapt • innovate • change •</SpinningText>
      </div>
    </main>
  );
}
