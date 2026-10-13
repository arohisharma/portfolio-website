"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { useReducedMotion } from "@/lib/hooks";

const WHAT_I_AM = [
  "Frontend Software Engineer — 5+ years in React.js, Next.js, Redux & TypeScript",
  "MCA, Bhilai Institute of Technology, Durg (2021) · B.Sc CS, St. Thomas College (2019)",
  "Core contributor to Booking Zone — 100+ clients, 20,000+ users, $2B+ in payments",
  "On secondment at SBI Cards, supporting Unify — a DPDP Act consent platform",
  "Comfortable across AWS Amplify, CodePipeline, CloudWatch & production triage",
];

export default function About() {
  const reducedMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);
  const swingRef = useRef<HTMLDivElement | null>(null);

  // Damped-spring pendulum: idle sway as a baseline target, pointer velocity
  // adds impulses on top, a spring pulls the angle back toward the target.
  useEffect(() => {
    if (reducedMotion) return;
    const el = swingRef.current;
    if (!el) return;

    let angle = 0;
    let velocity = 0;
    let lastX: number | null = null;
    let lastT = performance.now();
    let rafId: number;

    const SPRING = 10; // rad/s^2 per rad of error
    const DAMPING = 3.2;
    const IDLE_AMPLITUDE = 2.2; // degrees
    const IDLE_FREQ = (Math.PI * 2) / 4200; // ms

    function onPointerMove(e: PointerEvent) {
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      if (lastX !== null) {
        const dx = e.clientX - lastX;
        const speed = dx / dt; // px/ms
        velocity += Math.max(-14, Math.min(14, speed * 10));
      }
      lastX = e.clientX;
      lastT = now;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    function tick(now: number) {
      const dt = Math.min(0.05, (now - lastT) / 1000) || 0.016;
      const target = Math.sin(now * IDLE_FREQ) * IDLE_AMPLITUDE;
      const accel = (target - angle) * SPRING - velocity * DAMPING;
      velocity += accel * dt;
      angle += velocity * dt;
      if (el) el.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reducedMotion]);

  const links = [
    { label: "Résumé", href: PROFILE.resumePath, download: true },
    { label: "GitHub", href: PROFILE.github },
    { label: "LinkedIn", href: PROFILE.linkedin },
  ];

  return (
    <section id="about" className="about section">
      <div className="wrap about-grid">
        <div className="col bio">
          <p className="tag rv">
            <b>01</b> — About
          </p>
          <h2 className="heading about-title rv" style={{ ["--i" as string]: 1 }}>
            Hi, I&rsquo;m <em>{PROFILE.firstName}</em>.
          </h2>
          <p className="lede rv" style={{ ["--i" as string]: 2 }}>
            {PROFILE.resumeSummary}
          </p>
          <p className="lede muted rv" style={{ ["--i" as string]: 3 }}>
            {PROFILE.resumeSummaryExtra}
          </p>

          <div className="links rv" style={{ ["--i" as string]: 4 }}>
            {links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                download={l.download}
                target={l.download ? undefined : "_blank"}
                rel={l.download ? undefined : "noreferrer"}
                className={i === 0 ? "btn btn-primary" : "btn btn-secondary"}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="col lanyard-col" aria-hidden={false}>
          <div className="lanyard">
            <div className="strap-top" />
            <div ref={swingRef} className="swing">
              <div className="strap-bottom" aria-hidden="true">
                <div className="strap-scroll">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i}>
                      {PROFILE.name.toUpperCase()} · {PROFILE.role.toUpperCase()} ·{" "}
                    </span>
                  ))}
                </div>
              </div>
              <div className="clip" aria-hidden="true" />

              <div
                className={`card-outer ${isFlipped ? "is-flipped" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={isFlipped}
                aria-label="Developer ID card — press Enter or Space to flip"
                onClick={() => setIsFlipped((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsFlipped((v) => !v);
                  }
                }}
              >
                <div className="card-inner">
                  <div className="card-face card-front">
                    <div className="band">DEVELOPER ID</div>
                    <div className="photo-ring">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/portrait-bust.webp" alt={`${PROFILE.name} headshot`} />
                    </div>
                    <p className="id-name">{PROFILE.name}</p>
                    <p className="id-role">{PROFILE.role}</p>
                    <dl className="id-rows">
                      <div>
                        <dt>ID No.</dt>
                        <dd>FE&middot;2021</dd>
                      </div>
                      <div>
                        <dt>Dept.</dt>
                        <dd>Frontend Engineering</dd>
                      </div>
                      <div>
                        <dt>Valid till</dt>
                        <dd>2021</dd>
                      </div>
                    </dl>
                    <div className="id-bottom">
                      <div className="barcode" aria-hidden="true">
                        {Array.from({ length: 28 }).map((_, i) => (
                          <span key={i} style={{ ["--w" as string]: (i % 3) + 1 }} />
                        ))}
                      </div>
                      <div className="holo" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="card-face card-back">
                    <p className="back-title">What I am</p>
                    <ul className="back-list">
                      {WHAT_I_AM.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <p className="signature">{PROFILE.name}</p>
                    <p className="found-line">
                      If found, say hello · {PROFILE.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col facts">
          <p className="tag rv">
            <b>—</b> Quick facts
          </p>
          <dl className="fact-rows rv" style={{ ["--i" as string]: 1 }}>
            <div>
              <dt>Education</dt>
              <dd>MCA · Bhilai Institute of Technology, Durg · 2021</dd>
            </div>
            <div>
              <dt>Current role</dt>
              <dd>Business Analyst · SBI Cards (Secondment)</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              </dd>
            </div>
          </dl>
          <blockquote className="quote rv" style={{ ["--i" as string]: 2 }}>
            &ldquo;{PROFILE.quote}&rdquo;
          </blockquote>
        </div>
      </div>

      <style jsx>{`
        .about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px minmax(0, 1fr);
          gap: clamp(24px, 4vw, 56px);
          align-items: stretch;
        }
        .col {
          display: flex;
          flex-direction: column;
        }
        .bio {
          justify-content: center;
          gap: 18px;
        }
        .about-title {
          font-size: clamp(30px, 4vw, 46px);
        }
        .lede {
          font-size: 16px;
          line-height: 1.65;
          color: var(--ink-2);
          max-width: 46ch;
        }
        .lede.muted {
          color: var(--mute);
        }
        .links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }

        .lanyard-col {
          align-items: center;
          justify-content: flex-start;
          overflow: visible;
        }
        .lanyard {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .strap-top {
          width: 6px;
          height: 36px;
          background: var(--ink-2);
          border-radius: 3px;
        }
        .swing {
          transform-origin: top center;
          display: flex;
          flex-direction: column;
          align-items: center;
          will-change: transform;
        }
        .strap-bottom {
          width: 30px;
          height: 150px;
          background: var(--ink);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          display: flex;
          justify-content: center;
        }
        .strap-scroll {
          position: absolute;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          color: var(--paper);
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 8.5px;
          letter-spacing: 0.08em;
          white-space: nowrap;
          animation: strapScroll 9s linear infinite;
        }
        @keyframes strapScroll {
          from {
            transform: translateY(0%);
          }
          to {
            transform: translateY(-50%);
          }
        }
        .clip {
          width: 42px;
          height: 16px;
          background: linear-gradient(180deg, #cfcdc8, #8f8d89);
          border-radius: 4px;
          margin-top: -2px;
          box-shadow: inset 0 0 0 1px rgba(13, 13, 13, 0.15);
        }

        .card-outer {
          margin-top: 6px;
          width: min(300px, 78vw);
          height: 404px;
          perspective: 1400px;
          border-radius: 24px;
          cursor: pointer;
        }
        .card-outer:hover .card-inner,
        .card-outer.is-flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s var(--ease);
          transform-style: preserve-3d;
        }
        .card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 24px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line), 0 30px 60px -30px rgba(13, 13, 13, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
          padding: 26px 22px;
          justify-content: space-between;
        }

        .band {
          background: var(--ink);
          color: var(--paper);
          text-align: center;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          padding: 10px 0;
        }
        .photo-ring {
          width: 128px;
          height: 156px;
          margin: 22px auto 10px;
          border-radius: 14px;
          padding: 4px;
          background: linear-gradient(160deg, var(--soft), var(--card) 60%);
          box-shadow: 0 10px 24px -14px rgba(13, 13, 13, 0.35);
          overflow: hidden;
          transition: transform 0.4s var(--ease);
        }
        .card-outer:hover .photo-ring {
          transform: scale(1.035);
        }
        .photo-ring img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }
        .id-name {
          text-align: center;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: -0.01em;
        }
        .id-role {
          text-align: center;
          font-size: 12px;
          color: var(--mute);
          margin-bottom: 14px;
        }
        .id-rows {
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 11.5px;
        }
        .id-rows > div {
          display: flex;
          justify-content: space-between;
          border-top: 1px dashed var(--line);
          padding-top: 4px;
        }
        .id-rows dt {
          color: var(--faint);
        }
        .id-rows dd {
          color: var(--ink-2);
          font-weight: 500;
        }
        .id-bottom {
          margin-top: auto;
          padding: 14px 20px 18px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .barcode {
          display: flex;
          align-items: flex-end;
          gap: 1.5px;
          height: 24px;
        }
        .barcode span {
          display: inline-block;
          width: 2px;
          height: calc(var(--w) * 7px + 3px);
          background: var(--ink-2);
        }
        .holo {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #e4e4e4, #fafafa, #d8d8d8, #f2f2f2, #e4e4e4);
          box-shadow: inset 0 0 0 1px var(--line);
        }

        .back-title {
          font-weight: 700;
          font-size: 14px;
          letter-spacing: -0.01em;
        }
        .back-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 12.5px;
          line-height: 1.45;
          color: var(--ink-2);
        }
        .back-list li {
          padding-left: 14px;
          position: relative;
        }
        .back-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--faint);
        }
        .signature {
          font-family: var(--font-instrument-serif), serif;
          font-style: italic;
          font-size: 24px;
          color: var(--ink-2);
          border-top: 1px dashed var(--line);
          padding-top: 10px;
        }
        .found-line {
          font-size: 10.5px;
          color: var(--faint);
        }

        .facts {
          justify-content: center;
          gap: 18px;
        }
        .fact-rows {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .fact-rows > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--line);
        }
        .fact-rows dt {
          font-size: 11.5px;
          color: var(--faint);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .fact-rows dd {
          font-size: 14.5px;
          color: var(--ink-2);
          font-weight: 500;
          word-break: break-word;
        }
        .fact-rows dd a:hover {
          text-decoration: underline;
        }
        .quote {
          font-family: var(--font-instrument-serif), serif;
          font-style: italic;
          font-size: 19px;
          line-height: 1.5;
          color: var(--ink-2);
        }

        @media (max-width: 980px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
          .lanyard-col {
            order: -1;
            margin-bottom: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .strap-scroll {
            animation: none;
          }
          .card-inner {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
