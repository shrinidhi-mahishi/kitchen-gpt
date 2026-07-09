const features = [
  {
    icon: "📸",
    title: "Scan a Dish",
    description:
      "Take a photo of any dish and AI identifies it, lists ingredients, and estimates calories.",
    color: "#00E5FF",
  },
  {
    icon: "🍳",
    title: "Get Indian Recipes",
    description:
      "Enter ingredients you have and get step-by-step recipes across North Indian, South Indian, Bengali, and more.",
    color: "#BB86FC",
  },
  {
    icon: "📍",
    title: "Find Restaurants",
    description:
      "Discover nearby restaurants serving your favourite dish, with ratings and directions.",
    color: "#03DAC6",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything you need to{" "}
          <span className="text-[#00E5FF]">cook smarter</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-[#111] border border-[#222] hover:border-[#333] transition"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: f.color }}
              >
                {f.title}
              </h3>
              <p className="text-[#9E9E9E] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
