import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaGithub } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <div id="home" className="flex bg-white justify-between items-center mx-auto px-8 py-4">
      <div className="text-xl font-bold tracking-tight items-center cursor-pointer">
        <Link href="/" onClick={()=>{
          window.location.reload();
          setIsOpen(false);
        }}>
          <Avatar>
            <AvatarImage src="logo.jpeg" loading="lazy" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </Link>
      </div>

      <div className="sm:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="z-50 p-2 text-black" aria-label="Toggle menu">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </motion.div>
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 right-0 h-screen bg-black text-white flex flex-col items-start justify-start z-40 p-8 w-full"
        >
          <motion.button
            onClick={() => setIsOpen(false)}
            className="text-white text-3xl mb-8 self-end mt-[-20px]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <X size={40} />
          </motion.button>
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-col text-2xl space-y-6 w-full">
              {[
                { name: "Github", href: "https://www.github.com/Aniket-a14" },
                { name: "Testimonials", href: "#testimonials" },
                { name: "Projects", href: "#projects" },
              ].map((item, index) => (
                <NavigationMenuItem key={index} className="w-full">
                  <NavigationMenuLink asChild className="bg-transparent relative">
                    <Link href={item.href} target={item.href.startsWith("http") ? "_blank" : ""} onClick={() => setIsOpen(false)} className="relative block w-fit hover:underline">
                      {item.name}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </motion.div>
      )}

      <div className="bg-white sm:block hidden">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-8 text-lg font-semibold">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="https://www.github.com/Aniket-a14" target="_blank" className="text-xl flex justify-center items-center gap-2">
                <span className="flex justify-center items-center gap-2 text-lg"><FaGithub className="size-4" /> Github</span>
                  
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="#testimonials"><span className="text-lg">Testimonials</span></Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="#projects"><span className="text-lg ">Projects</span></Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;