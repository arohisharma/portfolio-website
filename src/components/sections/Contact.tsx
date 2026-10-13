"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { useScroll } from "@/lib/scroll";

const HEADING_LINES: { text: string; accent?: boolean }[][] = [
  [{ text: "Let's build" }],
  [{ text: "something " }, { text: "together.", accent: true }],
];
const CIRCLE_TEXT = "SAY HELLO · SAY HELLO · ";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const { scrollToTarget } = useScroll();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — link below still works */
    }
  };

  return (
    <>
      <section id="contact" className="contact section">
        <div className="wrap">
          <p className="tag rv">
            <b>07</b> — Contact
          </p>

          <h2 className="heading contact-title rv" style={{ ["--i" as string]: 1 }}>
            {HEADING_LINES.map((segments, li) => (
              <span className="title-line" key={li}>
                {segments.map((segment, si) => (
                  <span className={segment.accent ? "accent-word" : undefined} key={si} aria-hidden="true">
                    {segment.text.split("").map((ch, i) => (
                      <span className="letter" key={i}>
                        {ch === " " ? "\u00A0" : ch}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
            <span className="sr-only">
              {HEADING_LINES.map((segs) => segs.map((s) => s.text).join("")).join(" ")}
            </span>
          </h2>

          <div className="contact-grid">
            <div className="contact-main rv" style={{ ["--i" as string]: 2 }}>
              <div className="email-row">
                <a href={`mailto:${PROFILE.email}`} className="email-link">
                  {PROFILE.email}
                </a>
                <button type="button" className="chip copy-chip" onClick={copyEmail}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
                <span className="sr-only" role="status" aria-live="polite">
                  {copied ? "Email address copied to clipboard" : ""}
                </span>
              </div>

              <div className="contact-links">
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
                <a href={PROFILE.github} target="_blank" rel="noreferrer">
                  {PROFILE.githubLabel}
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                  {PROFILE.linkedinLabel}
                </a>
              </div>
            </div>

            <div className="badge-wrap rv" style={{ ["--i" as string]: 3 }}>
              <SpinBadge />
            </div>
          </div>
        </div>

        <style jsx>{`
          .contact-title {
            font-size: clamp(42px, 9vw, 110px);
            margin-bottom: clamp(40px, 7vh, 80px);
          }
          .title-line {
            display: block;
          }
          .letter {
            display: inline-block;
            transition: transform 0.15s var(--ease);
          }
          .accent-word {
            font-family: var(--font-instrument-serif), serif;
            font-style: italic;
            font-weight: 400;
            color: var(--mute);
          }
          .letter:hover {
            animation: hop 0.5s var(--ease);
          }
          @keyframes hop {
            0% {
              transform: translateY(0);
            }
            35% {
              transform: translateY(-0.22em);
            }
            100% {
              transform: translateY(0);
            }
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
          }

          .contact-grid {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 32px;
            flex-wrap: wrap;
          }
          .contact-main {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .email-row {
            display: flex;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
          }
          .email-link {
            font-size: clamp(22px, 3.4vw, 34px);
            font-weight: 600;
            letter-spacing: -0.02em;
            text-decoration: underline;
            text-underline-offset: 6px;
            text-decoration-color: var(--line);
          }
          .email-link:hover {
            text-decoration-color: var(--ink);
          }
          .copy-chip {
            transition: background-color 0.3s var(--ease), color 0.3s var(--ease);
          }
          .copy-chip:hover {
            background: var(--ink);
            color: var(--paper);
            box-shadow: none;
          }
          .contact-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 28px;
            font-size: 14.5px;
            color: var(--mute);
          }
          .contact-links a:hover {
            color: var(--ink);
            text-decoration: underline;
          }

          .badge-wrap {
            flex-shrink: 0;
          }

          @media (prefers-reduced-motion: reduce) {
            .letter:hover {
              animation: none;
            }
          }
        `}</style>
      </section>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <p>
            © {new Date().getFullYear()} {PROFILE.name}
          </p>
          <button
            type="button"
            className="back-to-top"
            onClick={() => scrollToTarget("#top")}
          >
            Back to top ↑
          </button>
          <p>Built with Next.js</p>
        </div>

        <style jsx>{`
          .site-footer {
            border-top: 1px solid var(--line);
            padding-block: 28px;
          }
          .footer-inner {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            font-size: 12.5px;
            color: var(--mute);
          }
          .back-to-top:hover {
            color: var(--ink);
            text-decoration: underline;
          }
        `}</style>
      </footer>
    </>
  );
}

function SpinBadge() {
  const chars = CIRCLE_TEXT.split("");
  const step = 360 / chars.length;

  return (
    <div className="spin-badge" aria-hidden="true">
      <div className="spin-text">
        {chars.map((ch, i) => (
          <span
            key={i}
            style={{ transform: `rotate(${i * step}deg) translateY(-52px)` }}
          >
            {ch}
          </span>
        ))}
      </div>
      <span className="spin-center">✦</span>

      <style jsx>{`
        .spin-badge {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spin-text {
          position: absolute;
          inset: 0;
          animation: spin 14s linear infinite;
        }
        .spin-text span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          color: var(--mute);
        }
        .spin-center {
          font-size: 20px;
          color: var(--faint);
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .spin-text {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
