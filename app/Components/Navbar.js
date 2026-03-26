import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaGithub } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import ProfileSheet from "./ProfileSheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !isSheetOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen && !isSheetOpen) {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, isSheetOpen]);

  const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Github", href: "https://www.github.com/Aniket-a14", icon: <FaGithub className="size-4" /> },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-8 bg-gradient-to-b from-black/40 to-transparent transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center w-full">
        <div className="z-50">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="flex items-center gap-3 group"
            aria-label="Open profile"
          >
            <Avatar className="h-10 w-10 border border-white/10 transition-all duration-400">
              <AvatarImage src="/logo.jpeg" loading="eager" alt="Aniket Saha" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <span className="text-white font-medium tracking-tight text-lg opacity-100 transition-opacity hidden sm:block drop-shadow-sm">
              Aniket Saha
            </span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : ""}
              className="text-white/80 hover:text-white transition-all text-sm font-medium tracking-wide flex items-center gap-2 group relative py-1 drop-shadow-sm"
            > 
              {link.icon}
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="md:hidden z-50">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-white/90 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#040407] z-40 flex flex-col items-center justify-center p-8"
          >
            <div className="flex flex-col items-center gap-8 w-full max-w-sm">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.1 }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : ""}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-light text-white hover:text-white/80 transition-colors uppercase tracking-[0.2em] block py-4"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </nav>
  );
};

export default Navbar;