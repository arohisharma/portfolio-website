import type { Metadata, Viewport } from "next";
import { interTight, instrumentSerif, jetbrainsMono } from "@/fonts";
import { PROFILE } from "@/lib/data";
import "./globals.css";

const title = `${PROFILE.name} — ${PROFILE.role}`;
const description = PROFILE.resumeSummary;
const siteUrl = "https://arohisharma.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title,
    description,
    type: "profile",
    url: siteUrl,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: PROFILE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
