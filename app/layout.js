import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata = {
  metadataBase: new URL("https://aniketdev.vercel.app/"), 
  title: "Aniket Saha - Portfolio",
  description: "Explore Aniket Saha's portfolio – a Full Stack Developer, Designer, and Machine Learning Enthusiast. Showcasing projects, skills, and experience.",
  openGraph: {
    title: "Aniket Saha - Portfolio",
    description: "Explore my projects, skills, and experience in development and machine learning.",
    url: "https://aniketdev.vercel.app/",
    siteName: "Aniket Saha's Portfolio",
    images: [
      {
        url: "/logo.jpeg", 
        width: 1200,
        height: 630,
        alt: "Preview of Aniket Saha's Portfolio Website",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Aniket Saha" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="Aniket Saha, Full Stack Developer, Portfolio, Projects, Skills" />
        <link rel="canonical" href="https://aniketdev.vercel.app/" />
        <meta name="description" content="Explore Aniket Saha's portfolio showcasing projects, skills, and experience." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Aniket Saha",
              url: "https://aniketdev.vercel.app/",
              jobTitle: "Full Stack Developer & Coding Enthusiast",
              sameAs: [
                "https://github.com/Aniket-a14",
                "https://www.linkedin.com/in/aniketsaha2005/", 
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
