"use client";

import Image from "next/image";
import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import TechLogo from "@/components/ui/TechLogo";

export default function Work() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="work section">
      <div className="wrap">
        <p className="tag rv">
          <b>03</b> — Selected work
        </p>
        <h2 className="heading section-title rv" style={{ ["--i" as string]: 1 }}>
          Things I&rsquo;ve <em>built</em>.
        </h2>

        <div className="gallery rv" style={{ ["--i" as string]: 2 }}>
          {PROJECTS.map((project, i) => (
            <Panel
              key={project.id}
              project={project}
              isOpen={open === i}
              onOpen={() => setOpen(i)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-title {
          font-size: clamp(30px, 4.4vw, 52px);
          margin-bottom: 36px;
        }
        .gallery {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }

        @media (max-width: 820px) {
          .gallery {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}

function Panel({
  project,
  isOpen,
  onOpen,
}: {
  project: Project;
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <article
      className={`panel ${isOpen ? "is-open" : ""}`}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      tabIndex={-1}
    >
      {!isOpen && (
        <button type="button" className="spine" onClick={onOpen} aria-label={`Open ${project.title}`}>
          <span className="spine-number">{project.index}</span>
          <span className="spine-title">{project.title}</span>
          <span className="spine-plus" aria-hidden="true">
            +
          </span>
        </button>
      )}

      {isOpen && (
        <div className="panel-content">
          <div className="panel-info">
            <p className="tag">
              <b>{project.index}</b> — {project.kicker}
            </p>
            <h3 className="heading panel-title">{project.title}</h3>
            <p className="panel-desc">{project.description}</p>

            <ul className="features">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <div className="tech-row">
              {project.tech.map((t) => (
                <span className="chip tech-chip" key={t}>
                  <TechLogo name={t} size={16} />
                  {t}
                </span>
              ))}
            </div>

            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-secondary github-btn">
                View on GitHub ↗
              </a>
            )}
          </div>

          <div className="panel-visual">
            {project.screenshot ? (
              <figure className="project-shot">
                <Image
                  src={project.screenshot.src}
                  alt={project.screenshot.alt}
                  width={1024}
                  height={488}
                  sizes="(max-width: 820px) 100vw, 50vw"
                />
              </figure>
            ) : (
              <>
                <IllustrativeUI variant={project.id === "booking-zone" ? "booking" : "admin"} />
                <span className="visual-label">Illustrative UI</span>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .panel {
          background: var(--card);
          border-radius: 26px;
          box-shadow: inset 0 0 0 1px var(--line);
          height: min(78svh, 600px);
          overflow: hidden;
          transition: flex 0.6s var(--ease);
          flex: 1;
          display: flex;
        }
        .panel.is-open {
          flex: 8;
        }

        .spine {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
        }
        .spine-number {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 12px;
          color: var(--faint);
        }
        .spine-title {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }
        .spine-plus {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 0 1px var(--line);
          font-size: 16px;
          transition: transform 0.4s var(--ease), background-color 0.3s var(--ease), color 0.3s var(--ease);
        }
        .spine:hover .spine-plus {
          transform: rotate(90deg);
          background: var(--ink);
          color: var(--paper);
        }

        .panel-content {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 0;
          width: 100%;
          height: 100%;
        }
        .panel-info {
          padding: clamp(24px, 3vw, 44px);
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
        }
        .panel-title {
          font-size: clamp(26px, 3vw, 38px);
        }
        .panel-desc {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 48ch;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px 16px;
          margin-top: 4px;
        }
        .features li {
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--mute);
          padding-left: 14px;
          position: relative;
        }
        .features li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--faint);
        }
        .tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 6px;
        }
        .tech-chip {
          font-size: 11.5px;
        }
        .github-btn {
          align-self: flex-start;
          margin-top: 8px;
        }

        .panel-visual {
          position: relative;
          background: var(--paper);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          clip-path: inset(0 0 0 0);
          animation: wipe 0.7s var(--ease);
        }
        @keyframes wipe {
          from {
            clip-path: inset(0 100% 0 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }
        .visual-label {
          position: absolute;
          bottom: 14px;
          right: 16px;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--faint);
        }
        .project-shot {
          width: 100%;
          max-width: 100%;
          margin: 0;
        }
        .project-shot img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: inset 0 0 0 1px var(--line), 0 24px 48px -28px rgba(13, 13, 13, 0.35);
        }

        @media (max-width: 820px) {
          .panel {
            height: auto;
          }
          .panel-content {
            grid-template-columns: 1fr;
          }
          .panel-visual {
            min-height: 220px;
          }
          .spine {
            flex-direction: row;
            padding: 16px 20px;
          }
          .spine-title {
            writing-mode: horizontal-tb;
            transform: none;
            flex: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .panel-visual {
            animation: none;
          }
        }
      `}</style>
    </article>
  );
}

/** Grayscale, clearly-labelled mock UI that hints at the product without
 * claiming to be a real screenshot. */
function IllustrativeUI({ variant }: { variant: "booking" | "admin" }) {
  return (
    <div className="mock-window">
      <div className="mock-bar">
        <span />
        <span />
        <span />
      </div>
      {variant === "booking" ? (
        <div className="mock-body">
          <div className="mock-row">
            <div className="mock-block tall" />
            <div className="mock-col">
              <div className="mock-line w-70" />
              <div className="mock-line w-40" />
              <div className="mock-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className={i === 2 ? "is-on" : ""} />
                ))}
              </div>
              <div className="mock-pill" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mock-body">
          <div className="mock-row">
            <div className="mock-sidebar">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className={i === 1 ? "is-on" : ""} />
              ))}
            </div>
            <div className="mock-col">
              <div className="mock-line w-50" />
              <div className="mock-table">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="mock-table-row" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .mock-window {
          width: 100%;
          max-width: 380px;
          background: var(--card);
          border-radius: 16px;
          box-shadow: inset 0 0 0 1px var(--line), 0 20px 40px -24px rgba(13, 13, 13, 0.25);
          overflow: hidden;
        }
        .mock-bar {
          display: flex;
          gap: 5px;
          padding: 10px 12px;
          border-bottom: 1px solid var(--line);
        }
        .mock-bar span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--soft);
        }
        .mock-body {
          padding: 16px;
        }
        .mock-row {
          display: flex;
          gap: 12px;
        }
        .mock-block.tall {
          width: 72px;
          height: 150px;
          border-radius: 10px;
          background: var(--soft);
          flex-shrink: 0;
        }
        .mock-sidebar {
          width: 52px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
        }
        .mock-sidebar span {
          height: 20px;
          border-radius: 6px;
          background: var(--soft);
        }
        .mock-sidebar span.is-on {
          background: var(--ink-2);
        }
        .mock-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mock-line {
          height: 9px;
          border-radius: 5px;
          background: var(--soft);
        }
        .w-70 {
          width: 70%;
        }
        .w-50 {
          width: 50%;
        }
        .w-40 {
          width: 40%;
        }
        .mock-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 4px;
        }
        .mock-grid span {
          height: 26px;
          border-radius: 6px;
          background: var(--soft);
        }
        .mock-grid span.is-on {
          background: var(--ink-2);
        }
        .mock-pill {
          width: 72px;
          height: 22px;
          border-radius: 999px;
          background: var(--ink);
          margin-top: 6px;
        }
        .mock-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mock-table-row {
          height: 14px;
          border-radius: 5px;
          background: var(--soft);
        }
      `}</style>
    </div>
  );
}