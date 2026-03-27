import React, { useState, useEffect } from "react";
import Link from "next/link";
import { socialLinks, codingProfiles as initialCodingProfiles } from "../lib/data";
import { RiCopyrightLine } from "react-icons/ri";
import { SpinningText } from "@/components/magicui/spinning-text";
import { ArrowUpRight } from "lucide-react";

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
    <footer className="text-white pt-12 pb-8 px-6 md:px-12 lg:px-20 bg-black">
      <div className="max-w-6xl mx-auto mb-10">
        <div className="border-t border-white/10 pt-10">
          <p className="text-white/40 font-roboto text-sm tracking-[0.2em] uppercase mb-4">
            Got a project in mind?
          </p>
          <a
            href="mailto:aniketsahaworkspace@gmail.com"
            className="group flex items-center gap-4 w-fit"
          >
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 group-hover:text-white transition-colors duration-300">
              Let&apos;s work together
            </h2>
            <ArrowUpRight
              size={40}
              className="text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0"
            />
          </a>
          <p className="font-roboto text-white/30 text-base mt-4 font-light">
            aniketsahaworkspace@gmail.com
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 pb-16 border-b border-white/[0.06]">
        <div>
          <span className="text-white/50 text-[11px] font-roboto font-medium tracking-[0.2em] uppercase block mb-5">
            Navigation
          </span>
          <div className="flex flex-col gap-3">
            {[
              { name: "Home", href: "#home" },
              { name: "Projects", href: "#projects" },
              { name: "Testimonials", href: "#testimonials" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/90 hover:text-white transition-colors text-[16px] font-roboto font-normal w-fit relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <span className="text-white/60 text-[12px] font-roboto font-medium tracking-[0.2em] uppercase block mb-5">
            Socials
          </span>
          <div className="flex flex-col gap-3">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-white/90 hover:text-white transition-colors text-[16px] font-roboto font-normal w-fit"
              >
                <social.icon className={`text-sm opacity-50 group-hover:opacity-100 transition-all ${social.colorClass}`} />
                <span className="relative w-fit after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full">
                  {social.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <span className="text-white/60 text-[12px] font-roboto font-medium tracking-[0.2em] uppercase block mb-5">
            Profiles
          </span>
          <div className="flex flex-col gap-3">
            {codingProfilesData.map((profile) => (
              <Link
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col text-[16px] font-roboto font-normal w-fit"
              >
                <span className="text-white/90 group-hover:text-white transition-colors relative w-fit after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full">
                  {profile.name}
                </span>
                <span className="text-white/50 text-[14px] mt-0.5 font-light">
                  {profile.stats?.replace("- ", "")}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center justify-end">
          <SpinningText>adapt • innovate • change •</SpinningText>
        </div>

      </div>

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center pt-6 pb-2 border-t border-white/[0.06] gap-4">
        <span className="flex items-center gap-1.5 text-white/25 text-[13px] font-roboto">
          <RiCopyrightLine className="text-sm" />
          2025 Aniket Saha. All rights reserved.
        </span>
        <span className="text-white/15 text-[12px] font-roboto tracking-wider uppercase">
          Portfolio v2
        </span>
      </div>
    </footer>
  );
};

export default Footer;
