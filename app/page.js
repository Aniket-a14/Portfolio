"use client";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Navbar from "./Components/Navbar";
import Body from "./Components/Body";
import About from "./Components/About";

const App = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
    }, 5200);
  }, []);

  return (
    <div className="relative">
      {!showContent && <Loader />}

      <div
        className={`transition-opacity transform duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        
        <div className="flex flex-col min-h-screen">

        <Navbar />
        <Body/>
        </div>
        
        <div className="bg-black">
          <About/>
        </div>
        
        
      </div>
    </div>
  );
};

export default App;

