import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="container flex bg-custom-gradient rounded-xl justify-between items-center mx-auto px-8 py-4">
      <div className="text-xl font-bold tracking-tight items-center">
        <Link href="/">
          <Avatar>
            <AvatarImage src="logo.jpeg" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </Link>
      </div>

      <div>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-8 text-lg font-semibold ">
          <NavigationMenuItem className="bg-transparent transition-all duration-200">
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="https://www.github.com/Aniket-a14"> 
                <span className="text-lg flex justify-center items-center gap-2 "><FaGithub />Github</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className="bg-transparent transition-all duration-200">
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="#contact">
                <span className="text-lg">Contact</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className="bg-transparent transition-all duration-200">
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="#projects">
                <span className="text-lg">Projects</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;
