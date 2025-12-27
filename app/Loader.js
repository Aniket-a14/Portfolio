"use client";
import React, { useEffect, useState } from "react";

const Loader = ({ onComplete }) => {
  const [moveUp, setMoveUp] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    "Hi", "Hola",
    "Bonjour", "Hallo", "Ciao", "こんにちは", "안녕하세요", "Olá", "Привет", "שלום",
    "Zdravstvuyte", "Hej", "Sawasdee", "Merhaba", "Aloha", "Xin chào",
    "Salaam", "Kamusta", "হ্যালো", "Namaste"
  ];

  useEffect(() => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      // If visited, skip animation and complete immediately
      onComplete?.();
      return;
    }

    // Mark as visited
    sessionStorage.setItem("hasVisited", "true");

    let index = 0;
    const greetingInterval = setInterval(() => {
      setTimeout(() => {
        setGreetingIndex(index);
        index++;
      }, 500);

      if (index >= greetings.length) {
        clearInterval(greetingInterval);
        setTimeout(() => setMoveUp(true), 100);

        // Signal completion after the visual transition
        setTimeout(() => {
          onComplete?.();
        }, 1000); // Wait for the upward animation to finish
      }
    }, 150);

    return () => clearInterval(greetingInterval);
  }, [onComplete]);

  // If we shouldn't show the loader (because we called onComplete immediately), we can return null
  // But to be safe and avoid hydration mismatch, let's just conditionally render content or use state
  // ideally we want to render it but it should be hidden instantly if hasVisited.
  // However, since we call onComplete immediately in the effect, the parent will likely unmount this component.
  // So we render it as normal for the initial mount.

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black z-50 
        ${moveUp ? "animate-upward" : "animate-curtainDown"} 
        shadow-[0_10px_20px_rgba(0,0,0,0.2)]
        transform ${moveUp ? 'scale-105' : 'scale-100'}
        transition-transform duration-500 ease-out`}
      role="status"
      aria-live="polite"
    >
      <div className="text-white text-5xl font-bold mb-4 animate-textDown">
        {greetings[greetingIndex]}
      </div>

      <div className="absolute bottom-0 w-full h-6 shadow-lg" />
    </div>
  );
};

export default Loader;
