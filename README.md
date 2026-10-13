# Arohi Sharma — Portfolio

A single-page, black/white/gray portfolio for Arohi Sharma, Frontend Software
Engineer. Built with Next.js 15 (App Router), React 19, TypeScript and
Tailwind CSS 4. One continuous scroll, no splash screen, no page transitions,
no 3D/WebGL — just CSS animation, `IntersectionObserver` reveals, a couple of
small `requestAnimationFrame` loops (ID-card pendulum, count-up numbers), and
[Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build (type-check + lint + prerender)
npm run start   # serve the production build
npm run lint    # eslint
```

Current production build: **130 kB First Load JS**, 0 type/lint errors, all
routes statically prerendered.

## Sections

The page is one `<main>` with eight sections, in this order:

| # | Section | File | What it does |
|---|---------|------|---------------|
| 00 | Hero | `src/components/hero/Hero.tsx` | Looping intro video (background removed, blended into the page with `mix-blend-mode: multiply`), name/role heading, sound unlock on first interaction, pauses the video via `IntersectionObserver` when it scrolls out of view. |
| 01 | About | `src/components/sections/About.tsx` | A lanyard ID card on a physics-driven strap (spring/damper pendulum, idle sway + pointer-velocity impulses) that flips with hover, click, or Enter/Space to reveal a "What I am" back face. Quick-facts column with education, role, email and a quote — all from the résumé. |
| 02 | Skills | `src/components/sections/Skills.tsx` | A periodic-table-style grid of every skill on the résumé, filterable by family, with brand logos (`TechLogo`) and a sticky inspector panel showing which project(s) used the selected skill. |
| 03 | Work | `src/components/sections/Work.tsx` | Expanding accordion gallery of projects, each with an illustrative (clearly labeled, non-screenshot) mock UI panel. |
| 04 | Certifications | `src/components/sections/Certifications.tsx` | Numbered list with an ink-flood hover/focus reveal. **Placeholder data — see below.** |
| 05 | Experience | `src/components/sections/Experience.tsx` | Scroll-progress timeline (education + every role from the résumé) with a filling spine and lit stop-dots. |
| 06 | Achievements | `src/components/sections/Achievements.tsx` | Pinned, horizontally-panning gallery of stat cards with count-up numbers as each card comes into view. **Placeholder data — see below.** |
| 07 | Contact | `src/components/sections/Contact.tsx` | Per-letter "hop" heading, copy-to-clipboard email chip, and links to résumé/GitHub/LinkedIn. |

All copy, numbers, dates and links live in **`src/lib/data.ts`** — nothing is
hardcoded in the components. If a field isn't in the résumé, it isn't shown.

### Placeholder data

The résumé has no public project-repo links, no listed certifications, and no
public coding-profile stats. Per instruction, those sections were built with
clearly-marked **mock data** so the layout/interactions exist today and can be
swapped for real data later:

- `CERTIFICATIONS` in `src/lib/data.ts` — each entry is commented
  `// MOCK — replace with real certifications`.
- `ACHIEVEMENTS` in `src/lib/data.ts` — each entry is commented
  `// MOCK — replace with real platform stats`.

`PROJECTS`, `EXPERIENCE`, `EDUCATION`, `SKILL_GROUPS` and everything in
`PROFILE` are all derived directly from the résumé — nothing fabricated.

## Rebuilding the hero video

The hero video isn't just the raw phone clip — it's been background-removed,
cropped to the person, and turned into a seamless 10-second loop. The whole
pipeline is one script, with no ML/GPU dependencies (ffmpeg + numpy + Pillow
only):

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install numpy pillow

python3 scripts/build-hero-assets.py \
  --video assets-src/<your-source-clip>.mp4 \
  --photo assets-src/<your-headshot>.jpg \
  --crop 720:900:0:30 \
  --loop-seconds 10 --overlap-ms 500
```

Requires `ffmpeg`/`ffprobe` on `PATH`. What it does:

1. **Crop** the source clip around the person and scale to 768px wide.
2. **Remove the background** — pixels are keyed by lightness + saturation
   (soft smoothstep threshold, not a hard chroma key, since the backdrop
   isn't a flat color) and composited onto pure white.
3. **Loop seamlessly** — the tail of the clip is cross-faded into its own
   head (the same technique as ffmpeg's `xfade`, reimplemented by hand so the
   *identical* alpha ramp can be applied sample-accurately to the PCM audio;
   `ffmpeg acrossfade` was avoided because it can drop/misalign samples at
   the boundary).
4. **Encode** `public/hero/hero.mp4` (H.264, CRF 24, preset slow, AAC
   96 kbps, `+faststart`) and `public/hero/hero.webm` (VP9 CRF 36, Opus
   80 kbps).
5. Also crops the headshot photo into `public/portrait-bust.webp` (480×600,
   used on the ID card) and `public/og.jpg` (1200×630, social preview image).

Run `python3 scripts/build-hero-assets.py --help` for every flag (manual crop
box, fps, loop length, crossfade duration, etc).

## Fonts

Self-hosted via `next/font/local` (`src/fonts/`) — no Google Fonts/CDN
requests at runtime:

- **Inter Tight** — headings and body text
- **Instrument Serif** — the single italic accent word at the end of every
  heading
- **JetBrains Mono** — section tags, numbers, labels

All three are licensed under the [SIL Open Font License](src/fonts/LICENSE.txt).

## Logo credits

Brand marks in `public/logos/` are sourced from two open icon sets:

- [devicon](https://github.com/devicons/devicon) (MIT) — react, redux,
  typescript, javascript, nextjs, html5, css3, git, materialui, aws,
  linkedin, github, figma
- [simple-icons](https://github.com/simple-icons/simple-icons) (CC0) —
  claude, cursor, leetcode, hackerrank

Full license text for each set is in `public/logos/LICENSE-devicon.txt` and
`public/logos/LICENSE-simple-icons.txt`. Tools/integrations with no official
mark (Agile/Scrum, ChatGPT, Magensa, Datacap, iDynamo6, DynaFlex, POS/Kiosk
systems) use small custom line icons instead, defined in
`src/components/ui/TechLogo.tsx`.

## Design system

Defined in `src/app/globals.css`:

- **Palette**: `--paper #f4f2ee`, `--card #fff`, `--ink #0d0d0d`,
  `--ink-2 #3a3a3a`, `--mute #77756f`, `--faint #a9a6a0` — black, white and
  gray only. The only color ever shown is a brand logo's own official color
  (plus an optional soft tint glow behind it).
- **Type scale**: bold Inter Tight headings (tight tracking, `line-height: 1`)
  that each end in one *Instrument Serif* italic word.
- Reveal-on-scroll is driven by two global classes, `.rv` / `.rv-mask`, wired
  up once in `src/lib/hooks.ts` (`useRevealObserver`) via a single shared
  `IntersectionObserver`.
- `prefers-reduced-motion: reduce` disables Lenis smooth scroll and
  immediately reveals all `.rv`/`.rv-mask` content — verified via Chrome
  media-feature emulation (55/55 elements revealed instantly, no motion
  dependency).

## Accessibility & responsiveness notes

- Semantic landmarks, correct heading order (one `<h1>` in the hero, `<h2>`
  per section, `<h3>` for sub-items).
- Visible focus-visible outlines; the ID card and nav are fully operable by
  keyboard (Tab, Enter/Space to flip the card, Esc to close the mobile menu).
- Verified with no horizontal overflow from 390px to 1920px
  (`document.documentElement.scrollWidth === window.innerWidth` at both
  1440×900 and 390×844).
- `color-scheme: light only` keeps the palette consistent regardless of OS
  dark-mode setting (per the "no dark sections" rule).
