import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CelestialBackground from "@/components/CelestialBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoulBuddy - Your AI-Powered Spiritual Guide",
  description: "Get personalized spiritual guidance through astrology and numerology with SoulBuddy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CelestialBackground />
        <main className="relative z-10 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
