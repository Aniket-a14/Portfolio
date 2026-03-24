"use client";

import React from "react";
import Link from "next/link";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { ReactTyped } from "react-typed";
import TiltedCard from "@/components/TiltedCard/TiltedCard";
import { heroData } from "../lib/data";

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
    <>
      <div className="flex justify-between items-center bg-transparent min-h-[95vh]  lg:flex-row flex-col">
        <main className="flex flex-col p-10 justify-center md:justify-center xl:justify-start lg:justify-start min-h-[75vh]  max-w-[100%] md:max-w-[100%] lg:max-w-[70%] xl:max-w-[75%] ">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-roboto font-medium`}>{heroData.title}</h1>
          <p className={`text-3xl sm:text-5xl md:text-6xl xl:text-7xl mt-2 mb-3 font-playfair `}>
            {heroData.subTitle}{" "}
            <ReactTyped
              strings={heroData.roles}
              typeSpeed={80}
              backSpeed={90}
              loop
            />
          </p>

          <p className={`text-lg sm:text-lg md:text-xl xl:text-2xl mt-1 font-roboto font-light`}>
            I build dynamic web apps with{" "}
            <UnderlineLink href={heroData.links.react}>React</UnderlineLink> and{" "}
            <UnderlineLink href={heroData.links.nextjs}>Next.js</UnderlineLink>{" "}
            while exploring machine learning and data analysis. My projects span
            full-stack platforms to AI-driven solutions, aiming for efficiency
            and impact.
          </p>

          <p className={`text-lg sm:text-lg md:text-xl xl:text-2xl mt-14 font-roboto font-light`}>
            Many know me from{" "}
            <UnderlineLink href={heroData.links.linkedin}>
              LinkedIn
            </UnderlineLink>{" "}
            and{" "}
            <UnderlineLink href={heroData.links.github}>
              GitHub
            </UnderlineLink>
            , where I share projects and learnings.
          </p>

          <p
            className={`text-lg sm:text-lg md:text-xl xl:text-2xl mt-1 flex items-center font-roboto font-medium`}
          >
            Let’s build something amazing together!
            <span className="ml-6">
              <a href={heroData.links.resume} target="_blank" rel="noopener noreferrer" aria-label="Download Resume">
                <ShinyButton className="bg-[rgba(255,255,255,.55)] ">
                  Resume
                </ShinyButton>
              </a>
            </span>
          </p>
        </main>
        <div className="max-w-[25%] xl:max-w-[20%] relative justify-center lg:bottom-16  xl:bottom-10  right-20 lg:flex hidden">
          <TiltedCard
            imageSrc="/logo_new.png"
            altText="Aniket Saha - Wiz"
            captionText="Aniket Saha"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <p className="tilted-card-demo-text ">Aniket Saha - Wiz</p>
            }
          />
        </div>
      </div>
    </>
  );
}
