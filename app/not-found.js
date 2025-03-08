"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Terminal,
  AnimatedSpan,
  TypingAnimation,
} from "@/components/magicui/terminal";

export default function NotFound() {

  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 8200);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col bg-black  items-center justify-center h-screen">
      <Terminal>
        <TypingAnimation>&gt; npm found page@latest init</TypingAnimation>

        <AnimatedSpan delay={1500} className="text-green-500">
          <span>✔ Preflight checks.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={2000} className="text-green-500">
          <span>✔ Verifying framework. Found Next.js.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={2500} className="text-green-500">
          <span>✔ Tailwind CSS is installed.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={3000} className="text-red-500">
          <span>✘ Could not validate import alias.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={3500} className="text-red-500">
          <span>✘ Error: Writing components.json.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={4000} className="text-red-500">
          <span>✘ Error: Updating tailwind.config.ts</span>
        </AnimatedSpan>

        <AnimatedSpan delay={4500} className="text-red-500">
          <span>✘ Error: Updating app/globals.css</span>
        </AnimatedSpan>

        <AnimatedSpan delay={5000} className="text-green-500">
          <span>✔ Initiating lockdown.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={6000} className="text-blue-500">
          <span>ℹ Updated 1 file:</span>
          <span className="pl-2">Fixed all errors.</span>
        </AnimatedSpan>

        <TypingAnimation delay={6500}  className="text-muted-foreground">
          Returning to main menu.
        </TypingAnimation>
      </Terminal>
    </div>
  );
};

