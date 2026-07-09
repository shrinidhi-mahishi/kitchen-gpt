import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-[#222]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="KitchenGPT" width={36} height={36} />
          <span className="font-bold text-lg">KitchenGPT</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/app"
            className="px-4 py-2 rounded-lg bg-[#00E5FF] text-black font-semibold text-sm hover:bg-[#00B8D4] transition"
          >
            Try Web App
          </Link>
        </div>
      </div>
    </nav>
  );
}
