import { Geist, Geist_Mono, Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
});

import { getMetadata } from "./lib/seo";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata = getMetadata();

import CustomCursor from "./Components/CustomCursor";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${playfair.variable} antialiased w-full bg-black`}
      >
        <CustomCursor />
        {/* Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Aniket Saha",
              url: "https://www.aniketdesign.in/",
              jobTitle: "Full Stack Developer & Coding Enthusiast",
              sameAs: [
                "https://github.com/Aniket-a14",
                "https://www.linkedin.com/in/aniketsaha2005/",
                "https://x.com/AniketSaha41043",
              ],
            }),
          }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Aniket Saha Portfolio",
              url: "https://www.aniketdesign.in/",
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
      </body>
    </html>
  );
}
