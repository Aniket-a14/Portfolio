import React from "react";
import { TextReveal } from "@/components/magicui/text-reveal";
import { aboutText } from "@/lib/data";

const About = () => {
  return (
    <div className="z-10 flex flex-col items-start justify-start bg-black">
      <h2 className="sr-only">About Me</h2>
      <TextReveal
        text={aboutText}
        className="h-fit py-10 md:py-20"
      />
    </div> 
  );
};

export default About;
