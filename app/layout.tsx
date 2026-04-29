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
    default: "Core Environnement — Bennes sous 24 h sur les Yvelines (78)",
    template: "%s | Core Environnement",
  },
  description:
    "Commandez une benne en quelques minutes. Livraison et intervention terrain en moins de 24 h — équipe locale basée à Élancourt, forfaits clairs sur le 78.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geistSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <SiteHeader />
        <div className="pt-28 sm:pt-32">{children}</div>
      </body>
    </html>
  );
}
