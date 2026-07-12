import Link from "next/link";

type BrandMarkProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
};

const sizes = {
  sm: { box: 28, text: "text-[15px]" },
  md: { box: 34, text: "text-lg" },
  lg: { box: 44, text: "text-xl" },
};

function MarkIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="kgpt-ring" x1="8" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00E5FF" />
          <stop offset="1" stopColor="#BB86FC" />
        </linearGradient>
        <linearGradient id="kgpt-hat" x1="12" y1="10" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7CF5FF" />
          <stop offset="1" stopColor="#00B8D4" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18.5" stroke="url(#kgpt-ring)" strokeWidth="1.5" fill="#0A0A0A" />
      {/* chef hat */}
      <path
        d="M13.5 24.5h13v1.8c0 .7-.6 1.2-1.2 1.2H14.7c-.7 0-1.2-.5-1.2-1.2v-1.8Z"
        fill="url(#kgpt-hat)"
      />
      <path
        d="M14 24.2c0-4.2 2.2-7.4 6-7.4s6 3.2 6 7.4"
        stroke="url(#kgpt-hat)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="15.2" cy="19.2" r="2.1" fill="url(#kgpt-hat)" />
      <circle cx="20" cy="16.4" r="2.5" fill="url(#kgpt-hat)" />
      <circle cx="24.8" cy="19.2" r="2.1" fill="url(#kgpt-hat)" />
      {/* spark */}
      <path
        d="M28.5 11.2l.55 1.55 1.55.55-1.55.55-.55 1.55-.55-1.55-1.55-.55 1.55-.55.55-1.55Z"
        fill="#BB86FC"
      />
    </svg>
  );
}

export default function BrandMark({
  href = "/",
  size = "md",
  showWordmark = true,
  className = "",
}: BrandMarkProps) {
  const s = sizes[size];

  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className="relative shrink-0 drop-shadow-[0_0_12px_rgba(0,229,255,0.35)]"
        style={{ width: s.box, height: s.box }}
      >
        <MarkIcon size={s.box} />
      </span>
      {showWordmark && (
        <span
          className={`font-display font-bold leading-none tracking-[-0.03em] ${s.text}`}
        >
          <span className="text-white">Kitchen</span>
          <span className="text-[#00E5FF]">GPT</span>
        </span>
      )}
    </span>
  );

  if (!href) return <span className="inline-flex items-center">{content}</span>;

  return (
    <Link
      href={href}
      className="inline-flex items-center transition-opacity hover:opacity-90"
      aria-label="KitchenGPT home"
    >
      {content}
    </Link>
  );
}
