import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KitchenGPT — AI-Powered Indian Cooking Assistant",
  description:
    "Snap a dish photo or enter ingredients to get authentic Indian recipes, YouTube cooking videos, and nearby restaurant suggestions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body
        className="min-h-screen bg-black text-[#E8E8E8] antialiased"
        style={
          {
            "--font-display": "var(--font-syne)",
            "--font-body": "var(--font-dm-sans)",
            fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
