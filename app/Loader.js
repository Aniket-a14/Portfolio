"use client";
import React, { useEffect, useState } from "react";

const Loader = ({ onComplete }) => {
  const [moveUp, setMoveUp] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    "Hi", "Hola",
    "Bonjour", "Hallo", "Ciao", "Olá", "Привет","Zdravstvuyte", "Hej", "Sawasdee", "Merhaba", "Aloha", "Xin chào", "Salaam", "হ্যালো", "Namaste"
  ];

  useEffect(() => {
    const delayBeforeGreetings = 800;
    let greetingInterval;

    const startGreetings = setTimeout(() => {
      let index = 0;
      
      greetingInterval = setInterval(() => {
        index++;
        if (index < greetings.length) {
          setGreetingIndex(index);
        } else {
          clearInterval(greetingInterval);
          setTimeout(() => setMoveUp(true), 150);
          setTimeout(() => {
            onComplete?.();
          }, 900); 
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
      <div className="fixed inset-0 bg-[#e8e6e1] z-40" />
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black z-50 
          ${moveUp ? "animate-upward" : "animate-curtainDown"} 
          shadow-[0_4px_30px_rgba(0,0,0,0.5)]`}
        role="status"
        aria-live="polite"
        style={{ 
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: `translate3d(0, 0, 0) scale(${moveUp ? 1.05 : 1})`,
          transition: 'transform 700ms ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="text-white text-5xl font-bold mb-4 animate-textDown">
          {greetings[greetingIndex]}
        </div>

        <div className="absolute bottom-0 w-full h-6 shadow-lg" />
      </div>
    </>
  );
};

export default Loader;
