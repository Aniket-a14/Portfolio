import React from "react";
import IconCloudDemo from "./Icon";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "700",
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const RobotoMin = Roboto({
  weight: "300",
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});


const Languages = () => {
  return (
    <div>
      <div className="container min-h-[110vh] mx-auto pb-44">
        <div className="flex flex-col justify-center bg-[#040407] items-center">
          <h1
            className={`text-lg text-white flex justify-center items-center pt-24 ${RobotoMin.className}`}
          >
            {" "}
            EXPLORE MY
          </h1>
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-white flex relative text-center justify-center pt-3  items-center font-bold ${roboto.className} `}
          >
            LANGUAGES AND TOOLS PROFICIENCY
          </h2>
        </div>
        <div className="flex flex-col pt-20  xl:flex-row bg-[#040407] justify-center items-center">
          <IconCloudDemo />
          
        </div>
      </div>
    </div>
  );
};

export default Languages;
