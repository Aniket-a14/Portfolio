"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { X, ArrowUpRight } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileData, codingProfiles as staticCodingProfiles } from "@/lib/data";
import { useState } from "react";

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
  { key: "languages", label: "Languages" },
  { key: "core", label: "Core" },
  { key: "development", label: "Development" },
  { key: "databases", label: "Databases" },
  { key: "cloudAndDevops", label: "Cloud & DevOps" },
  { key: "tools", label: "Tools" },
];

const ProfileSheet = ({ isOpen, onClose }) => {
  const [profiles, setProfiles] = useState(staticCodingProfiles);
  
  const handleEscape = useCallback(
    (e) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  const lenis = useLenis();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/coding-profiles');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        }
      } catch (err) {
        // Fallback to static data already in state
      }
    };
    
    if (isOpen) {
      fetchProfiles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      lenis?.start();
    };
  }, [isOpen, handleEscape, lenis]);

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
            className="absolute left-0 top-0 h-full w-full sm:w-[520px] md:w-[620px] flex flex-col bg-ground text-ink"
            
            
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              className="sticky top-0 z-10 flex items-center justify-between px-10 sm:px-14 py-6 border-b border-ink/10 bg-ground"
              
            >
              <div className="flex items-center gap-5">
                <Avatar className="h-12 w-12 border border-ink/15">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="bg-ink/10 font-display text-ink/70">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-display text-[30px] text-ink leading-tight font-normal">
                    {profileData.name}
                  </h2>
                  <p className="font-body text-[14px] text-ink/70 font-light mt-0.5">
                    {profileData.roles.join(' · ')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-ink/70 hover:text-ink/85 transition-colors duration-200 p-1"
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
              data-lenis-prevent
            >
              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-ink/70 mb-3">
                  {profileData.aboutPortfolio.title}
                </h3>
                <p className="font-body text-[16px] text-ink/85 font-light leading-[1.6] whitespace-pre-line">
                  {profileData.aboutPortfolio.description.trim()}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-ink/70 mb-3">
                  {profileData.aboutMe.title}
                </h3>
                <div className="font-body text-[16px] text-ink/85 font-light leading-[1.6] space-y-4">
                  {profileData.aboutMe.description.trim().split('\n\n').map((paragraph, pIdx) => {
                    const lines = paragraph.split('\n');
                    const isList = lines.every(line => line.trim().startsWith('•'));
                    
                    if (isList) {
                      return (
                        <ul key={pIdx} className="space-y-1 mt-1">
                          {lines.map((line, lIdx) => (
                            <li key={lIdx} className="flex gap-2">
                              <span className="text-ink/70 mt-1.5">•</span>
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
                <h3 className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-ink/70 mb-3">
                  Experience
                </h3>
                <div className="space-y-8">
                  {profileData.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-body text-[17px] font-medium text-ink">
                          {exp.role} {exp.company && <span className="font-light text-ink/70 mx-1">|</span>} {exp.company}
                        </span>
                        <span className="font-body text-[13px] font-light text-ink/70 whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <span className="font-body text-[14px] font-light text-ink/70 block mt-0.5">
                        {exp.type}
                      </span>
                      {exp.description && (
                        <p className="font-body text-[15px] font-light text-ink/85 leading-[1.5] mt-2.5 whitespace-pre-line">
                          {exp.description.trim()}
                        </p>
                      )}
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.map((bullet, i) => (
                            <li key={i} className="flex gap-2 font-body text-[14px] font-light text-ink/85 leading-[1.4]">
                              <span className="text-ink/70 mt-1.5">•</span>
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
                <h3 className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-ink/70 mb-3">
                  Skills
                </h3>
                <div className="space-y-4">
                  {skillCategories.map(({ key, label }) => (
                    <div key={key}>
                      <span className="font-body text-[11px] font-medium tracking-[0.15em] uppercase text-ink/70 block mb-2">
                        {label}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills[key].map((skill) => (
                          <span
                            key={skill}
                            className="font-body text-[13px] font-light text-ink/85 px-4 py-2 rounded-full border border-ink/20 hover:border-ink/50 hover:text-ink transition-colors duration-200"
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
                  <h3 className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-ink/70">
                    GitHub Contributions
                  </h3>
                  <a 
                    href={profileData.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-body text-[12px] font-medium tracking-wide opacity-0 -translate-y-1 group-hover/heatmap:opacity-100 group-hover/heatmap:translate-y-0 text-ink/70 hover:text-ink transition-[color,background-color,border-color,opacity,transform] duration-300"
                  >
                    <span>View Profile</span>
                    <FaGithub className="text-[13px]" />
                  </a>
                </div>
                
                <div className="relative w-full bg-ground">
                  <div className="absolute left-0 top-0 bottom-0 w-[30px] bg-ground z-10 overflow-hidden pointer-events-none">
                    <div className="w-[722px] h-[112px] flex items-center">
                      <img 
                        src={`https://ghchart.rshah.org/2ea043/${profileData.githubUsername}`} 
                        alt="" 
                        className="w-[722px] min-w-[722px] h-auto mix-blend-multiply contrast-[1.05] dark:mix-blend-screen dark:invert dark:hue-rotate-180"
                        style={{ WebkitUserDrag: 'none' }}
                      />
                    </div>
                  </div>

                  <div className="absolute left-[28px] top-0 bottom-0 w-3 bg-gradient-to-r from-ground to-transparent z-10 pointer-events-none"></div>

                  <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="w-[722px] h-[112px] flex items-center">
                      <img 
                        src={`https://ghchart.rshah.org/2ea043/${profileData.githubUsername}`} 
                        alt="GitHub Contributions Heatmap" 
                        className="w-[722px] min-w-[722px] h-auto mix-blend-multiply contrast-[1.05] dark:mix-blend-screen dark:invert dark:hue-rotate-180"
                        loading="lazy"
                        style={{ WebkitUserDrag: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-ink/70 mb-5">
                  Coding Profiles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-6 mt-2">
                  {profiles.map((profile) => (
                    <motion.a 
                      key={profile.name} 
                      href={profile.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-1.5 transition-[color,background-color,border-color,opacity,transform] duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <img 
                            src={`https://cdn.simpleicons.org/${profile.slug}`} 
                            alt={profile.name} 
                            className="w-4 h-4 transition-[color,background-color,border-color,opacity,transform] duration-300 group-hover:scale-110"
                          />
                        </div>
                        <h4 className="font-display text-[17px] md:text-[19px] text-ink font-normal leading-none transition-[color,background-color,border-color,opacity,transform] duration-300">
                          {profile.name}
                        </h4>
                        <ArrowUpRight className="size-3 text-ink/40 group-hover:text-ink transition-[color,background-color,border-color,opacity,transform]" strokeWidth={1.5} />
                      </div>
                      <span className="font-body text-[12px] font-light text-ink/70 pl-8">
                        {profile.stats}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-10">
                <h3 className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-ink/70 mb-3">
                  Education
                </h3>
                <div className="space-y-6">
                  {profileData.education.map((edu, idx) => (
                    <div key={idx}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-body text-[17px] font-medium text-ink">{edu.degree}</span>
                        <span className="font-body text-[13px] font-light text-ink/70 whitespace-nowrap">
                          {edu.period}
                        </span>
                      </div>
                      <span className="font-body text-[14px] font-light text-ink/70 block mt-0.5">
                        {edu.institution}
                      </span>
                      <p className="font-body text-[15px] font-light text-ink/85 leading-[1.5] mt-2.5">
                        {edu.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-ink/70 mb-3">
                  Contact
                </h3>
                <a
                  href={`mailto:${profileData.contact.email}`}
                  className="font-body text-[15px] font-light text-ink/85 hover:text-ink transition-colors block mb-5"
                >
                  {profileData.contact.email}
                </a>
                <div className="flex items-center gap-5">
                  {[
                    { icon: FaLinkedin, label: "LinkedIn", href: profileData.contact.linkedin },
                    { icon: FaGithub, label: "GitHub", href: profileData.contact.github },
                    { icon: FaXTwitter, label: "X (Formerly Twitter)", href: profileData.contact.x },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2"
                      aria-label={social.label}
                    >
                      <social.icon className="text-[16px] text-ink/70 group-hover:text-ink/85 transition-colors duration-200" />
                      <span className="font-body text-[13px] font-light text-ink/70 group-hover:text-ink/85 transition-colors duration-200">
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
