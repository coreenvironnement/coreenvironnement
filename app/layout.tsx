import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Core Environnement · Bennes sous 24 h sur les Yvelines (78)",
    template: "%s | Core Environnement",
  },
  description:
    "Commandez une benne en quelques minutes. Livraison et intervention terrain en moins de 24 h (équipe locale à Élancourt, forfaits clairs sur le 78).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geistSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen bg-background font-sans antialiased`}
      >
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 110% 90% at 50% -30%, color-mix(in srgb, #38a234 16%, transparent), transparent 58%),
              radial-gradient(ellipse 55% 45% at 100% 0%, color-mix(in srgb, #1b418f 10%, transparent), transparent 50%),
              var(--background)
            `,
          }}
        />
        <SiteHeader />
        <main className="relative z-0 pt-28 sm:pt-32">{children}</main>
      </body>
    </html>
  );
}
