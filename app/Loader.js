import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Loader = ({ onComplete }) => {
  const [moveUp, setMoveUp] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    "• Hi", "• Hola",
    "• Bonjour", "• Hallo", "• Ciao", "• Olá", "• Привет", "• Zdravstvuyte", "• Hej", "• Sawasdee", "• Merhaba", "• Aloha", "• Xin chào", "• Salaam", "• হ্যালো", "• Namaste"
  ];

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    const delayBeforeGreetings = 500;
    let greetingInterval;

    const startGreetings = setTimeout(() => {
      let index = 0;
      const maxGreetings = hasVisited ? 1 : greetings.length;

      greetingInterval = setInterval(() => {
        index++;
        if (index < maxGreetings) {
          setGreetingIndex(index);
        } else {
          clearInterval(greetingInterval);
          if (!hasVisited) sessionStorage.setItem("hasVisited", "true");
          setTimeout(() => setMoveUp(true), 100);
          setTimeout(() => {
            onComplete?.();
          }, 200);
        }
      }, 150);
    }, delayBeforeGreetings);

    return () => {
      clearTimeout(startGreetings);
      if (greetingInterval) clearInterval(greetingInterval);
    };
  }, [onComplete, greetings.length]);

  return (
    <>
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
        className="fixed inset-0 bg-black z-40"
      />
      <motion.div
        initial={{ y: 0, scale: 1 }}
        exit={{
          y: "-100%",
          scale: 1.05,
          transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }}
        className="fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        role="status"
        aria-live="polite"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform, opacity'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-5xl mb-4 font-medium"
        >
          {greetings[greetingIndex]}
        </motion.div>

        <div className="absolute bottom-0 w-full h-6 shadow-lg" />
      </motion.div>
    </>
  );
};

export default Loader;
