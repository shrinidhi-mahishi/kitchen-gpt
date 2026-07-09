import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-[#E6E6E6] antialiased`}>
        {children}
      </body>
    </html>
  );
}
