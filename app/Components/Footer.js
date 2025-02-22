import React from "react";
import Link from "next/link";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="text-white flex justify-evenly min-h-[400px] pt-32">
        <div className="flex flex-col gap-3  md:block hidden">
          <span className="text-white/70 text-base">VER A.S.W</span>
          <div>
            <Link
              href="#home"
              className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full text-lg font-semibold"
            >
              Home
            </Link>
          </div>
        </div>

        <nav className="flex flex-col gap-3 md:block hidden">
          <span className="pb-3 text-white/70 text-base font-medium">SOCIALS</span>
          <div>
            <Link
              href="https://www.linkedin.com/in/aniketsaha2005"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-lg"
            >
              <FaLinkedin className="text-xl my-1 group-hover:text-blue-600 transition-colors" />
              <span className="hidden md:inline-block relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                LinkedIn
              </span>
            </Link>
          </div>
          <div>
            <Link
              href="https://github.com/Aniket-a14"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-lg"
            >
              <FaGithub className="text-xl my-1 group-hover:text-gray-600 transition-colors" />
              <span className="hidden md:inline-block relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                GitHub
              </span>
            </Link>
          </div>
          <div>
            <Link
              href="https://www.instagram.com/aniket_a14/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-lg"
            >
              <FaInstagram className="text-xl my-1 group-hover:text-pink-600 transition-colors" />
              <span className="hidden md:inline-block relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                Instagram
              </span>
            </Link>
          </div>
          <div>
            <Link
              href="https://www.facebook.com/aniket.saha.904"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-lg"
            >
              <FaFacebook className="text-xl my-1 group-hover:text-blue-600 transition-colors" />
              <span className="hidden md:inline-block relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                Facebook
              </span>
            </Link>
          </div>
          <div>
            <Link
              href="https://x.com/AniketSaha41043"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-lg"
            >
              <FaTwitter className="text-xl my-1 group-hover:text-blue-400 transition-colors" />
              <span className="hidden md:inline-block relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                Twitter
              </span>
            </Link>
          </div>
        </nav>

        <nav className="flex flex-col gap-3 md:block hidden">
          <span className="pb-3 text-linear-gradient(90deg, #edecec, #ffffff)/70 text-base font-medium">CODING PROFILES</span>
          <div>
            <Link
              href="https://leetcode.com/u/Wizard_a14/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-lg"
            >
              <span className="after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                Leetcode
              </span>
              <span className="text-linear-gradient(90deg, #edecec, #ffffff)/60 mb-0.5">- 50+ Problems Solved</span>
            </Link>
          </div>
          <div>
            <Link
              href="https://www.geeksforgeeks.org/user/aniketsaha5353/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-lg"
            >
              <span className="after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                Geeksforgeeks
              </span>
              <span className="text-linear-gradient(90deg, #edecec, #ffffff)/60 mb-0.5">- 30+ Problems Solved</span>
            </Link>
          </div>
          <div>
            <Link
              href="https://www.hackerrank.com/aniket_saha"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-lg"
            >
              <span className="after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                HackerRank
              </span>
              <span className="text-linear-gradient(90deg, #edecec, #ffffff)/60 mb-0.5">- 5 stars on C++, Python</span>
            </Link>
          </div>
        </nav>

        <div className="flex flex-col gap-2">
          <span className="text-linear-gradient(90deg, #edecec, #ffffff)/70 text-base font-medium">CONTACT</span>
          <div>
            <Link
              href="mailto:aniketsahaworkspace@gmail.com"
              className="relative inline-block after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full text-lg"
            >
              @WizardDesigns
            </Link>
          </div>
        </div>
      </div>
      
      <div className="text-white flex justify-center py-8 text-base">
        <span>© 2025 Aniket Saha. All rights reserved.</span>
      </div>
    </>
  );
};

export default Footer;
