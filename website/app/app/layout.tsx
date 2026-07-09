import Link from "next/link";
import Image from "next/image";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-[#050505] border-b border-[#222] px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="KitchenGPT" width={28} height={28} />
            <span className="font-bold">KitchenGPT</span>
          </Link>
          <div className="flex gap-1">
            <Link
              href="/app"
              className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#111] transition"
            >
              Cook
            </Link>
            <Link
              href="/app/nearby"
              className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#111] transition"
            >
              Nearby
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-6">
        {children}
      </main>
    </div>
  );
}
