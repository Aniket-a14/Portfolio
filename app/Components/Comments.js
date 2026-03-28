"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { Roboto } from "next/font/google";
import Footer from "./Footer";


const roboto = Roboto({
  weight: ["700"],
  subsets: ["latin"],
});

const reviews = [
  {
    name: "Snehasis",
    username: "@snehasis.18",
    body: "Very nice website. I like it. Very animating website. Looking like a wow",
    img: "/snehasis.jpg",
    alt: "Snehasis",
  },
  {
    name: "Ankit Kumar",
    username: "@Ankit_03",
    body: "Nice Website, Really appreciable.",
    img: "/ankit.jpg",
    alt: "Ankit Kumar",
  },
  {
    name: "Koushik",
    username: "@koushik.04",
    body: "Its Simple, Elegant and Classic. Just Fantastic...",
    img: "/koushik.jpg",
    alt: "Koushik",
  },
  {
    name: "Himanshu",
    username: "@himanshu720",
    body: "This is seriously impressive, and I’m loving it.",
    img: "/himanshu.jpg",
    alt: "Himanshu",
  },
  {
    name: "Arghya Dutta",
    username: "@Arghya.007",
    body: "Could be better, but still good.",
    img: "/arghya.jpg",
    alt: "Arghya Dutta",
  },
  {
    name: "Sachin",
    username: "@sachin.69",
    body: " I can’t even describe how I feel. Just wow.",
    img: "/sachin.jpg",
    alt: "Sachin",
  },
  {
    name: "Abhipsa",
    username: "@.abhipsaghosh.",
    body: "I love this website. It's so beautiful and I'm so happy to see it.",
    img: "/abhipsa.jpg",
    alt: "Abhipsa",
  }
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body, alt }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 justify-center items-center cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-100/[.1] bg-gray-100/[.07] hover:bg-gray-100/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="50" height="50" alt={alt} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">{name}</figcaption>
          <p className="text-xs font-medium text-white/60">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-white">{body}</blockquote>
    </figure>
  );
};



export function Comments() {
  return (
    <>
      <section className="bg-black pb-10 px-6 md:px-12 lg:px-20" id="testimonials">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-white/10 pt-10 mb-10">
            <p className="text-white/40 font-roboto text-sm tracking-[0.2em] uppercase mb-4">
              Testimonials
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight">
              What people say <br className="hidden md:block" /> about my work
            </h2>
          </div>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden pb-12">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Comments;
