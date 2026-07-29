import { Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Geist and Geist Mono were loaded here but never applied: neither
// `--font-geist-sans` nor `--font-geist-mono` is referenced by any stylesheet
// or Tailwind mapping, and `font-mono` resolves to the system stack. Dropping
// them removes two font families from every page load.
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

import { getMetadata } from "@/lib/seo";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#000000",
};

export const metadata = getMetadata();

import CustomCursor from "@/components/CustomCursor";
import LenisProvider from "@/components/providers/LenisProvider";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import MobileToast from "@/components/MobileToast";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-black">
      <head />
      <body
        className={`${roboto.variable} ${playfair.variable} antialiased w-full bg-black`}
        suppressHydrationWarning
      >
        <TransitionProvider>
          <LenisProvider>
            <CustomCursor />
            <MobileToast />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Person",
                  name: "Aniket Saha",
                  url: "https://aniketdesign.in",
                  jobTitle: "Full Stack Developer & Coding Enthusiast",
                  sameAs: [
                    "https://github.com/Aniket-a14",
                    "https://www.linkedin.com/in/aniketsaha2005/",
                    "https://x.com/AniketSaha41043",
                  ],
                }),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  name: "Aniket Saha Portfolio",
                  url: "https://aniketdesign.in",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://aniketdesign.in/#projects",
                    "query-input": "required name=search_term_string",
                  },
                }),
              }}
            />
            {children}
            <Analytics />
            <SpeedInsights />
          </LenisProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
