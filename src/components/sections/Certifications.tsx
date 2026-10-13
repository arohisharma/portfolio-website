"use client";

import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  return (
    <section id="certifications" className="certifications">
      <div className="wrap cert-grid">
        <div className="col-head">
          <p className="tag rv">
            <b>04</b> — Certifications
          </p>
          <h2 className="heading cert-title rv" style={{ ["--i" as string]: 1 }}>
            Always <em>learning</em>.
          </h2>
          <p className="count rv" style={{ ["--i" as string]: 2 }}>
            {String(CERTIFICATIONS.length).padStart(2, "0")} earned so far
          </p>
        </div>

        <ul className="cert-list rv" style={{ ["--i" as string]: 3 }}>
          {CERTIFICATIONS.map((c) => (
            <li key={c.id} className="cert-row" tabIndex={0}>
              <span className="cert-index">{c.index}</span>
              <span className="cert-text">
                <span className="cert-name">{c.title}</span>
                <span className="cert-issuer">{c.issuer}</span>
              </span>
              <span className="cert-arrow" aria-hidden="true">
                ↗
              </span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .certifications {
          background: var(--card);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          padding-block: var(--section-pad);
        }
        .cert-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
          gap: clamp(24px, 5vw, 64px);
        }
        .col-head {
          position: sticky;
          top: 120px;
          align-self: start;
        }
        .cert-title {
          font-size: clamp(30px, 4.4vw, 50px);
          margin-top: 10px;
        }
        .count {
          margin-top: 16px;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 12.5px;
          color: var(--mute);
        }

        .cert-list {
          border-top: 1px solid var(--line);
        }
        .cert-row {
          position: relative;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 26px 18px;
          border-bottom: 1px solid var(--line);
          overflow: hidden;
          cursor: default;
        }
        .cert-row::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--ink);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s var(--ease);
          z-index: 0;
        }
        .cert-row:hover::before,
        .cert-row:focus-visible::before {
          transform: scaleX(1);
        }
        .cert-index {
          position: relative;
          z-index: 1;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 13px;
          color: var(--faint);
          transition: color 0.4s var(--ease);
        }
        .cert-text {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
        }
        .cert-name {
          font-weight: 600;
          font-size: 18px;
          letter-spacing: -0.01em;
          color: var(--ink);
          transition: color 0.4s var(--ease);
        }
        .cert-issuer {
          font-size: 12.5px;
          color: var(--mute);
          transition: color 0.4s var(--ease);
        }
        .cert-arrow {
          position: relative;
          z-index: 1;
          font-size: 18px;
          color: var(--faint);
          transform: translateX(-8px);
          opacity: 0;
          transition: transform 0.4s var(--ease), opacity 0.4s var(--ease), color 0.4s var(--ease);
        }
        .cert-row:hover .cert-arrow,
        .cert-row:focus-visible .cert-arrow {
          transform: translateX(0);
          opacity: 1;
        }
        .cert-row:hover .cert-index,
        .cert-row:hover .cert-name,
        .cert-row:hover .cert-issuer,
        .cert-row:hover .cert-arrow,
        .cert-row:focus-visible .cert-index,
        .cert-row:focus-visible .cert-name,
        .cert-row:focus-visible .cert-issuer,
        .cert-row:focus-visible .cert-arrow {
          color: var(--paper);
        }

        @media (max-width: 820px) {
          .cert-grid {
            grid-template-columns: 1fr;
          }
          .col-head {
            position: static;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cert-row::before,
          .cert-arrow {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
