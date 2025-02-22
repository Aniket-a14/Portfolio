import React from "react";
import Link from "next/link";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaFile,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
    <div className="text-white flex justify-evenly min-h-[450px] pt-40">
      <div className="flex flex-col gap-2">
        <span className="text-white/70">VER A.S.W</span>
        <div>
          <Link
            href="#home"
            className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
          >
            Home
          </Link>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        <span className="pb-2 text-white/70">SOCIALS</span>
        <div>
          <Link
            href="https://www.linkedin.com/in/aniket-saha/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2"
          >
            <FaLinkedin />
            <span className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">LinkedIn</span>
          </Link>
        </div>
        <div>
          <Link
            href="https://github.com/aniket-saha"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
          >
            <FaGithub />
            <span className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">GitHub</span>
          </Link>
        </div>
        <div>
          <Link
            href="https://www.instagram.com/aniket_saha/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
          >
            <FaInstagram />
            <span className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Instagram</span>
          </Link>
        </div>
        <div>
          <Link
            href="https://twitter.com/aniket_saha"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
          >
            <FaTwitter />
            <span className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Twitter</span>
          </Link>
        </div>
      </nav>

      <nav className="flex flex-col gap-0.5">
      <span className="pb-2 text-white/70">CODING PROFILES</span>
      <div>
        <Link
          href="https://leetcode.com/aniket_saha/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3"
        >
          <span className="flex items-center gap-3">
            <span className=" after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Leetcode</span>
            <span className="text-white/60 mb-0.5">- 50+ Problems Solved</span>
          </span>
        </Link>
      </div>
      <div>
        <Link
          href="https://www.geeksforgeeks.org/user/aniket_saha/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3"
        >
          <span className="flex items-center gap-3">
            <span className=" after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Geeksforgeeks</span>
            <span className="text-white/60 mb-0.5">- 20+ Problems Solved</span>
        </span>
        </Link>
      </div>
      <div>
        <Link
          href="https://www.hackerrank.com/aniket_saha"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3"
        >
          <span className="flex items-center gap-3">
            <span className=" after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">HackerRank</span>
            <span className="text-white/60 mb-0.5">- 5 stars on C++, Python</span>
          </span>
        </Link>
      </div>
    </nav>

      

      <div className="flex flex-col gap-2">
        <span className="text-white/70">CONTACT</span>
        <div>
          <Link
            href="mailto:aniketsahaworkspace@gmail.com"
            className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
          >
            @WizardDesigns
          </Link>
        </div>
      </div>
    </div>
    <div className="text-white flex justify-center py-10">
        <span>© 2025 Aniket Saha. All rights reserved.</span>
    </div>
    </>
  );
};

export default Footer;
