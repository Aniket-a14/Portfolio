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
  },
  {
    name: "Koushik",
    username: "@koushik.04",
    body: "Its Simple, Elegant and Classic. Just Fantastic...",
    img: "/koushik.jpg",
  },
  {
    name: "Himanshu",
    username: "@himanshu720",
    body: "This is seriously impressive, and I’m loving it.",
    img: "/himanshu.jpg",
  },
  {
    name: "Sachin",
    username: "@sachin.69",
    body: " I can’t even describe how I feel. Just wow.",
    img: "/sachin.jpg",
  },
  {
    name: "Arghya",
    username: "@Arghya.007",
    body: "Could be better, but still good.",
    img: "/arghya.jpg",
  },
  {
    name: "Ankit",
    username: "@Ankit_03",
    body: "Nice Website, Really appreciable.",
    img: "/ankit.jpg",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
    return (
      <figure
        className={cn(
          "relative h-full w-64 justify-center items-center cursor-pointer overflow-hidden rounded-xl border p-4",
          "border-gray-100/[.1] bg-gray-100/[.07] hover:bg-gray-100/[.15]",
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img className="rounded-full" width="50" height="50" alt={name} src={img} />
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
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden pt-8 pb-12" id="testimonials">
        <h1 className={`${roboto.className} text-white text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-center mb-12`}>WHAT PEOPLE SAY</h1>
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
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 "></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 "></div>
    </div>
    <Footer />
    </>
  );
}

export default Comments;
