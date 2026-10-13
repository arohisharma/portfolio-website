"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { useScroll } from "@/lib/scroll";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollToTarget } = useScroll();

  const [soundOn, setSoundOn] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  /** MP4 fallback is white-backed; WebM carries alpha and must not use multiply. */
  const [multiplyBlend, setMultiplyBlend] = useState(true);
  const wantsSoundRef = useRef(false);

  // Try sound-on autoplay first; fall back to muted autoplay if the browser
  // blocks it, and show a soft ping ring until the visitor interacts.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    async function attempt() {
      if (!video) return;
      try {
        video.muted = false;
        await video.play();
        if (!cancelled) {
          setSoundOn(true);
          wantsSoundRef.current = true;
        }
      } catch {
        if (cancelled || !video) return;
        video.muted = true;
        try {
          await video.play();
        } catch {
          /* ignore — will retry on interaction */
        }
        if (!cancelled) {
          setSoundOn(false);
          setAutoplayBlocked(true);
        }
      }
    }

    attempt();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncBlend = () => {
      const src = video.currentSrc || "";
      setMultiplyBlend(!src.includes(".webm"));
    };

    video.addEventListener("loadeddata", syncBlend);
    syncBlend();
    return () => video.removeEventListener("loadeddata", syncBlend);
  }, []);

  // Unlock sound on the visitor's first interaction anywhere on the page.
  useEffect(() => {
    if (!autoplayBlocked) return;

    function unlock() {
      const video = videoRef.current;
      if (!video) return;
      video.muted = false;
      video.play().catch(() => {});
      setSoundOn(true);
      setAutoplayBlocked(false);
      wantsSoundRef.current = true;
    }

    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("touchend", unlock, { once: true });
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("touchend", unlock);
    };
  }, [autoplayBlocked]);

  // Pause the clip (and so its voice) once the hero is mostly scrolled past;
  // resume automatically when it scrolls back into view.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 1] }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !soundOn;
    video.muted = !next;
    setSoundOn(next);
    wantsSoundRef.current = next;
    if (next) {
      video.play().catch(() => {});
      setAutoplayBlocked(false);
    }
  };

  return (
    <section id="hero" ref={sectionRef} className="hero" aria-label={`Introduction — ${PROFILE.name}`}>
      <div className="hero-inner wrap">
        <div className="media">
          <div className={`frame ${multiplyBlend ? "is-multiply" : ""}`}>
            <span className="ghost" aria-hidden="true">
              {PROFILE.firstName.toUpperCase()}
            </span>
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="auto"
              aria-label={`${PROFILE.name} giving a short self-introduction on camera`}
            >
              <source src="/hero/hero.webm" type="video/webm" />
              <source src="/hero/hero.mp4" type="video/mp4" />
            </video>

            <button
              type="button"
              className={`sound-btn ${autoplayBlocked ? "is-pinging" : ""}`}
              onClick={toggleSound}
              aria-label={soundOn ? "Mute introduction audio" : "Play introduction audio"}
            >
              {soundOn ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <rect x="2" y="1" width="3.4" height="12" rx="1" />
                  <rect x="8.6" y="1" width="3.4" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <path d="M2.5 1.2 12.3 7 2.5 12.8Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="copy">
          <p className="tag rv">
            <b>00</b> — {PROFILE.name}
          </p>
          <h1 className="heading hero-title rv" style={{ ["--i" as string]: 1 }}>
            {PROFILE.role.replace(/\.$/, "")}
            <span className="dot">.</span>
          </h1>

          <div className="cta-row rv" style={{ ["--i" as string]: 2 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => scrollToTarget("#work")}
            >
              Explore work
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => scrollToTarget("#contact")}
            >
              Let&rsquo;s talk
            </button>
            <a href={PROFILE.resumePath} download className="btn btn-secondary">
              Résumé ↓
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding-top: clamp(96px, 16vh, 160px);
          padding-bottom: 48px;
          overflow: hidden;
        }

        .hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(20px, 4vh, 40px);
          width: 100%;
        }

        .media {
          position: relative;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .ghost {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -52%);
          font-weight: 800;
          font-size: clamp(90px, 20vw, 260px);
          letter-spacing: -0.03em;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1.5px var(--line);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .frame {
          position: relative;
          height: min(96svh, 1040px);
          max-height: 70vh;
          aspect-ratio: 768 / 960;
        }

        .frame video {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .frame.is-multiply video {
          mix-blend-mode: multiply;
        }

        .sound-btn {
          position: absolute;
          right: 14px;
          bottom: 14px;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: var(--ink);
          color: var(--paper);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s var(--ease);
        }
        .sound-btn:hover {
          transform: scale(1.06);
        }
        .sound-btn.is-pinging::after {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1.5px solid var(--ink);
          opacity: 0;
          animation: ping 1.8s var(--ease) infinite;
        }
        @keyframes ping {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .copy {
          position: relative;
          z-index: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          max-width: 760px;
        }

        .hero-title {
          font-size: clamp(32px, 6vw, 68px);
        }
        .dot {
          color: var(--faint);
        }

        .cta-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
        }

        @media (max-width: 640px) {
          .frame {
            height: 62svh;
            max-height: 62svh;
          }
          .hero {
            padding-top: 120px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sound-btn.is-pinging::after {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
