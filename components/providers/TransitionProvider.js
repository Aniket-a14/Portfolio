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

  React.useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const navigate = (href, text, dir, type = "default") => {
    const isSection = !href.startsWith('/');
    const isHome = pathname === "/";

    if (!isSection && pathname === href) return;

    setIsTransitioning(true);
    setTransitionText(text);
    setDirection(dir);
    setTransitionType(type);

    setTimeout(() => {
      if (isSection) {
        if (isHome) {
          const target = href.replace('#', '');
          window.dispatchEvent(new CustomEvent('nav-scroll', { detail: { target } }));
          setTimeout(() => setIsTransitioning(false), 500);
        } else {
          router.push(`/#${href}`);
        }
      } else {
        router.push(href);
      }
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
