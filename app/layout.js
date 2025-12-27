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

export const metadata = {
  metadataBase: new URL("https://aniketdev.vercel.app/"),
  title: "Aniket Saha - Portfolio",
  description: "Explore Aniket Saha's portfolio – a Full Stack Developer, Designer, and Machine Learning Enthusiast. Showcasing projects, skills, and experience.",
  keywords: ["Aniket Saha", "Full Stack Developer", "Portfolio", "Projects", "Skills"],
  authors: [{ name: "Aniket Saha" }],
  viewport: "width=device-width, initial-scale=1.0",
  robots: {
    index: true,
    follow: true,
  },
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${playfair.variable} antialiased`}
      >
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
