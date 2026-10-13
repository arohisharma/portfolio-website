"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { prefersReducedMotion } from "./hooks";

type ScrollContextValue = {
  scrollToTarget: (target: string | HTMLElement, offset?: number) => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

/** Mounts a single Lenis instance for the whole app and drives it with
 * requestAnimationFrame. Disabled entirely under prefers-reduced-motion,
 * where the browser's native (instant) scrolling takes over. */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToTarget = (target: string | HTMLElement, offset = -24) => {
    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset, duration: 1.1 });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      if (prefersReducedMotion()) window.scrollTo(0, top);
    }
  };

  return (
    <ScrollContext.Provider value={{ scrollToTarget }}>{children}</ScrollContext.Provider>
  );
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    // Safe fallback so components can still be used outside the provider
    // (e.g. in isolated tests).
    return {
      scrollToTarget: (target: string | HTMLElement) => {
        const el =
          typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        el?.scrollIntoView({ behavior: "smooth" });
      },
    };
  }
  return ctx;
}
