"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS, SKILL_FAMILIES, SKILL_GROUPS, type Skill } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import TechLogo from "@/components/ui/TechLogo";

const COLS = 8;

export default function Skills() {
  const [family, setFamily] = useState<string | null>(null);
  const [active, setActive] = useState<Skill>(SKILL_GROUPS[0]);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [filtersIn, setFiltersIn] = useState(() => prefersReducedMotion());
  const [gridIn, setGridIn] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (filtersIn && gridIn) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === filtersRef.current) setFiltersIn(true);
          if (entry.target === gridRef.current) setGridIn(true);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    if (!filtersIn && filtersRef.current) observer.observe(filtersRef.current);
    if (!gridIn && gridRef.current) observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, [filtersIn, gridIn]);

  useEffect(() => {
    if (family === null) return;
    setActive((cur) =>
      cur.family === family ? cur : (SKILL_GROUPS.find((s) => s.family === family) ?? cur)
    );
  }, [family]);

  const projectsFor = useMemo(() => {
    return (skillName: string) =>
      PROJECTS.filter((p) => p.tech.includes(skillName)).map((p) => p.title);
  }, []);

  const relatedProjects = projectsFor(active.name);

  return (
    <section id="skills" className="skills section">
      <div className="wrap">
        <p className="tag rv">
          <b>02</b> — Skills
        </p>
        <h2 className="heading section-title rv" style={{ ["--i" as string]: 1 }}>
          The periodic table of my <em>stack</em>.
        </h2>

        <div
          ref={filtersRef}
          className={`filters rv ${filtersIn ? "is-in" : ""}`}
          style={{ ["--i" as string]: 2 }}
        >
          <button
            type="button"
            className={`chip filter-chip ${family === null ? "is-active" : ""}`}
            onClick={() => setFamily(null)}
          >
            All
          </button>
          {SKILL_FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip filter-chip ${family === f ? "is-active" : ""}`}
              onClick={() => setFamily((cur) => (cur === f ? null : f))}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="skills-layout">
          <div
            ref={gridRef}
            className={`grid rv ${gridIn ? "is-in" : ""} ${family !== null ? "is-filtering" : ""}`}
            role="list"
          >
            {SKILL_GROUPS.map((skill, idx) => {
              const row = Math.floor(idx / COLS);
              const col = idx % COLS;
              const filtering = family !== null;
              const inFamily = skill.family === family;
              return (
                <button
                  type="button"
                  role="listitem"
                  key={skill.name}
                  className={`tile ${filtering ? (inFamily ? "is-in-family" : "is-dim") : ""} ${active.name === skill.name ? "is-active" : ""}`}
                  style={{ ["--i" as string]: row + col }}
                  onClick={() => setActive(skill)}
                  onMouseEnter={() => {
                    if (filtering && !inFamily) return;
                    setActive(skill);
                  }}
                  onFocus={() => {
                    if (filtering && !inFamily) return;
                    setActive(skill);
                  }}
                  tabIndex={filtering && !inFamily ? -1 : 0}
                  aria-disabled={filtering && !inFamily ? true : undefined}
                >
                  <span className="tile-number">{skill.number}</span>
                  <span className="tile-symbol">{skill.symbol}</span>
                  <span className="tile-name">{skill.name}</span>
                </button>
              );
            })}
          </div>

          <aside className="inspector" aria-live="polite">
            <div className="inspector-inner" key={active.name}>
              <div className="inspector-logo">
                <TechLogo name={active.name} size={150} glow />
              </div>
              <p className="inspector-name">{active.name}</p>
              <p className="inspector-family">{active.family}</p>
              {relatedProjects.length > 0 && (
                <div className="inspector-projects">
                  <p className="inspector-label">Used in</p>
                  <ul>
                    {relatedProjects.map((title) => (
                      <li key={title}>{title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .section-title {
          font-size: clamp(30px, 4.4vw, 52px);
          max-width: 18ch;
          margin-bottom: 28px;
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 36px;
        }
        .filter-chip {
          transition: background-color 0.3s var(--ease), color 0.3s var(--ease);
        }
        .filter-chip.is-active {
          background: var(--ink);
          color: var(--paper);
          box-shadow: none;
        }

        .skills-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 28px;
          align-items: start;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 8px;
        }
        .grid.is-in .tile {
          animation: tile-in 0.8s var(--ease) both;
          animation-delay: calc(var(--i, 0) * 70ms);
        }
        @keyframes tile-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tile {
          position: relative;
          aspect-ratio: 1;
          border-radius: 14px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          padding: 6px 4px;
          transition:
            opacity 0.45s var(--ease),
            box-shadow 0.35s var(--ease),
            transform 0.35s var(--ease),
            background-color 0.35s var(--ease),
            filter 0.45s var(--ease);
          text-align: center;
        }
        .tile:hover:not(.is-dim),
        .tile.is-active:not(.is-dim) {
          box-shadow: inset 0 0 0 1px var(--ink);
          transform: translateY(-2px);
        }

        /* Category filter: in-family tiles glow; others read as disabled */
        .grid.is-filtering .tile.is-in-family {
          z-index: 1;
          background: #ffffff;
          opacity: 1;
          filter: none;
          box-shadow:
            inset 0 0 0 1px rgba(13, 13, 13, 0.14),
            0 0 0 1px rgba(255, 255, 255, 0.95),
            0 0 14px rgba(255, 255, 255, 0.9),
            0 0 28px rgba(255, 255, 255, 0.55),
            0 0 48px rgba(255, 255, 255, 0.28);
        }
        .grid.is-filtering .tile.is-in-family .tile-symbol {
          color: var(--ink);
        }
        .grid.is-filtering .tile.is-in-family .tile-name {
          color: var(--ink-2);
        }
        .grid.is-filtering .tile.is-in-family:hover,
        .grid.is-filtering .tile.is-in-family.is-active {
          transform: translateY(-2px);
          box-shadow:
            inset 0 0 0 1px rgba(13, 13, 13, 0.2),
            0 0 0 1px #ffffff,
            0 0 18px rgba(255, 255, 255, 1),
            0 0 36px rgba(255, 255, 255, 0.72),
            0 0 56px rgba(255, 255, 255, 0.38);
        }

        .grid.is-filtering .tile.is-dim {
          opacity: 0.38;
          filter: grayscale(1);
          background: var(--soft);
          box-shadow: inset 0 0 0 1px rgba(13, 13, 13, 0.04);
          cursor: not-allowed;
          pointer-events: none;
          transform: none;
        }
        .grid.is-filtering .tile.is-dim .tile-symbol,
        .grid.is-filtering .tile.is-dim .tile-name,
        .grid.is-filtering .tile.is-dim .tile-number {
          color: var(--faint);
        }
        .tile-number {
          position: absolute;
          top: 5px;
          left: 7px;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 8.5px;
          color: var(--faint);
        }
        .tile-symbol {
          font-weight: 700;
          font-size: clamp(14px, 2vw, 19px);
          letter-spacing: -0.01em;
        }
        .tile-name {
          font-size: 7.5px;
          color: var(--mute);
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .inspector {
          position: sticky;
          top: 100px;
        }
        .inspector-inner {
          background: var(--card);
          border-radius: 24px;
          box-shadow: inset 0 0 0 1px var(--line);
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          animation: pop 0.4s var(--ease);
        }
        @keyframes pop {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .inspector-logo {
          margin-bottom: 10px;
        }
        .inspector-name {
          font-weight: 700;
          font-size: 17px;
        }
        .inspector-family {
          font-size: 12.5px;
          color: var(--mute);
          margin-bottom: 14px;
        }
        .inspector-projects {
          width: 100%;
          border-top: 1px solid var(--line);
          padding-top: 14px;
        }
        .inspector-label {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--faint);
          margin-bottom: 8px;
        }
        .inspector-projects ul {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .inspector-projects li {
          font-size: 13.5px;
          color: var(--ink-2);
          font-weight: 500;
        }

        @media (max-width: 860px) {
          .skills-layout {
            grid-template-columns: 1fr;
          }
          .grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .inspector {
            position: static;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .inspector-inner {
            animation: none;
          }
          .grid.is-in .tile {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
