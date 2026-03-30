"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import GlobalTransition from "@/components/ui/GlobalTransition";

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("");
  const [direction, setDirection] = useState("down");
  const [transitionType, setTransitionType] = useState("default");
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const navigate = (href, text, dir, type = "default") => {
    if (pathname === href) return;
    
    setIsTransitioning(true);
    setTransitionText(text);
    setDirection(dir);
    setTransitionType(type);

    // Wait exactly the length of the curtain drop (800ms) before navigating
    setTimeout(() => {
      router.push(href);
      
      // Wait a tiny bit for the new route to fully render before revealing
      setTimeout(() => {
         setIsTransitioning(false);
      }, 300); 
    }, 800);
  };

  return (
    <TransitionContext.Provider value={{ 
       navigate, 
       isTransitioning, 
       transitionText, 
       direction,
       transitionType,
       isInitialLoadComplete, 
       setIsInitialLoadComplete
    }}>
      {children}
      <GlobalTransition />
    </TransitionContext.Provider>
  );
};

export const useTransitionContext = () => useContext(TransitionContext);
