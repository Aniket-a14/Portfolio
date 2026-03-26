import React from "react";
import IconCloudDemo from "./Icon";


const Languages = () => {
  return (
    <section className="bg-[#040407] py-16 px-6 md:px-12 lg:px-20" id="languages">
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-white/10 pt-10 mb-8">
          <p className="text-white/40 font-roboto text-sm tracking-[0.2em] uppercase mb-4">
            Technical Stack
          </p>
          <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight">
            Languages and tools <br className="hidden md:block" /> proficiency
          </h2>
        </div>
        <div className="flex flex-col xl:flex-row justify-center items-center relative z-10 w-full pb-16">
          <IconCloudDemo />
        </div>
      </div>
    </section>
  );
};

export default Languages;
