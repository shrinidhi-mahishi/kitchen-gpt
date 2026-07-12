"use client";

import { useState } from "react";
import type { Recipe } from "../lib/api";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyRecipe() {
    const text = [
      recipe.title,
      `${recipe.ready_in_minutes} min · ${recipe.servings} servings`,
      "",
      "Ingredients:",
      ...recipe.ingredients_used.map((i) => `• ${i}`),
      ...(recipe.ingredients_extra?.length
        ? ["", "Also need:", ...recipe.ingredients_extra.map((i) => `• ${i}`)]
        : []),
      "",
      "Steps:",
      ...recipe.steps.map((s) => `${s.number}. ${s.step}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-[#222] bg-[#111]">
      <div className="flex items-center justify-between gap-3 border-b border-[#222] bg-[#0a1a1a] px-5 py-4">
        <h3 className="font-display font-bold text-[#00E5FF]">{recipe.title}</h3>
        <button
          type="button"
          onClick={copyRecipe}
          className="shrink-0 text-sm text-[#9E9E9E] transition hover:text-[#00E5FF]"
          title="Copy recipe"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#1a1a1a] px-3 py-1 text-xs text-[#9E9E9E]">
            {recipe.ready_in_minutes} min
          </span>
          <span className="rounded-full bg-[#1a1a1a] px-3 py-1 text-xs text-[#9E9E9E]">
            {recipe.servings} servings
          </span>
        </div>

        {recipe.summary && (
          <p className="mb-3 text-sm text-[#9E9E9E]">{recipe.summary}</p>
        )}

        {recipe.ingredients_used.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {recipe.ingredients_used.map((ing) => (
              <span
                key={ing}
                className="rounded-md bg-[#1a1a1a] px-2 py-1 text-xs text-[#ccc]"
              >
                {ing}
              </span>
            ))}
          </div>
        )}

        {recipe.ingredients_extra?.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#666]">
              Also need
            </p>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients_extra.map((ing) => (
                <span
                  key={ing}
                  className="rounded-md border border-[#333] px-2 py-1 text-xs text-[#9E9E9E]"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-semibold text-[#00E5FF] transition hover:text-[#00B8D4]"
        >
          {expanded ? "Hide" : "Show"} instructions ({recipe.steps.length} steps)
        </button>

        {expanded && (
          <div className="mt-4 space-y-3">
            {recipe.steps.map((s) => (
              <div key={s.number} className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00E5FF] text-xs font-bold text-black">
                  {s.number}
                </div>
                <p className="text-sm leading-relaxed text-[#ccc]">{s.step}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
