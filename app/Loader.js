"use client";
import React, { useEffect, useState } from "react";

const Loader = () => {
  const [moveUp, setMoveUp] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    "Hi", "Hola", 
    "Bonjour", "Hallo", "Ciao", "こんにちは", "안녕하세요", "Olá", "Привет", "שלום", 
    "Zdravstvuyte", "Hej", "Sawasdee", "Merhaba", "Aloha", "Xin chào", 
    "Salaam","Kamusta", "হ্যালো", "Namaste"
  ];

  useEffect(() => {
    let index = 0;
    const greetingInterval = setInterval(() => {
      setTimeout(() => {
        setGreetingIndex(index);
        index++;
      }, 500);

      

      if (index >= greetings.length) {
        clearInterval(greetingInterval);
        setTimeout(() => setMoveUp(true), 100);
      }
    }, 150); 

    return () => clearInterval(greetingInterval);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black z-50 
        ${moveUp ? "animate-upward" : "animate-curtainDown"} 
        shadow-[0_10px_20px_rgba(0,0,0,0.2)]
        transform ${moveUp ? 'scale-105' : 'scale-100'}
        transition-transform duration-500 ease-out`}
    >
      <div className="text-white text-5xl font-bold mb-4 animate-textDown">
        {greetings[greetingIndex]}
      </div>

      <div className="absolute bottom-0 w-full h-6 shadow-lg" />
    </div>
  );
};

export default Loader;
