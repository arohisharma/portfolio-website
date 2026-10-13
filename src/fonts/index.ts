import localFont from "next/font/local";

/** Inter Tight — display and body text. Variable weight, upright + italic. */
export const interTight = localFont({
  src: [
    { path: "./InterTight-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "./InterTight-Italic-Variable.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-inter-tight",
  display: "swap",
});

/** Instrument Serif — the single italic accent word inside each heading. */
export const instrumentSerif = localFont({
  src: [
    { path: "./InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

/** JetBrains Mono — small labels, section indices and numbers. */
export const jetbrainsMono = localFont({
  src: [{ path: "./JetBrainsMono-Variable.woff2", weight: "100 800", style: "normal" }],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
