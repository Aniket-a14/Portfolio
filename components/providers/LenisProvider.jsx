"use client";

import { ReactLenis } from "lenis/react";

export default function LenisProvider({ children }) {
  // Lenis drives its own rAF loop via ReactLenis. The effect that used to live
  // here declared an `update` function that was never registered with any
  // ticker, so it did nothing but keep a ref alive.
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
