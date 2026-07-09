const steps = [
  { number: "1", text: "Snap a photo or enter ingredients", icon: "📷" },
  { number: "2", text: "AI generates authentic Indian recipes", icon: "🤖" },
  { number: "3", text: "Watch videos & find nearby restaurants", icon: "🎬" },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How it <span className="text-[#BB86FC]">works</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {steps.map((s, i) => (
            <div key={s.number} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-3xl mb-4">
                {s.icon}
              </div>
              <div className="text-sm font-bold text-[#00E5FF] mb-1">
                Step {s.number}
              </div>
              <p className="text-[#9E9E9E] max-w-[200px]">{s.text}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute translate-x-[140px] text-[#333] text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
