"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "../components/BrandMark";

const links = [
  { href: "/", label: "Cook", match: (p: string) => p === "/" },
  {
    href: "/nearby",
    label: "Nearby",
    match: (p: string) => p.startsWith("/nearby"),
  },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,229,255,0.12), transparent 70%)",
        }}
      />

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/75 px-6 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <BrandMark size="sm" />

          <div className="flex items-center gap-1 rounded-full bg-[#111] p-1">
            {links.map((link) => {
              const active = link.match(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[#00E5FF] text-black"
                      : "text-[#9E9E9E] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
