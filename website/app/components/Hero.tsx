import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="KitchenGPT Logo"
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
        AI-Powered{" "}
        <span className="text-[#00E5FF]">Indian Cooking</span>{" "}
        Assistant
      </h1>
      <p className="mt-6 text-lg md:text-xl text-[#9E9E9E] max-w-2xl">
        Snap a dish photo or type ingredients — get authentic step-by-step Indian
        recipes, YouTube cooking videos, and nearby restaurants instantly.
      </p>
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          href="/app"
          className="px-8 py-3 rounded-xl bg-[#00E5FF] text-black font-bold text-lg hover:bg-[#00B8D4] transition shadow-lg shadow-[#00E5FF]/20"
        >
          Try Web App
        </Link>
        <a
          href="https://play.google.com/store/apps/details?id=com.shrinidhi.kitchengpt"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 rounded-xl border border-[#BB86FC] text-[#BB86FC] font-bold text-lg hover:bg-[#BB86FC]/10 transition"
        >
          Download Android
        </a>
      </div>
    </section>
  );
}
