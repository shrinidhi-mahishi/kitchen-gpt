"use client";

import { useState } from "react";
import type { Recipe } from "../lib/api";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-[#111] border border-[#222] overflow-hidden mb-4">
      <div className="px-5 py-4 bg-[#0a1a1a] border-b border-[#222] flex items-center justify-between">
        <h3 className="font-bold text-[#00E5FF]">{recipe.title}</h3>
        <button
          onClick={() => {
            const text = `${recipe.title}\n${recipe.steps.map(s => `${s.number}. ${s.step}`).join("\n")}`;
            navigator.clipboard.writeText(text);
          }}
          className="text-[#9E9E9E] hover:text-[#00E5FF] transition text-sm"
          title="Copy recipe"
        >
          📋
        </button>
      </div>
      <div className="p-5">
        <div className="flex gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-xs text-[#9E9E9E]">
            ⏱ {recipe.ready_in_minutes} min
          </span>
          <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-xs text-[#9E9E9E]">
            👥 {recipe.servings} srv
          </span>
        </div>
        {recipe.summary && (
          <p className="text-sm text-[#9E9E9E] mb-3">{recipe.summary}</p>
        )}
        {recipe.ingredients_used.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.ingredients_used.map((ing) => (
              <span
                key={ing}
                className="px-2 py-1 rounded-md bg-[#1a1a1a] text-xs text-[#ccc]"
              >
                {ing}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-semibold text-[#00E5FF] hover:text-[#00B8D4] transition"
        >
          {expanded ? "Hide" : "Show"} Instructions ({recipe.steps.length} steps)
        </button>
        {expanded && (
          <div className="mt-4 space-y-3">
            {recipe.steps.map((s) => (
              <div key={s.number} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#00E5FF] text-black flex items-center justify-center text-xs font-bold shrink-0">
                  {s.number}
                </div>
                <p className="text-sm text-[#ccc] leading-relaxed">{s.step}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
