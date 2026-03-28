import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import { profileData } from "@/lib/data";
import ProfileSheet from "@/components/layout/ProfileSheet";

const navLinks = [
  { name: "Projects", href: "projects" },
  { name: "Testimonials", href: "testimonials" },
  { name: "Contact", href: "contact" },
];

const menuVariants = {
  initial: {
    scaleY: 0,
  },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    scaleY: 0,
    transition: {
      duration: 0.8,
      delay: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const linkVariants = {
  initial: {
    y: 80,
    opacity: 0,
  },
  enter: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.3 + i * 0.1,
    },
  }),
  exit: (i) => ({
    y: 80,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
      delay: i * 0.05,
    },
  }),
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleScroll = (id) => {
    const sectionId = id.startsWith('#') ? id.substring(1) : id;
    
    if (sectionId === 'home') {
      lenis?.scrollTo(0, {
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      lenis?.scrollTo(`#${sectionId}`, {
        offset: -80,
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    }
  };


  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.4, y: y * 0.4 });
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  const lenis = useLenis();

  useEffect(() => {
    if (isOpen || isSheetOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      lenis?.start();
    };
  }, [isOpen, isSheetOpen, lenis]);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-8 bg-transparent transition-all duration-300 max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center w-full relative">
        <div className="z-[60]">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="flex items-center gap-3.5 group relative p-0 md:px-4 md:py-2 rounded-full bg-transparent md:bg-white/10 hover:bg-white/5 md:hover:bg-white/20 border-none md:border border-white/5 hover:border-white/10 transition-all duration-500 md:backdrop-blur-md shadow-none md:shadow-sm"
            aria-label="Open profile"
          >
            <Avatar className="h-8 w-8 transition-transform duration-500 group-hover:scale-105 border border-white/10 shadow-lg">
              <AvatarImage src="/logo.jpeg" loading="eager" alt="Aniket Saha" />
              <AvatarFallback className="bg-white/5 text-[9px]">AS</AvatarFallback>
            </Avatar>
            
            <div className="hidden md:flex items-center gap-2.5 overflow-hidden">
              <span className="text-white font-medium tracking-tight text-[16px] font-roboto drop-shadow-sm group-hover:text-white/90 transition-all duration-500">
                Aniket Saha
              </span>
              <div className="flex items-center justify-center w-0 transition-all duration-500 group-hover:w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 overflow-hidden">
                <ArrowUpRight className="size-4 text-white/50" strokeWidth={1.5} />
              </div>
            </div>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleScroll(link.href)}
              className="text-white/80 hover:text-white transition-all text-sm font-medium tracking-wide flex items-center gap-2 group relative py-1 font-roboto drop-shadow-sm"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <Link
            href="https://www.github.com/Aniket-a14"
            target="_blank"
            className="text-white/80 hover:text-white transition-all text-sm font-medium tracking-wide flex items-center gap-2 group p-2 rounded-full drop-shadow-sm"
          >
            <FaGithub className="size-5" />
          </Link>
        </div>

        <div className="md:hidden z-[60]">
          <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetPosition}
            onClick={() => setIsOpen(!isOpen)}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`relative size-12 flex items-center justify-center rounded-full transition-colors duration-500 overflow-hidden ${isOpen ? "" : ""
              }`}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[6px] z-10">
              <motion.span
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 8 : 0,
                  backgroundColor: isOpen ? "#000" : "rgb(234, 229, 225)",
                }}
                className="w-6 h-[2px] rounded-full"
              />
              <motion.span
                animate={{
                  opacity: isOpen ? 0 : 1,
                  backgroundColor: isOpen ? "#000" : "rgb(234, 229, 225)",
                }}
                className="w-6 h-[2px] rounded-full"
              />
              <motion.span
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -8 : 0,
                  backgroundColor: isOpen ? "#000" : "rgb(234, 229, 225)",
                }}
                className="w-6 h-[2px] rounded-full"
              />
            </div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-white z-50 flex flex-col origin-top overflow-y-auto overflow-x-hidden"
            data-lenis-prevent
          >
            <div className="flex-1 flex flex-col justify-center px-10 pt-20">
              <div className="flex flex-col gap-6">
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-black/30 font-roboto">
                  Navigation
                </span>
                <div className="space-y-4">
                  {navLinks.map((link, i) => (
                    <div key={link.name} className="overflow-hidden">
                      <motion.div
                        custom={i}
                        variants={linkVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setTimeout(() => handleScroll(link.href), 800);
                          }}
                          className="text-[12vw] xs:text-5xl font-light text-black leading-none font-playfair hover:italic transition-all duration-300 block break-words text-left w-full"
                        >
                          {link.name}
                        </button>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.7, duration: 0.5 },
                }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-16 pt-10 border-t border-black/5 flex flex-col gap-10"
              >
                <div className="flex flex-col gap-4">
                  <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-black/30 font-roboto">
                    Socials
                  </span>
                  <div className="flex gap-6">
                    {[
                      { icon: FaLinkedin, href: profileData.contact.linkedin },
                      { icon: FaGithub, href: profileData.contact.github },
                      { icon: FaTwitter, href: profileData.contact.twitter },
                    ].map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5, color: "#000" }}
                        className="text-black/50 text-2xl transition-colors"
                      >
                        <social.icon />
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-black/30 font-roboto">
                    Get in Touch
                  </span>
                  <a
                    href={`mailto:${profileData.contact.email}`}
                    className="text-xl font-light text-black hover:text-black/70 transition-colors font-roboto underline underline-offset-8 decoration-black/20"
                  >
                    {profileData.contact.email}
                  </a>
                </div>
              </motion.div>
            </div>
            
            <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-[0.05] select-none text-black">
              <span className="text-[30vw] font-bold font-playfair leading-none">
                AS
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </nav>
  );
};

export default Navbar;