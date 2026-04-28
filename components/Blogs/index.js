"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";

const BlogCard = ({ blog, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full"
    >
      <a 
        href={blog.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col h-full bg-white/[0.02] border border-white/[0.08] rounded-sm overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.12]"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.02] border-b border-white/[0.05]">
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/[0.01]">
               <span className="text-white/5 font-playfair text-4xl uppercase tracking-widest">Medium</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight className="size-4 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 lg:p-7">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="size-3 text-white/20" strokeWidth={1} />
            <span className="text-[10px] font-roboto tracking-[0.2em] uppercase text-white/30">
              {new Date(blog.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h3 className="text-xl font-medium text-white/90 leading-tight mb-4 group-hover:text-white transition-colors duration-500 line-clamp-2 uppercase font-roboto tracking-tight">
            {blog.title}
          </h3>
          
          <p className="text-[14px] text-white/40 leading-relaxed line-clamp-2 mb-6 font-light font-roboto">
            {blog.snippet}
          </p>

          <div className="mt-auto flex items-center gap-2 text-white/20 group-hover:text-white/60 transition-all duration-500">
            <span className="text-[10px] font-roboto tracking-[0.3em] uppercase">
              Read More
            </span>
            <ChevronRight className="size-3 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1} />
          </div>
        </div>
      </a>
    </motion.div>
  );
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setBlogs(data.slice(0, 3)); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="bg-black pt-0 pb-20 px-6 md:px-12 lg:px-20 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-white/5 rounded-full mb-6" />
            <div className="h-16 w-96 bg-white/5 rounded-sm mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-white/[0.02] rounded-sm border border-white/[0.08]" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-black pt-0 pb-24 px-6 md:px-12 lg:px-20 relative" id="blogs">
      <div className="max-w-6xl mx-auto">
        <header className="border-t border-white/10 pt-10 mb-16">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-white/40 font-roboto text-sm tracking-[0.2em] uppercase">
              Recent Writings
            </p>
            <span className="text-white/20 font-roboto text-sm tracking-wider">
              ({String(blogs.length).padStart(2, "0")})
            </span>
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight">
            Latest from Medium
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <BlogCard key={index} blog={blog} index={index} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <a 
            href={`https://medium.com/@aniketsahaworkspace`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-white/40 hover:text-white transition-all duration-500 font-roboto text-xs uppercase tracking-[0.3em] py-4 px-8 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20"
          >
            View All Articles
            <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
