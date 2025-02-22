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

const playfairMin = Playfair_Display({
  weight: ["500"],
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
        <div className="flex flex-col justify-center items-center">
          <h1
            className={`text-2xl flex justify-center items-center pt-20 ${playfairMin.className}`}
          >
            {" "}
            Explore my
          </h1>
          <h2
            className={`text-5xl flex relative text-center underline justify-center pt-3 items-center font-bold ${playfair.className} `}
          >
            Languages and Tools Proficiency
          </h2>
        </div>
        <div className="flex flex-col xl:flex-row  justify-between items-center">
          <IconCloud images={images} />
          <span className="pb-10 sm:ml-4 w-full xl:pb-0">
            <AnimatedBeamDemo />
          </span>
          <span className="xl:block hidden">
            <IconCloud images={images} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Languages;
