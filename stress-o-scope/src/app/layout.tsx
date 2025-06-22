import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Layout as UILayout } from "@/components/ui"; // Renamed to avoid conflict with this RootLayout

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stress-O-Scope - Measure Your Cosmic Stress",
  description: "An interactive web application to measure stress through a series of engaging cosmic-themed games.",
  keywords: "stress measurement, stress test, mental well-being, interactive games, cosmic theme, AI analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans h-full bg-deep-space`}
      >
        <GameProvider>
          <UILayout>
            {children}
          </UILayout>
        </GameProvider>
      </body>
    </html>
  );
}
