import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const Navbar = () => {
  return (
    <div className="container bg-custom-gradient rounded-xl flex justify-between items-center mx-auto px-8 py-4">
      <div className="text-xl font-bold tracking-tight pt-1">
        <Link href="/">
          <Avatar>
            <AvatarImage src="logo.jpeg" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="flex gap-8 text-lg font-semibold ">
        <NavigationMenuItem className="bg-transparent transition-all duration-200">
            <Link href="https://www.github.com/Aniket-a14" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} `}
              >
                <span className="text-lg">Github</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem className=" bg-transparent transition-all duration-200">
            <Link href="/About" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} `}
              >
                <span className="text-lg">About</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>


          <NavigationMenuItem className=" bg-transparent transition-all duration-200">
            <Link href="/Projects" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} `}
              >
                <span className="text-lg">Projects</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
