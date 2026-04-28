"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <section className="bg-black py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden" id="newsletter">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-8 md:p-16 lg:p-20 backdrop-blur-xl relative overflow-hidden group">
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <div className="size-1.5 rounded-full bg-white/40 animate-pulse" />
              <span className="text-white/40 font-roboto text-xs tracking-[0.4em] uppercase">
                The Inner Circle
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-playfair text-4xl md:text-5xl lg:text-6xl text-white/90 mb-6 leading-tight"
            >
              Stay ahead of <br /> <span className="italic text-white/50">the curve.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 font-roboto text-sm md:text-base max-w-lg mx-auto leading-relaxed"
            >
              Get exclusive insights on full-stack development, AI innovations, and premium UI/UX design directly in your inbox. No spam, ever.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                disabled={status === "loading" || status === "success"}
                className="w-full bg-white/[0.03] border border-white/10 rounded-full py-5 px-8 text-white font-roboto text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-500 placeholder:text-white/10 disabled:opacity-50"
              />
              
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black rounded-full font-roboto text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              >
                {status === "loading" ? (
                  <div className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Join</span>
                    <ArrowRight className="size-3" />
                  </>
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2 text-green-400 text-xs font-roboto tracking-wide"
                >
                  <CheckCircle2 className="size-3" />
                  <span>Welcome to the circle! Check your inbox.</span>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2 text-red-400 text-xs font-roboto tracking-wide"
                >
                  <AlertCircle className="size-3" />
                  <span>{message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
