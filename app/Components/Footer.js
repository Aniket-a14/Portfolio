import React, { useState, useEffect } from "react";
import Link from "next/link";
import { socialLinks, codingProfiles as initialCodingProfiles } from "../lib/data";
import { RiCopyrightLine } from "react-icons/ri";
import { SpinningText } from "@/components/magicui/spinning-text";

const Footer = () => {
  const [codingProfilesData, setCodingProfilesData] = useState(initialCodingProfiles);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/coding-profiles");
        if (response.ok) {
          const data = await response.json();
          setCodingProfilesData(data);
        }
      } catch (error) {
        console.error("Failed to fetch coding profiles data:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <>
      <div className="text-white flex justify-evenly min-h-[400px] pt-32">
        <div className="flex flex-col gap-3  md:block hidden">
          <span className="text-white/70 text-base mb-3">VER A.S.W</span>
          <div className="pt-2">
            <Link
              href="#home"
              className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full text-lg font-semibold"
            >
              Home
            </Link>
          </div>
        </div>

        <nav className="flex flex-col gap-3 md:block hidden">
          <span className={`font-roboto pb-3 text-white/70 text-base font-medium`}>SOCIALS</span>
          {socialLinks.map((social) => (
            <div key={social.name} className="pt-2">
              <Link
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-lg"
                aria-label={social.name}
              >
                <social.icon className={`text-xl my-1 transition-colors ${social.colorClass}`} />
                <span className={`font-roboto font-light hidden md:inline-block relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full`}>
                  {social.name}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        <nav className="flex flex-col gap-3 md:block hidden">
          <span className={`font-roboto pb-3 text-white/70 text-base font-medium`}>CODING PROFILES</span>
          {codingProfilesData.map((profile) => (
            <div key={profile.name} className="pt-2">
              <Link
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-lg"
                aria-label={`${profile.name} Profile`}
              >
                <span className={`font-roboto font-light after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full`}>
                  {profile.name}
                </span>
                <span className="text-white/60 mb-0.5">{profile.stats}</span>
              </Link>
            </div>
          ))}
        </nav>

        <div className={`flex flex-col gap-2 font-roboto`}>
          <span className="text-white/70 text-base text-center md:text-left font-medium">CONTACT</span>
          <div>
            <a
              href="mailto:aniketsahaworkspace@gmail.com"
              className={`font-roboto font-light relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full text-lg`}
            >
              @WizardDesigns
            </a>
          </div>
        </div>
      </div>

      <div className="text-white flex md:justify-between justify-center items-center pb-20 pt-20 text-base ">
        <span className={`flex relative items-center left-0 md:left-10 gap-2 top-6 font-roboto`}> <RiCopyrightLine className="text-xl" /> 2025 Aniket Saha. All rights reserved.</span>
        <div className="relative right-28 md:flex hidden">
          <SpinningText>adapt • innovate • change •</SpinningText>
        </div>
      </div>
    </>
  );
};

export default Footer;
