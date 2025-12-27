import React from "react";
import { TextReveal } from "@/components/magicui/text-reveal";
import { aboutText } from "../lib/data";

const About = () => {
  return (
    <div className="z-10 flex min-h-64  items-start justify-start">
      <TextReveal
        text={aboutText}
      />
    </div>
  );
};

export default About;
