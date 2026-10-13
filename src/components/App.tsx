"use client";

import { useEffect } from "react";
import { ScrollProvider } from "@/lib/scroll";
import { useRevealObserver } from "@/lib/hooks";
import Navigation from "@/components/Navigation";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";
import Certifications from "@/components/sections/Certifications";
import Experience from "@/components/sections/Experience";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";

export default function App() {
  useRevealObserver();

  // Re-scan for new .rv targets whenever the DOM settles after mount (covers
  // anything rendered slightly after initial paint, e.g. fonts swapping in).
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <ScrollProvider>
      <Navigation />
      <main id="top">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Achievements />
        <Contact />
      </main>
    </ScrollProvider>
  );
}
