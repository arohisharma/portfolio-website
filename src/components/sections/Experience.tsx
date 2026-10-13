"use client";

import { TIMELINE } from "@/lib/data";
import { useElementScrollProgress } from "@/lib/hooks";

export default function Experience() {
  const [sectionRef, progress] = useElementScrollProgress<HTMLDivElement>();
  const n = TIMELINE.length;

  return (
    <section id="experience" className="experience section">
      <div className="wrap">
        <p className="tag rv">
          <b>05</b> — Path so far
        </p>
        <h2 className="heading section-title rv" style={{ ["--i" as string]: 1 }}>
          Education and experience, one <em>path</em>.
        </h2>

        <div className="timeline" ref={sectionRef}>
          <div className="spine-track" aria-hidden="true">
            <div className="spine-fill" style={{ transform: `scaleY(${progress})` }} />
          </div>

          <ol className="stops">
            {TIMELINE.map((stop, i) => {
              const threshold = n > 1 ? i / (n - 1) : 0;
              const lit = progress >= threshold - 0.02;
              const year = stop.kind === "education" ? stop.year : stop.period.split(" ")[0];
              return (
                <li key={stop.id} className={`stop ${lit ? "is-lit" : ""}`}>
                  <span className="stop-dot" aria-hidden="true" />
                  <div className="stop-year">{year}</div>
                  <div className="stop-body">
                    <p className="stop-title">
                      {stop.kind === "education" ? stop.degree : stop.role}
                    </p>
                    <p className="stop-place">
                      {stop.kind === "education" ? stop.school : stop.company}
                      {stop.kind === "experience" ? ` · ${stop.period}` : ` · ${stop.year}`}
                    </p>
                    {stop.kind === "experience" && stop.bullets.length > 0 && (
                      <ul className="stop-detail">
                        {stop.bullets.slice(0, 3).map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                    {stop.kind === "experience" && stop.focusAreas && (
                      <div className="stop-focus">
                        {stop.focusAreas.map((f) => (
                          <span className="chip" key={f}>
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}

            <li className="stop next-stop">
              <span className="stop-dot" aria-hidden="true" />
              <div className="stop-year">Next</div>
              <div className="stop-body">
                <div className="next-card">
                  <p className="stop-title">Next — Your team?</p>
                  <p className="stop-place">Open to the next opportunity.</p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <style jsx>{`
        .section-title {
          font-size: clamp(30px, 4.4vw, 52px);
          max-width: 20ch;
          margin-bottom: 48px;
        }

        .timeline {
          position: relative;
          padding-left: clamp(28px, 4vw, 40px);
        }

        .spine-track {
          position: absolute;
          top: 6px;
          bottom: 6px;
          left: 5px;
          width: 2px;
          background: var(--line);
        }
        .spine-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--ink);
          transform-origin: top;
          transform: scaleY(0);
        }

        .stops {
          display: flex;
          flex-direction: column;
          gap: 52px;
        }
        .stop {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0 20px;
          align-items: start;
          opacity: 0.35;
          transition: opacity 0.5s var(--ease);
        }
        .stop.is-lit {
          opacity: 1;
        }
        .stop-dot {
          position: absolute;
          left: calc(clamp(28px, 4vw, 40px) * -1 + 1px);
          top: 5px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: var(--paper);
          box-shadow: inset 0 0 0 2px var(--faint);
          transition: box-shadow 0.4s var(--ease), background-color 0.4s var(--ease);
        }
        .stop.is-lit .stop-dot {
          background: var(--ink);
          box-shadow: inset 0 0 0 2px var(--ink);
        }
        .stop-year {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 13px;
          color: var(--mute);
          white-space: nowrap;
          padding-top: 2px;
        }
        .stop-title {
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.01em;
        }
        .stop-place {
          font-size: 13px;
          color: var(--mute);
          margin-top: 2px;
        }
        .stop-detail {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-width: 60ch;
        }
        .stop-detail li {
          font-size: 13px;
          line-height: 1.55;
          color: var(--ink-2);
          padding-left: 14px;
          position: relative;
        }
        .stop-detail li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--faint);
        }
        .stop-focus {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .next-stop {
          opacity: 1;
        }
        .next-card {
          border: 1.5px dashed var(--line);
          border-radius: 18px;
          padding: 20px 22px;
        }

        @media (max-width: 640px) {
          .timeline {
            padding-left: 26px;
          }
          .stop {
            grid-template-columns: 1fr;
            gap: 4px 0;
          }
          .stop-dot {
            left: -25px;
          }
          .stop-title {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
}
