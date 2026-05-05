"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTransitionContext } from "@/components/providers/TransitionProvider";

export default function ContactHub() {
  const { navigate } = useTransitionContext();
  const [formType, setFormType] = useState("general");
  const [formStatus, setFormStatus] = useState("idle");
  const [honeypot, setHoneypot] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");

  const budgetOptions = ["< $1k", "$1k - 5k", "$5k - 10k", "$10k+"];
  const timelineOptions = ["ASAP", "1-3 months", "3-6 months", "Flexible"];

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (honeypot) {
      console.warn("Honeypot filled. Bot detected.");
      setFormStatus("success");
      return;
    }

    setFormStatus("loading");
    
    const formData = new FormData(e.target);
    try {
      const response = await fetch("https://formspree.io/f/mqegqqaz", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <main className="pt-12 pb-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
         
         <div className="mb-8">
           <button 
             onClick={() => navigate('/', '• Home', 'up')}
             className="text-white/40 hover:text-white transition-colors font-roboto text-sm uppercase tracking-widest flex items-center gap-2 w-fit focus:outline-none"
           >
             <ArrowUpRight size={16} className="-rotate-90" />
             Back to Home
           </button>
         </div>

         <div className="mb-20">
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white/90 leading-[1.1] font-normal mb-8">
              Let&apos;s build something <br />
              <span className="italic text-white/50">remarkable</span> together.
            </h1>
            <div className="w-full h-px bg-white/10"></div>
         </div>

         <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 w-full">
            
            <div className="w-full lg:w-1/3 flex flex-col gap-14 font-roboto shrink-0">
               <div>
                 <h3 className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">Direct Contact</h3>
                 <a href="mailto:aniketsahaworkspace@gmail.com" className="text-lg md:text-xl font-light hover:text-white transition-colors">
                   aniketsahaworkspace@gmail.com
                 </a>
               </div>

               <div>
                 <h3 className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">Digital Presence</h3>
                 <div className="flex flex-col gap-4 text-lg md:text-xl font-light">
                   <a href="#" className="flex items-center gap-3 w-fit group">
                      <span className="group-hover:text-white/70 transition-colors">X (Twitter)</span>
                      <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                   </a>
                   <a href="#" className="flex items-center gap-3 w-fit group">
                      <span className="group-hover:text-white/70 transition-colors">LinkedIn</span>
                      <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                   </a>
                   <a href="#" className="flex items-center gap-3 w-fit group">
                      <span className="group-hover:text-white/70 transition-colors">GitHub</span>
                      <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                   </a>
                 </div>
               </div>

               <div>
                 <h3 className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">Current Location</h3>
                 <p className="text-lg md:text-xl font-light text-white/80">India</p>
                 <p className="text-white/40 text-sm mt-1">Available for global freelance opportunities</p>
               </div>
            </div>

            <div className="w-full lg:w-2/3">
               
               {formStatus !== 'success' && (
                 <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-16 md:mb-24">
                    <button 
                      type="button"
                      onClick={() => setFormType('general')}
                      className={`text-3xl md:text-5xl font-playfair transition-all duration-700 ${formType === 'general' ? 'text-white' : 'text-white/20 hover:text-white/50'}`}
                    >
                      General Inquiry
                    </button>
                    <span className="text-white/10 text-3xl md:text-5xl font-light font-playfair">/</span>
                    <button 
                      type="button"
                      onClick={() => setFormType('project')}
                      className={`text-3xl md:text-5xl font-playfair transition-all duration-700 ${formType === 'project' ? 'text-white' : 'text-white/20 hover:text-white/50'}`}
                    >
                      Project Proposal
                    </button>
                 </div>
               )}

               {/* Form */}
               <form onSubmit={handleFormSubmit} className="flex flex-col w-full relative">
                  {formStatus === 'success' ? (
                     <div className="h-[400px] flex flex-col items-center justify-center p-8 border border-white/[0.08] lg:-mt-12 rounded-[2rem] relative overflow-hidden group">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white mb-6 relative z-10 border border-white/10">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-white/90 font-playfair text-3xl md:text-4xl mb-4 relative z-10 text-center">Transmission Received</h3>
                        <p className="text-white/40 font-roboto text-lg text-center relative z-10 max-w-md font-light">
                          Thank you for reaching out. I&apos;ll get back to you within 24 hours to chart our next course.
                        </p>
                     </div>
                  ) : (
                     <div className="flex flex-col gap-12 lg:gap-16">
                        {/* Honeypot field - Hidden from users */}
                        <input
                           type="text"
                           name="b_phone"
                           value={honeypot}
                           onChange={(e) => setHoneypot(e.target.value)}
                           style={{ display: 'none' }}
                           tabIndex="-1"
                           autoComplete="off"
                        />

                        {/* Shared Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                           <div className="relative group flex flex-col-reverse">
                              <input 
                                type="text" name="name" id="name" required
                                className="peer w-full bg-transparent border-b border-white/20 pb-4 text-white/90 text-2xl md:text-3xl font-roboto font-light focus:outline-none focus:border-white transition-colors placeholder-transparent rounded-none"
                                placeholder="Your Name" 
                              />
                              <label htmlFor="name" className="text-white/30 text-[10px] md:text-xs font-roboto uppercase tracking-[0.3em] mb-4 transition-colors peer-focus:text-white/60">
                                What&apos;s your name? *
                              </label>
                           </div>
                           <div className="relative group flex flex-col-reverse">
                              <input 
                                type="email" name="email" id="email" required
                                className="peer w-full bg-transparent border-b border-white/20 pb-4 text-white/90 text-2xl md:text-3xl font-roboto font-light focus:outline-none focus:border-white transition-colors placeholder-transparent rounded-none"
                                placeholder="Email Address" 
                              />
                              <label htmlFor="email" className="text-white/30 text-[10px] md:text-xs font-roboto uppercase tracking-[0.3em] mb-4 transition-colors peer-focus:text-white/60">
                                How can I reach you? *
                              </label>
                           </div>
                        </div>

                        <div className={`flex flex-col gap-12 lg:gap-16 overflow-hidden transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${formType === 'project' ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none !mt-0 !mb-0'}`}>
                           <div>
                              <label className="block text-white/30 text-[10px] md:text-xs font-roboto uppercase tracking-[0.3em] mb-6">
                                What is your estimated budget?
                              </label>
                              <input type="hidden" name="budget" value={budget} required={formType === 'project'} />
                              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                                {budgetOptions.map(opt => (
                                  <button 
                                    key={opt}
                                    type="button" 
                                    onClick={() => setBudget(opt)}
                                    className={`text-xl md:text-3xl font-roboto transition-all duration-500 ${budget === opt ? 'text-white font-medium' : 'text-white/20 font-light hover:text-white/60'}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                           </div>

                           <div>
                              <label className="block text-white/30 text-[10px] md:text-xs font-roboto uppercase tracking-[0.3em] mb-6">
                                Expected formulation timeline?
                              </label>
                              <input type="hidden" name="timeline" value={timeline} required={formType === 'project'} />
                              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                                {timelineOptions.map(opt => (
                                  <button 
                                    key={opt}
                                    type="button" 
                                    onClick={() => setTimeline(opt)}
                                    className={`text-xl md:text-3xl font-roboto transition-all duration-500 ${timeline === opt ? 'text-white font-medium' : 'text-white/20 font-light hover:text-white/60'}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                           </div>
                        </div>

                        <div className="relative group flex flex-col-reverse mt-2">
                           <textarea 
                             name="message" id="message" required rows="3"
                             className="peer w-full bg-transparent border-b border-white/20 pb-4 text-white/90 text-xl md:text-2xl font-roboto font-light focus:outline-none focus:border-white transition-colors placeholder-transparent resize-none leading-relaxed rounded-none"
                             placeholder={formType === 'project' ? "Project specifics..." : "Your message..."}
                           ></textarea>
                           <label htmlFor="message" className="text-white/30 text-[10px] md:text-xs font-roboto uppercase tracking-[0.3em] mb-6 transition-colors peer-focus:text-white/60">
                             {formType === 'project' ? "Tell me about your project details *" : "How can I help you? *"}
                           </label>
                        </div>

                        {formStatus === 'error' && (
                          <div className="flex items-center gap-3 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg w-fit mt-4 border border-red-400/20">
                             <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <p className="text-sm font-roboto tracking-wide">Transmission failed. Please try again or use direct email.</p>
                          </div>
                        )}

                        <div className="mt-8">
                           <button 
                             type="submit" disabled={formStatus === 'loading'}
                             className="group relative flex items-center gap-6 w-fit h-20 overflow-hidden transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
                           >
                             <span className="font-playfair font-normal text-3xl md:text-5xl text-white transition-all duration-500">
                                {formStatus === 'loading' ? "Processing..." : "Commence"}
                             </span>
                             {formStatus === 'loading' ? (
                               <svg className="animate-spin h-8 w-8 text-white ml-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                             ) : (
                               <ArrowUpRight size={44} strokeWidth={1} className="text-white group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:rotate-12 transition-all duration-500" />
                             )}
                           </button>
                        </div>
                     </div>
                  )}
               </form>

            </div>
         </div>
      </main>
    </div>
  );
}
