import type { CSSProperties, ReactElement, SVGProps } from "react";

/** Real brand logos (official colours kept per the design brief). AWS-prefixed
 * services all share the single AWS mark since devicon/simple-icons don't
 * ship separate marks for each individual AWS product. */
export const BRAND: Record<string, { src: string; tint: string }> = {
  ReactJS: { src: "/logos/react.svg", tint: "97, 218, 251" },
  Redux: { src: "/logos/redux.svg", tint: "118, 74, 188" },
  TypeScript: { src: "/logos/typescript.svg", tint: "49, 120, 198" },
  "JavaScript (ES6+)": { src: "/logos/javascript.svg", tint: "240, 219, 79" },
  NextJS: { src: "/logos/nextjs.svg", tint: "13, 13, 13" },
  HTML: { src: "/logos/html5.svg", tint: "227, 76, 38" },
  CSS: { src: "/logos/css3.svg", tint: "38, 77, 228" },
  "Material UI": { src: "/logos/materialui.svg", tint: "0, 127, 255" },
  "AWS Amplify": { src: "/logos/aws.svg", tint: "255, 153, 0" },
  CodePipeline: { src: "/logos/aws.svg", tint: "255, 153, 0" },
  CloudWatch: { src: "/logos/aws.svg", tint: "255, 153, 0" },
  CodeCommit: { src: "/logos/aws.svg", tint: "255, 153, 0" },
  S3: { src: "/logos/aws.svg", tint: "255, 153, 0" },
  CloudFront: { src: "/logos/aws.svg", tint: "255, 153, 0" },
  Git: { src: "/logos/git.svg", tint: "240, 80, 51" },
  Cursor: { src: "/logos/cursor.svg", tint: "13, 13, 13" },
  Claude: { src: "/logos/claude.svg", tint: "217, 119, 87" },
  Figma: { src: "/logos/figma.svg", tint: "242, 78, 30" },
  GitHub: { src: "/logos/github.svg", tint: "13, 13, 13" },
  LinkedIn: { src: "/logos/linkedin.svg", tint: "10, 102, 194" },
  LeetCode: { src: "/logos/leetcode.svg", tint: "255, 161, 22" },
  HackerRank: { src: "/logos/hackerrank.svg", tint: "0, 234, 100" },
};

export function isBrand(name: string): boolean {
  return name in BRAND;
}

/** Thin-line, single-colour icons for concepts and niche integrations that
 * have no official mark available (payment gateways, hardware terminals,
 * process methodology, and ChatGPT — removed from the icon packs we ship). */
function iconProps(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
  };
}

const ConceptIcons: Record<string, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  "Agile/Scrum": (p) => (
    <svg {...iconProps(p)}>
      <path d="M4 9a8 8 0 0 1 13.9-4.9M4 9V4m0 5h5" />
      <path d="M20 15a8 8 0 0 1-13.9 4.9M20 15v5m0-5h-5" />
    </svg>
  ),
  ChatGPT: (p) => (
    <svg {...iconProps(p)}>
      <path d="M4 5.5h16v10H9.5L5 19v-3.5H4z" />
      <path d="M8 9.5h8M8 12h5" />
    </svg>
  ),
  Magensa: (p) => (
    <svg {...iconProps(p)}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <rect x="6" y="13" width="4" height="2.4" rx="0.5" />
    </svg>
  ),
  Datacap: (p) => (
    <svg {...iconProps(p)}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M6 14h7" />
    </svg>
  ),
  iDynamo6: (p) => (
    <svg {...iconProps(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 3v3M16 3v3" />
      <path d="M7 12h10" />
    </svg>
  ),
  DynaFlex: (p) => (
    <svg {...iconProps(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  ),
  POS: (p) => (
    <svg {...iconProps(p)}>
      <rect x="3" y="5" width="18" height="10" rx="1.5" />
      <path d="M8 19h8M12 15v4" />
      <path d="M6.5 8h5" />
    </svg>
  ),
  "Kiosk systems": (p) => (
    <svg {...iconProps(p)}>
      <rect x="6" y="3" width="12" height="14" rx="1.5" />
      <path d="M10 21h4M12 17v4" />
      <path d="M9 7h6" />
    </svg>
  ),
  "Kiosk Gamecard": (p) => (
    <svg {...iconProps(p)}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="8.5" cy="12" r="1.3" />
      <circle cx="12" cy="10" r="1" />
      <circle cx="12" cy="14" r="1" />
      <circle cx="15.5" cy="12" r="1.3" />
    </svg>
  ),
};

export function isConcept(name: string): boolean {
  return name in ConceptIcons;
}

type TechLogoProps = {
  name: string;
  size?: number;
  glow?: boolean;
  className?: string;
};

/** Renders the right visual for any skill/tech name: a real brand mark (with
 * optional soft brand-tint glow), a custom concept line-icon, or — for
 * anything unrecognised — a plain two-letter monogram fallback. */
export default function TechLogo({ name, size = 28, glow = false, className }: TechLogoProps) {
  if (isBrand(name)) {
    const brand = BRAND[name];
    const style: CSSProperties = glow
      ? { ["--glow" as string]: `rgba(${brand.tint}, 0.35)` }
      : {};
    return (
      <span className={`tech-logo ${glow ? "has-glow" : ""} ${className ?? ""}`} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.src} alt="" width={size} height={size} style={{ width: size, height: size }} />
        <style jsx>{`
          .tech-logo {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .tech-logo.has-glow::before {
            content: "";
            position: absolute;
            inset: -40%;
            background: radial-gradient(circle, var(--glow), transparent 70%);
            z-index: -1;
            border-radius: 50%;
          }
        `}</style>
      </span>
    );
  }

  if (isConcept(name)) {
    const Icon = ConceptIcons[name];
    return (
      <span
        className={`tech-logo concept ${className ?? ""}`}
        style={{ width: size, height: size, color: "var(--ink-2)" }}
      >
        <Icon width={size * 0.62} height={size * 0.62} />
        <style jsx>{`
          .concept {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--paper);
            box-shadow: inset 0 0 0 1px var(--line);
          }
        `}</style>
      </span>
    );
  }

  const initials = name
    .replace(/[()].*$/, "")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={`tech-logo fallback ${className ?? ""}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
      <style jsx>{`
        .fallback {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line);
          font-family: var(--font-jetbrains-mono), monospace;
          color: var(--mute);
          font-weight: 600;
        }
      `}</style>
    </span>
  );
}
