import React from "react";
import { AnimatedBeamDemo } from "./beam";
import { IconCloud } from "@/components/magicui/icon-cloud";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: ["700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const images = [
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
  "/logo.jpeg",
];

const Languages = () => {
  return (
    <div>
      <div className="container min-h-screen mx-auto">
        <h1 className={`text-5xl flex relative underline justify-center items-center pt-20 font-bold ${playfair.className}`}>
        Languages and Tools Proficiency
        </h1>
        <div className="flex flex-col xl:flex-row  justify-between items-center">
        <IconCloud images={images} />
          <AnimatedBeamDemo />
        <IconCloud images={images} />
          
        </div>

        
      </div>
    </div>
  );
};

export default Languages;
