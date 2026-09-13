import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import "./vitrine.css";

import { LayoutChrome } from "@/components/layout-chrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "CORE ENVIRONNEMENT · Location de benne Île-de-France — Intervention 24h",
    template: "%s | CORE ENVIRONNEMENT",
  },
  description:
    "Location de bennes en Île-de-France. Commande en 3 minutes, intervention sous 24 h, suivi digital et traçabilité de vos déchets.",
  icons: {
    icon: "/images/faviconcore-environnement.png",
    apple: "/images/faviconcore-environnement.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${dmSans.variable}`}>
      <body
        className={`${geistSans.variable} ${dmSans.variable} ${geistMono.variable} relative min-h-screen bg-background font-sans antialiased`}
      >
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
