"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const Marquee = ({ text = "RECENT WORK", speed = 50 }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const scrollingText = ` ${text} \u00A0\u00A0•\u00A0\u00A0 `;
  const duration = textWidth ? textWidth / speed : 10; // Adjust speed dynamically

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full p-4">
      <motion.div
        className={`flex whitespace-nowrap text-white ${roboto.className} text-6xl font-bold`}
        initial={{ x: 0 }}
        animate={{ x: -textWidth }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration,
          ease: "linear",
        }}
        style={{ display: "flex" }}
      >
        <span ref={textRef} className="mx-2">
          {scrollingText.repeat(100)}
        </span>
      </motion.div>
    </div>
  );
};

export default Marquee;