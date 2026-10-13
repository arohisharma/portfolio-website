"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { useActiveSection, useScrollProgress } from "@/lib/hooks";
import { useScroll } from "@/lib/scroll";

const SECTION_IDS = NAV.map((n) => n.id);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const progress = useScrollProgress();
  const { scrollToTarget } = useScroll();

  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function measure() {
      const el = linkRefs.current[active];
      const pill = pillRef.current;
      if (!el || !pill) {
        setIndicator((s) => ({ ...s, opacity: 0 }));
        return;
      }
      const pillRect = pill.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({ left: elRect.left - pillRect.left, width: elRect.width, opacity: 1 });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, scrolled]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToTarget(`#${id}`, -24);
  };

  return (
    <>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-inner">
          <a
            href="#top"
            className="brand"
            onClick={(e) => {
              e.preventDefault();
              go("top");
            }}
            aria-label={`${PROFILE.name} — back to top`}
          >
            <span className={`mark ${scrolled ? "mark-solid" : ""}`} aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className={`brand-name ${scrolled ? "is-hidden" : ""}`}>{PROFILE.name}</span>
          </a>

          <nav className={`pill desktop-pill ${scrolled ? "is-glass" : ""}`} ref={pillRef} aria-label="Primary">
            <div
              className="indicator"
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: indicator.width,
                opacity: indicator.opacity,
              }}
              aria-hidden="true"
            />
            {NAV.map((item) => (
              <a
                key={item.id}
                ref={(el) => {
                  linkRefs.current[item.id] = el;
                }}
                href={`#${item.id}`}
                className={`nav-link ${active === item.id ? "is-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="pill menu-trigger"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            Menu
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`overlay ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <button type="button" className="overlay-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          Close
        </button>
        <ul className="overlay-list">
          {NAV.map((item, i) => (
            <li key={item.id} style={{ ["--i" as string]: i }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.id);
                }}
              >
                <span className="overlay-index">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .progress-track {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: transparent;
          z-index: 70;
        }
        .progress-fill {
          height: 100%;
          width: 100%;
          background: var(--ink);
          transform-origin: left;
          transform: scaleX(0);
        }

        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          padding: 18px var(--gutter);
          pointer-events: none;
        }
        .nav-inner {
          max-width: var(--content-max);
          margin-inline: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          pointer-events: auto;
        }
        .mark {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.02em;
          color: var(--ink);
          border: 1.5px solid var(--ink);
          background: transparent;
          transition: background-color 0.4s var(--ease), color 0.4s var(--ease), transform 0.6s var(--ease);
          flex-shrink: 0;
        }
        .brand:hover .mark {
          transform: rotate(360deg);
        }
        .mark-solid {
          background: var(--ink);
          color: var(--paper);
        }
        .brand-name {
          font-weight: 600;
          font-size: 14.5px;
          letter-spacing: -0.01em;
          transition: opacity 0.4s var(--ease), transform 0.4s var(--ease), width 0.4s var(--ease);
          white-space: nowrap;
        }
        .brand-name.is-hidden {
          opacity: 0;
          transform: translateX(-6px);
          width: 0;
          overflow: hidden;
        }

        .pill {
          pointer-events: auto;
          border-radius: 999px;
          padding: 6px;
          display: flex;
          align-items: center;
          position: relative;
          transition: background-color 0.5s var(--ease), box-shadow 0.5s var(--ease), backdrop-filter 0.5s var(--ease);
        }
        .desktop-pill {
          gap: 2px;
        }
        .desktop-pill.is-glass {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 0 0 1px var(--line), 0 10px 30px -18px rgba(13, 13, 13, 0.3);
        }
        .indicator {
          position: absolute;
          top: 6px;
          bottom: 6px;
          left: 0;
          background: var(--ink);
          border-radius: 999px;
          transition: transform 0.5s var(--ease), width 0.5s var(--ease), opacity 0.3s var(--ease);
          z-index: 0;
        }
        .nav-link {
          position: relative;
          z-index: 1;
          padding: 10px 18px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--ink-2);
          border-radius: 999px;
          transition: color 0.4s var(--ease);
          white-space: nowrap;
        }
        .nav-link.is-active {
          color: var(--paper);
        }

        .menu-trigger {
          display: none;
          background: var(--ink);
          color: var(--paper);
          padding: 11px 22px;
          font-size: 13.5px;
          font-weight: 600;
        }

        @media (max-width: 760px) {
          .desktop-pill {
            display: none;
          }
          .menu-trigger {
            display: inline-flex;
          }
          .brand-name {
            display: none;
          }
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: var(--paper);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--gutter);
          clip-path: circle(0% at calc(100% - 48px) 48px);
          transition: clip-path 0.6s var(--ease);
          visibility: hidden;
        }
        .overlay.is-open {
          clip-path: circle(150% at calc(100% - 48px) 48px);
          visibility: visible;
        }
        .overlay-close {
          position: absolute;
          top: 22px;
          right: var(--gutter);
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 999px;
          box-shadow: inset 0 0 0 1px var(--line);
        }
        .overlay-list li {
          overflow: hidden;
        }
        .overlay-list a {
          display: flex;
          align-items: baseline;
          gap: 18px;
          padding: 14px 0;
          font-size: clamp(32px, 9vw, 56px);
          font-weight: 700;
          letter-spacing: -0.04em;
          opacity: 0;
          transform: translateY(100%);
          transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
          transition-delay: calc(var(--i, 0) * 60ms);
        }
        .overlay.is-open .overlay-list a {
          opacity: 1;
          transform: translateY(0);
        }
        .overlay-index {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 14px;
          color: var(--faint);
        }

        @media (prefers-reduced-motion: reduce) {
          .overlay {
            transition: none;
          }
          .overlay-list a {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
