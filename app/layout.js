import { Fraunces, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Press Edition type system. Fraunces is a variable font with an optical-size axis
// and a true italic (the previous Playfair setup loaded one weight and no italic,
// so every italic in the site was browser-synthesised). `display: swap` keeps text
// visible while fonts load; the loader also waits on document.fonts.ready.
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

import { getMetadata } from "@/lib/seo";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#ebe7dd",
};

export const metadata = getMetadata();

import CustomCursor from "@/components/CustomCursor";
import LenisProvider from "@/components/providers/LenisProvider";
import { TransitionProvider } from "@/components/providers/TransitionProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-ground">
      <head />
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body antialiased w-full bg-ground text-ink`}
        suppressHydrationWarning
      >
        <TransitionProvider>
          <LenisProvider>
            <CustomCursor />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Person",
                  name: "Aniket Saha",
                  url: "https://www.aniketdesign.in",
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
                  url: "https://www.aniketdesign.in",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://www.aniketdesign.in/#projects",
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
