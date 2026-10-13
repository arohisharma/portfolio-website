"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/data";
import { useElementScrollProgress, useReducedMotion } from "@/lib/hooks";

const N = ACHIEVEMENTS.length;
const TRAVEL_VW = (N - 1) * 62;

export default function Achievements() {
  const [wrapperRef, progress] = useElementScrollProgress<HTMLDivElement>();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      const viewport = track.parentElement;
      if (!viewport) return;
      setMaxTranslate(Math.max(0, track.scrollWidth - viewport.clientWidth));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const activeIndex = Math.min(N - 1, Math.round(progress * (N - 1)));

  return (
    <section id="achievements" className="achievements">
      <div
        className="wrapper"
        ref={wrapperRef}
        style={{ height: reducedMotion ? "auto" : `calc(100svh + ${TRAVEL_VW}vw)` }}
      >
        <div className={reducedMotion ? "pinned-static" : "pinned"}>
          <div className="wrap head-row">
            <div>
              <p className="tag rv">
                <b>06</b> — Achievements
              </p>
              <h2 className="heading section-title rv" style={{ ["--i" as string]: 1 }}>
                Proof in the <em>numbers</em>.
              </h2>
            </div>
            <div className="progress-bar" aria-hidden="true">
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>
          </div>

          <div className="viewport">
            <div
              className="track"
              ref={trackRef}
              style={
                reducedMotion
                  ? undefined
                  : { transform: `translateX(-${progress * maxTranslate}px)` }
              }
            >
              {ACHIEVEMENTS.map((a, i) => (
                <Card key={a.id} achievement={a} active={!reducedMotion && i === activeIndex} />
              ))}
              <div className="end-card">
                <span>and counting →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .achievements {
          position: relative;
        }
        .pinned,
        .pinned-static {
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(28px, 5vh, 56px);
          padding-block: clamp(60px, 10vh, 100px);
        }
        .pinned-static {
          position: static;
          height: auto;
        }
        .head-row {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .section-title {
          font-size: clamp(28px, 4vw, 46px);
          margin-top: 10px;
        }
        .progress-bar {
          width: 100%;
          max-width: var(--content-max);
          height: 2px;
          background: var(--line);
        }
        .progress-bar span {
          display: block;
          height: 100%;
          background: var(--ink);
          transform-origin: left;
          transform: scaleX(0);
        }

        .viewport {
          overflow: hidden;
          padding-left: var(--gutter);
        }
        .track {
          display: flex;
          gap: 24px;
          width: max-content;
          will-change: transform;
        }

        .end-card {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(200px, 20vw, 280px);
          height: clamp(260px, 36vh, 310px);
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 14px;
          color: var(--mute);
        }

        @media (max-width: 640px) {
          .pinned,
          .pinned-static {
            position: static;
            height: auto;
          }
          .viewport {
            overflow-x: auto;
            padding-bottom: 8px;
          }
          .track {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function Card({
  achievement,
  active,
}: {
  achievement: (typeof ACHIEVEMENTS)[number];
  active: boolean;
}) {
  const [ref, inView] = useCardInView();
  const value = useCountUp(achievement.value, inView);

  return (
    <div ref={ref} className={`card ${active ? "is-active" : ""}`}>
      <div className="card-top">
        <div className="logo-tile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={achievement.logo} alt="" width={40} height={40} />
        </div>
        <span className="card-index">
          {String(achievement.index).padStart(2, "0")} / {String(achievement.total).padStart(2, "0")}
        </span>
      </div>
      <div className="card-bottom">
        <div className="card-text">
          <p className="card-label">{achievement.label}</p>
          <p className="card-caption">{achievement.caption}</p>
          <p className="card-detail">{achievement.detail}</p>
        </div>
        <p className="card-number">
          {achievement.prefix}
          {value}
          {achievement.suffix}
        </p>
      </div>

      <style jsx>{`
        .card {
          flex-shrink: 0;
          width: clamp(340px, 40vw, 540px);
          height: clamp(260px, 36vh, 310px);
          background: var(--card);
          border-radius: 28px;
          box-shadow: inset 0 0 0 1px var(--line);
          padding: 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease);
        }
        .card.is-active {
          transform: translateY(-12px);
          box-shadow: inset 0 0 0 1px var(--line), 0 34px 60px -24px rgba(13, 13, 13, 0.28);
        }
        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .logo-tile {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.5s var(--ease);
        }
        .card.is-active .logo-tile {
          box-shadow: inset 0 0 0 1px var(--line), 0 0 0 8px rgba(13, 13, 13, 0.03);
        }
        .card-index {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 12px;
          color: var(--faint);
        }
        .card-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }
        .card-label {
          font-weight: 700;
          font-size: 18px;
        }
        .card-caption {
          font-size: 12.5px;
          color: var(--mute);
          margin-top: 4px;
          max-width: 28ch;
        }
        .card-detail {
          font-size: 11.5px;
          color: var(--faint);
          margin-top: 6px;
        }
        .card-number {
          font-weight: 800;
          font-size: clamp(36px, 5vw, 56px);
          letter-spacing: -0.03em;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

function useCardInView() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, inView] as const;
}

function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let rafId: number;
    const startTime = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      setValue(Math.round(eased * target));
      if (t < 1) rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [start, target, duration]);

  return value;
}
