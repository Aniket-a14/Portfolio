import React from "react";
import { TextReveal } from "@/components/magicui/text-reveal";

const About = () => {
  return (
    <div className="z-10 flex min-h-64  items-start justify-start dark:bg-black">
      <TextReveal 
        text="Driven by a passion for coding and innovation, I am a tech enthusiast with a strong interest in Machine Learning and software development. I enjoy solving complex problems, exploring new technologies, and building impactful solutions. My experience spans web development to AI-driven applications, where I continuously expand my skills, optimize code, and experiment with emerging technologies."
      />
    </div>
  );
};

export default About;
