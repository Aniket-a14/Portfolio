"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileData, codingProfiles } from "../lib/data";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

const sheetVariants = {
  initial: { opacity: 0, x: "-100%" },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    x: "-100%",
    transition: {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, x: -25 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  },
  exit: {
    opacity: 0,
    x: -15,
    transition: {
      duration: 0.3,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const skillCategories = [
  { key: "core", label: "Core" },
  { key: "frameworks", label: "Frameworks" },
  { key: "aiAndData", label: "AI & Data" },
  { key: "databaseAndTools", label: "Database and Tools" },
];

const ProfileSheet = ({ isOpen, onClose }) => {
  const handleEscape = useCallback(
    (e) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  const content = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/80"
          />

          <motion.aside
            variants={sheetVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Profile Information"
            className="absolute left-0 top-0 h-full w-full sm:w-[520px] md:w-[620px] flex flex-col"
            style={{ background: "rgb(234, 229, 225)" }}
            data-light-cursor
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              className="sticky top-0 z-10 flex items-center justify-between px-10 sm:px-14 py-6 border-b border-black/[0.06]"
              style={{ background: "rgb(234, 229, 225)" }}
            >
              <div className="flex items-center gap-5">
                <Avatar className="h-12 w-12 border border-black/10">
                  <AvatarImage src="logo.jpeg" alt="Aniket Saha" />
                  <AvatarFallback style={{ background: "#e8e6e1", color: "#777" }} className="font-playfair">AS</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-playfair text-[30px] text-[#1a1a1a] leading-tight font-normal">
                    Aniket Saha
                  </h2>
                  <p className="font-roboto text-[14px] text-[#8a8070] font-light mt-0.5">
                    Full Stack Developer · ML Enthusiast · AI Engineer
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#aaa] hover:text-[#444] transition-colors duration-200 p-1"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              exit="exit"
              className="profile-sheet-light flex-1 overflow-y-auto px-10 sm:px-14 py-10"
            >
              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-roboto text-[14px] font-medium tracking-[0.2em] uppercase text-[#9a8e7f] mb-3">
                  {profileData.aboutPortfolio.title}
                </h3>
                <p className="font-roboto text-[16px] text-[#333] font-light leading-[1.6] whitespace-pre-line">
                  {profileData.aboutPortfolio.description.trim()}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-roboto text-[14px] font-medium tracking-[0.2em] uppercase text-[#9a8e7f] mb-3">
                  {profileData.aboutMe.title}
                </h3>
                <div className="font-roboto text-[16px] text-[#333] font-light leading-[1.6] space-y-4">
                  {profileData.aboutMe.description.trim().split('\n\n').map((paragraph, pIdx) => {
                    const lines = paragraph.split('\n');
                    const isList = lines.every(line => line.trim().startsWith('•'));
                    
                    if (isList) {
                      return (
                        <ul key={pIdx} className="space-y-1 mt-1">
                          {lines.map((line, lIdx) => (
                            <li key={lIdx} className="flex gap-2">
                              <span className="text-[#9a8e7f] mt-1.5">•</span>
                              <span>{line.replace('•', '').trim()}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    
                    return (
                      <p key={pIdx} className="whitespace-pre-line">
                        {paragraph.trim()}
                      </p>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-roboto text-[14px] font-medium tracking-[0.2em] uppercase text-[#9a8e7f] mb-3">
                  Experience
                </h3>
                <div className="space-y-8">
                  {profileData.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-roboto text-[17px] font-medium text-[#1a1a1a]">
                          {exp.role} {exp.company && <span className="font-light text-[#aaa] mx-1">|</span>} {exp.company}
                        </span>
                        <span className="font-roboto text-[13px] font-light text-[#aaa] whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <span className="font-roboto text-[14px] font-light text-[#888] block mt-0.5">
                        {exp.type}
                      </span>
                      {exp.description && (
                        <p className="font-roboto text-[15px] font-light text-[#555] leading-[1.5] mt-2.5 whitespace-pre-line">
                          {exp.description.trim()}
                        </p>
                      )}
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.map((bullet, i) => (
                            <li key={i} className="flex gap-2 font-roboto text-[14px] font-light text-[#555] leading-[1.4]">
                              <span className="text-[#9a8e7f] mt-1.5">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-roboto text-[14px] font-medium tracking-[0.2em] uppercase text-[#9a8e7f] mb-3">
                  Skills
                </h3>
                <div className="space-y-4">
                  {skillCategories.map(({ key, label }) => (
                    <div key={key}>
                      <span className="font-roboto text-[11px] font-medium tracking-[0.15em] uppercase text-[#b0a89e] block mb-2">
                        {label}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills[key].map((skill) => (
                          <span
                            key={skill}
                            className="font-roboto text-[13px] font-light text-[#555] px-4 py-2 rounded-full border border-[#d5d0c8] hover:border-[#999] hover:text-[#1a1a1a] transition-colors duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

                            <motion.div variants={fadeUp} className="mb-10 group/heatmap">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-roboto text-[14px] font-medium tracking-[0.2em] uppercase text-[#9a8e7f]">
                    GitHub Contributions
                  </h3>
                  <a 
                    href={profileData.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-roboto text-[12px] font-medium tracking-wide opacity-0 -translate-y-1 group-hover/heatmap:opacity-100 group-hover/heatmap:translate-y-0 text-[#a39788] hover:text-[#1a1a1a] transition-all duration-300"
                  >
                    <span>View Profile</span>
                    <FaGithub className="text-[13px]" />
                  </a>
                </div>
                
                <div className="relative w-full bg-[rgb(234,229,225)]">
                  <div className="absolute left-0 top-0 bottom-0 w-[30px] bg-[rgb(234,229,225)] z-10 overflow-hidden pointer-events-none">
                    <div className="w-[722px] h-[112px] flex items-center">
                      <img 
                        src={`https://ghchart.rshah.org/2ea043/${profileData.githubUsername}`} 
                        alt="" 
                        className="w-[722px] min-w-[722px] h-auto mix-blend-multiply contrast-[1.05]"
                        style={{ WebkitUserDrag: 'none' }}
                      />
                    </div>
                  </div>

                  <div className="absolute left-[28px] top-0 bottom-0 w-3 bg-gradient-to-r from-[rgb(234,229,225)] to-transparent z-10 pointer-events-none"></div>

                  <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="w-[722px] h-[112px] flex items-center">
                      <img 
                        src={`https://ghchart.rshah.org/2ea043/${profileData.githubUsername}`} 
                        alt="GitHub Contributions Heatmap" 
                        className="w-[722px] min-w-[722px] h-auto mix-blend-multiply contrast-[1.05]"
                        loading="lazy"
                        style={{ WebkitUserDrag: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-roboto text-[14px] font-medium tracking-[0.2em] uppercase text-[#9a8e7f] mb-5">
                  Coding Profiles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-6 mt-2">
                  {[
                    { name: "LeetCode", slug: "leetcode", stats: "650+ Problems Solved", url: "https://leetcode.com/u/Wizard_a14/", index: "01" },
                    { name: "GeeksforGeeks", slug: "geeksforgeeks", stats: "150+ Problems Solved", url: "https://www.geeksforgeeks.org/user/aniketsaha5353/", index: "02" },
                    { name: "HackerRank", slug: "hackerrank", stats: "5 Star Proficiency", url: "https://www.hackerrank.com/aniket_saha", index: "03" },
                  ].map((profile) => (
                    <motion.a 
                      key={profile.name} 
                      href={profile.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-1.5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <img 
                            src={`https://cdn.simpleicons.org/${profile.slug}`} 
                            alt={profile.name} 
                            className="w-4 h-4 transition-all duration-300 group-hover:scale-110"
                          />
                        </div>
                        <h4 className="font-playfair text-[17px] md:text-[19px] text-[#1a1a1a] font-normal leading-none transition-all duration-300">
                          {profile.name}
                        </h4>
                        <ArrowUpRight className="size-3 text-[#ccc] group-hover:text-black transition-all" strokeWidth={1.5} />
                      </div>
                      <span className="font-roboto text-[12px] font-light text-[#888] pl-8">
                        {profile.stats}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-roboto text-[14px] font-medium tracking-[0.2em] uppercase text-[#9a8e7f] mb-3">
                  Education
                </h3>
                <div className="space-y-6">
                  {profileData.education.map((edu, idx) => (
                    <div key={idx}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-roboto text-[17px] font-medium text-[#1a1a1a]">{edu.degree}</span>
                        <span className="font-roboto text-[13px] font-light text-[#aaa] whitespace-nowrap">
                          {edu.period}
                        </span>
                      </div>
                      <span className="font-roboto text-[14px] font-light text-[#888] block mt-0.5">
                        {edu.institution}
                      </span>
                      <p className="font-roboto text-[15px] font-light text-[#555] leading-[1.5] mt-2.5">
                        {edu.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="font-roboto text-[14px] font-medium tracking-[0.2em] uppercase text-[#9a8e7f] mb-3">
                  Contact
                </h3>
                <a
                  href={`mailto:${profileData.contact.email}`}
                  className="font-roboto text-[15px] font-light text-[#444] hover:text-[#111] transition-colors block mb-5"
                >
                  {profileData.contact.email}
                </a>
                <div className="flex items-center gap-5">
                  {[
                    { icon: FaLinkedin, label: "LinkedIn", href: profileData.contact.linkedin },
                    { icon: FaGithub, label: "GitHub", href: profileData.contact.github },
                    { icon: FaTwitter, label: "Twitter", href: profileData.contact.twitter },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2"
                      aria-label={social.label}
                    >
                      <social.icon className="text-[16px] text-[#999] group-hover:text-[#444] transition-colors duration-200" />
                      <span className="font-roboto text-[13px] font-light text-[#888] group-hover:text-[#444] transition-colors duration-200">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>

              <div className="h-10" />
            </motion.div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
};

export default ProfileSheet;
