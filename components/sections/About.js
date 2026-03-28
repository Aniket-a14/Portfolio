import React from "react";
import { TextReveal } from "@/components/magicui/text-reveal";
import { aboutText } from "@/lib/data";

const About = () => {
  return (
    <div className="z-10 flex min-h-64 flex-col items-start justify-start bg-black">
      <h2 className="sr-only">About Me</h2>
      <TextReveal
        text={aboutText}
      />
    </div>
  );
};

export default About;
