import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#222]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[#9E9E9E] text-sm">
          &copy; {new Date().getFullYear()} KitchenGPT. AI Cooking Assistant.
        </div>
        <div className="flex gap-6 text-sm text-[#9E9E9E]">
          <Link href="/app" className="hover:text-[#00E5FF] transition">
            Web App
          </Link>
          <a
            href="https://play.google.com/store/apps/details?id=com.shrinidhi.kitchengpt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00E5FF] transition"
          >
            Android App
          </a>
        </div>
      </div>
    </footer>
  );
}
