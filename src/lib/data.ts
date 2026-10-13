/**
 * data.ts — single source of truth for every piece of text on the site.
 *
 * Everything here is traceable to "Arohi Sharma React Developer.pdf" unless
 * explicitly marked MOCK. Mock blocks exist only where the résumé currently
 * has no content for a required section (Projects / Certifications /
 * Achievements) — per direct instruction, they are placeholders to be
 * swapped for real data later. Components never invent copy themselves;
 * they only read from this file.
 */

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const PROFILE = {
  name: "Arohi Sharma",
  firstName: "Arohi",
  initials: "AS",
  role: "Frontend Software Engineer",
  email: "arohisharma3066@gmail.com",
  phone: "+91 88274 08094",
  phoneHref: "tel:+918827408094",
  // No city/location is stated anywhere in the résumé — omitted rather than guessed.
  resumeSummary:
    "Frontend Software Engineer with 5+ years of experience building scalable, responsive, and high-performance web applications using React.js, Next.js, Redux, TypeScript, JavaScript, HTML, and CSS. Core contributor to Booking Zone since 2021, scaling the platform to 100+ clients, 20,000+ users, and $2B+ in payments while handling 1.3M+ API requests/day (~25 req/sec peak).",
  resumeSummaryExtra:
    "Experienced in frontend architecture, REST API integration, AWS-based applications, performance optimization, unit testing, and production issue resolution — with strong experience collaborating with backend, QA, design, and business stakeholders to translate requirements into reliable, maintainable solutions.",
  // Quote on the About page: a paraphrase of the résumé's own summary line,
  // not an invented testimonial.
  quote:
    "I'd rather ship something reliable and maintainable than something merely clever.",
  // Supplied directly by Arohi for this build (not present as text/links inside the PDF itself).
  github: "https://github.com/arohisharma",
  linkedin: "https://www.linkedin.com/in/arohisharma",
  linkedinLabel: "linkedin.com/in/arohisharma",
  githubLabel: "github.com/arohisharma",
  resumePath: "/resume.pdf",
} as const;

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

// ---------------------------------------------------------------------------
// Skills — "Technical Skills" section of the résumé, grouped exactly as the
// résumé groups them (Frontend / UI Libraries / Cloud & Platforms / AI Tools
// / Integrations). Each entry becomes one periodic-table tile.
// ---------------------------------------------------------------------------

export type Skill = {
  number: number; // atomic number = table order
  symbol: string; // 2-letter tile symbol
  name: string;
  family: SkillFamily;
};

export type SkillFamily =
  | "Frontend"
  | "UI Libraries"
  | "Cloud & Platforms"
  | "AI Tools"
  | "Integrations";

export const SKILL_FAMILIES: SkillFamily[] = [
  "Frontend",
  "UI Libraries",
  "Cloud & Platforms",
  "AI Tools",
  "Integrations",
];

export const SKILL_GROUPS: Skill[] = [
  { number: 1, symbol: "Re", name: "ReactJS", family: "Frontend" },
  { number: 2, symbol: "Rd", name: "Redux", family: "Frontend" },
  { number: 3, symbol: "Ts", name: "TypeScript", family: "Frontend" },
  { number: 4, symbol: "Js", name: "JavaScript (ES6+)", family: "Frontend" },
  { number: 5, symbol: "Nx", name: "NextJS", family: "Frontend" },
  { number: 6, symbol: "Ht", name: "HTML", family: "Frontend" },
  { number: 7, symbol: "Cs", name: "CSS", family: "Frontend" },
  { number: 8, symbol: "Mu", name: "Material UI", family: "UI Libraries" },
  { number: 9, symbol: "Am", name: "AWS Amplify", family: "Cloud & Platforms" },
  { number: 10, symbol: "Cp", name: "CodePipeline", family: "Cloud & Platforms" },
  { number: 11, symbol: "Cw", name: "CloudWatch", family: "Cloud & Platforms" },
  { number: 12, symbol: "Cc", name: "CodeCommit", family: "Cloud & Platforms" },
  { number: 13, symbol: "S3", name: "S3", family: "Cloud & Platforms" },
  { number: 14, symbol: "Cf", name: "CloudFront", family: "Cloud & Platforms" },
  { number: 15, symbol: "Gt", name: "Git", family: "Cloud & Platforms" },
  { number: 16, symbol: "Ag", name: "Agile/Scrum", family: "Cloud & Platforms" },
  { number: 17, symbol: "Cu", name: "Cursor", family: "AI Tools" },
  { number: 18, symbol: "Cl", name: "Claude", family: "AI Tools" },
  { number: 19, symbol: "Gp", name: "ChatGPT", family: "AI Tools" },
  { number: 20, symbol: "Mg", name: "Magensa", family: "Integrations" },
  { number: 21, symbol: "Dc", name: "Datacap", family: "Integrations" },
  { number: 22, symbol: "Id", name: "iDynamo6", family: "Integrations" },
  { number: 23, symbol: "Df", name: "DynaFlex", family: "Integrations" },
  { number: 24, symbol: "Po", name: "POS", family: "Integrations" },
  { number: 25, symbol: "Ks", name: "Kiosk systems", family: "Integrations" },
  { number: 26, symbol: "Kg", name: "Kiosk Gamecard", family: "Integrations" },
];

// ---------------------------------------------------------------------------
// Experience — every role from "WORK EXPERIENCE", newest first in the
// résumé but rendered oldest → newest on the combined timeline.
// ---------------------------------------------------------------------------

export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  period: string;
  sortKey: string; // ISO-ish yyyy-mm for chronological sorting
  bullets: string[];
  achievements?: string[];
  focusAreas?: string[];
};

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "trainee",
    company: "Innodeed Systems Pvt Ltd",
    role: "Software Engineer Trainee",
    period: "May 2021",
    sortKey: "2021-05",
    bullets: [
      "Built responsive, reusable UI components and complex forms using ReactJS.",
      "Participated in Agile workflows and contributed to production features early.",
    ],
  },
  {
    id: "associate-se",
    company: "Innodeed Systems Pvt Ltd",
    role: "Associate Software Engineer",
    period: "Nov 2021 – Oct 2023",
    sortKey: "2021-11",
    bullets: [
      "Built and scaled responsive React-based booking and payment applications from early-stage development to production-grade deployment.",
      "Integrated Magensa payment gateway with POS hardware systems (iDynamo6, DynaFlex, EMV devices) and implemented payment, voucher, gift card, Apple Pay, and Google Pay integrations.",
      "Built responsive, iPad-optimized booking interfaces and a QR-based game card system for real-world operations.",
      "Collaborated with backend, QA, design, and business teams to build scalable applications integrated with RESTful services and service-based backend systems.",
    ],
    achievements: [
      "Successfully deployed solutions across 300+ iPads in 100+ outlets, enabling large-scale on-ground operations",
      "Enabled seamless hardware-based payment workflows in live environments",
      "Contributed to the foundation of a system now scaling to 1.3M+ API requests/day",
    ],
  },
  {
    id: "software-engineer",
    company: "Innodeed Systems Pvt Ltd",
    role: "Software Engineer",
    period: "Nov 2023 – June 2026",
    sortKey: "2023-11",
    bullets: [
      "Led the design and scaling of high-volume booking and payment applications handling 1.3M+ API requests/day (~25 req/sec peak).",
      "Owned end-to-end feature delivery by translating business requirements into scalable technical solutions for complex workflows including Payments, Refunds, Slot Availability, Cancellations, Business Onboarding etc.",
      "Spearheaded Magensa to Datacap migration across live production systems with zero customer impact.",
      "Leveraged Claude, ChatGPT, and Cursor regularly for debugging, code generation, workflow acceleration, and rapid prototyping as part of day-to-day development.",
      "Implemented Next.js SSR security enhancements and drove 30-40% performance improvements through frontend refactoring, API optimization, and REST service integration.",
      "Worked with AWS Amplify and CodePipeline for deployment across environments, CloudWatch for production log analysis, and AWS CodeCommit for repository and code review workflows.",
      "Contributed to V1 to V2 platform migration and architecture discussions, improving scalability, maintainability, and frontend system design.",
      "Improved engineering quality through code reviews, unit testing, reusable architecture patterns, and maintainable coding standards; authored PRDs and engineering documentation.",
      "Troubleshot frontend, API integration, and production issues, and collaborated with backend, QA, design, and business teams to deliver reliable solutions.",
      "Mentored developers and interns, transforming trainees into productive contributors, and supported hiring.",
    ],
    achievements: [
      "Stabilized high-volume transaction systems processing $2B+ in payments",
      "Delivered scalable solutions across 100+ client locations",
      "Improved system reliability under peak traffic conditions",
    ],
    focusAreas: [
      "Frontend Performance",
      "Scalable UI Architecture",
      "Developer Experience (DevEx)",
      "Payment Workflows",
    ],
  },
  {
    id: "business-analyst",
    company: "SBI Cards",
    role: "Business Analyst",
    period: "July 2026 – Present",
    sortKey: "2026-07",
    bullets: [
      "Worked on Unify, an internal Consent Management Platform under the DPDP Act, coordinating business and technical teams to ensure the Next.js admin panel and Java backend aligned with business objectives.",
      "Owned functional and technical documentation from RFP through go-live, translating business requirements into FSD and TDD and aligning business, technical, and downstream teams throughout delivery.",
      "Reviewed project documentation and Figma designs before development, driving multiple iterations to ensure UI and workflows reflected business expectations; coordinated API and file-based integrations across SBI Cards teams.",
      "Coordinated cross-team dependencies within a 3-month delivery timeline, managing ServiceNow and CMR procedures, WBS tracking, infrastructure and database setup, DNS and port-opening requests, and deployment dependencies.",
      "Managed project governance including risk assessments, source-code approvals, SBOM reviews, SIT/UAT coordination, stakeholder signoffs, and walkthroughs for downstream and testing teams.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Education — "EDUCATION" section of the résumé.
// ---------------------------------------------------------------------------

export type EducationEntry = {
  id: string;
  degree: string;
  school: string;
  year: string;
  sortKey: string;
};

export const EDUCATION: EducationEntry[] = [
  {
    id: "bsc",
    degree: "B.Sc (Computer Science)",
    school: "St. Thomas College, Bhilai",
    year: "2019",
    sortKey: "2019-06",
  },
  {
    id: "mca",
    degree: "MCA",
    school: "Bhilai Institute of Technology, Durg",
    year: "2021",
    sortKey: "2021-01",
  },
];

// Combined, chronologically-sorted timeline for the Experience section.
export type TimelineStop =
  | ({ kind: "education" } & EducationEntry)
  | ({ kind: "experience" } & ExperienceEntry);

export const TIMELINE: TimelineStop[] = [
  ...EDUCATION.map((e) => ({ kind: "education" as const, ...e })),
  ...EXPERIENCE.map((e) => ({ kind: "experience" as const, ...e })),
].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

// ---------------------------------------------------------------------------
// Projects — derived from the two named initiatives in "WORK EXPERIENCE"
// (Booking Zone, Unify). The résumé has no dedicated "Projects" section and
// no project links, so these two are built directly from the experience
// bullets rather than from invented project copy, and carry no GitHub link
// since none exists in the résumé.
// ---------------------------------------------------------------------------

export type Project = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  description: string;
  features: string[];
  tech: string[];
  github?: string;
  screenshot?: { src: string; alt: string };
};

export const PROJECTS: Project[] = [
  {
    id: "booking-zone",
    index: "01",
    kicker: "Booking & payment platform · since 2021",
    title: "Booking Zone",
    description:
      "A high-volume booking and payment platform that Arohi has been a core contributor to since 2021 — scaled to 100+ clients and 20,000+ users, processing $2B+ in payments while handling 1.3M+ API requests a day (~25 req/sec at peak).",
    features: [
      "Payments, refunds, slot availability, cancellations and business onboarding workflows",
      "Magensa → Datacap payment-gateway migration across live production with zero customer impact",
      "iDynamo6 / DynaFlex / POS & kiosk hardware integrations, plus Apple Pay and Google Pay",
      "V1 → V2 platform migration and Next.js SSR security hardening (30–40% performance gains)",
    ],
    tech: [
      "ReactJS",
      "Redux",
      "TypeScript",
      "NextJS",
      "AWS Amplify",
      "CodePipeline",
      "CloudWatch",
      "Magensa",
      "Datacap",
      "iDynamo6",
      "DynaFlex",
      "Kiosk Gamecard",
    ],
    screenshot: {
      src: "/work/booking-zone-calendar.webp",
      alt:
        "Booking Zone calendar reservation screen with weekly schedule, reservation cards, and booking summary panel",
    },
  },
  {
    id: "unify",
    index: "02",
    kicker: "Consent Management Platform · DPDP Act",
    title: "Unify",
    description:
      "An internal Consent Management Platform built for SBI Cards under India's DPDP Act, pairing a Next.js admin panel with a Java backend. Arohi coordinated business and technical teams from RFP through go-live.",
    features: [
      "Owned FSD/TDD documentation from RFP through go-live",
      "Reviewed Figma designs and drove UI/workflow iterations with business stakeholders",
      "Coordinated API and file-based integrations across SBI Cards teams",
      "Managed ServiceNow/CMR, WBS tracking and infra/DNS dependencies within a 3-month window",
    ],
    tech: ["NextJS", "Figma", "Agile/Scrum"],
  },
];

// ---------------------------------------------------------------------------
// Certifications — MOCK DATA. The résumé has no certifications section yet.
// Arohi will supply the real list to replace these three placeholder rows.
// ---------------------------------------------------------------------------

export type Certification = {
  id: string;
  index: string;
  title: string;
  issuer: string;
};

export const CERTIFICATIONS: Certification[] = [
  // MOCK — replace with real certifications
  { id: "cert-1", index: "01", title: "React – The Complete Guide", issuer: "Udemy" },
  // MOCK — replace with real certifications
  { id: "cert-2", index: "02", title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services" },
  // MOCK — replace with real certifications
  { id: "cert-3", index: "03", title: "JavaScript Algorithms and Data Structures", issuer: "freeCodeCamp" },
];

// ---------------------------------------------------------------------------
// Achievements — MOCK DATA. The résumé has no coding-platform stats yet.
// Arohi will supply real numbers/ranks to replace these placeholder cards.
// ---------------------------------------------------------------------------

export type Achievement = {
  id: string;
  index: number;
  total: number;
  logo: string; // public/logos path
  label: string;
  caption: string;
  detail: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  // MOCK — replace with real platform stats
  {
    id: "leetcode",
    index: 1,
    total: 3,
    logo: "/logos/leetcode.svg",
    label: "LeetCode",
    caption: "Problems solved across easy, medium and hard",
    detail: "Consistent weekly practice",
    value: 150,
    suffix: "+",
  },
  // MOCK — replace with real platform stats
  {
    id: "github",
    index: 2,
    total: 3,
    logo: "/logos/github.svg",
    label: "GitHub",
    caption: "Personal and open-source repositories",
    detail: "Public + private projects",
    value: 40,
    suffix: "+",
  },
  // MOCK — replace with real platform stats
  {
    id: "hackerrank",
    index: 3,
    total: 3,
    logo: "/logos/hackerrank.svg",
    label: "HackerRank",
    caption: "JavaScript problem-solving track",
    detail: "5-star rating",
    value: 5,
    suffix: "★",
  },
];
