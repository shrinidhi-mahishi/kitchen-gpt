"use client";

import { useState, useRef } from "react";
import {
  analyzeDish,
  recipesByIngredients,
  nearbyRestaurants,
  getCurrentPosition,
  type DishAnalysisResponse,
  type RecipeSearchResponse,
  type FoodAnalysis,
  type Recipe,
  type YouTubeVideo,
  type Restaurant,
} from "../lib/api";
import RecipeCard from "../components/RecipeCard";
import YouTubeCard from "../components/YouTubeCard";
import RestaurantCard from "../components/RestaurantCard";
import LoadingSpinner from "../components/LoadingSpinner";


type Tab = "scan" | "ingredients";

const SUGGESTIONS = [
  "paneer, tomato, onion",
  "rice, lemon, mustard seeds",
  "dal, spinach, garlic",
  "potato, cumin, chili",
];

export default function CookPage() {
  const [tab, setTab] = useState<Tab>("scan");
  const [loading, setLoading] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [ingredientInput, setIngredientInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const hasResults = Boolean(analysis || recipes.length > 0);

  function resetResults() {
    setAnalysis(null);
    setRecipes([]);
    setVideos([]);
    setRestaurants([]);
    setError(null);
  }

  function clearAll() {
    resetResults();
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  function switchTab(t: Tab) {
    setTab(t);
    clearAll();
  }

  async function handleImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, or WebP).");
      return;
    }

    resetResults();
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setLoading(true);

    try {
      const data: DishAnalysisResponse = await analyzeDish(file);
      setAnalysis(data.analysis);
      setRecipes(data.recipes ?? []);
      setVideos(data.youtube_videos ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleIngredients() {
    const parts = ingredientInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) {
      setError("Enter at least one ingredient.");
      return;
    }

    resetResults();
    setLoading(true);
    try {
      const data: RecipeSearchResponse = await recipesByIngredients(parts);
      setRecipes(data.recipes ?? []);
      setVideos(data.youtube_videos ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleFindRestaurants() {
    const dishName =
      analysis?.dish_name || (recipes.length > 0 ? recipes[0].title : null);
    if (!dishName) return;

    setLoadingRestaurants(true);
    setError(null);
    try {
      const { lat, lng } = await getCurrentPosition();
      const data = await nearbyRestaurants(dishName, lat, lng);
      setRestaurants(data ?? []);
      if (!data?.length) {
        setError("No nearby restaurants found for this dish near your location.");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Restaurant search failed");
    } finally {
      setLoadingRestaurants(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {tab === "scan" ? "Scan a dish" : "Cook from ingredients"}
        </h1>
        <p className="mt-2 text-[#9E9E9E]">
          {tab === "scan"
            ? "Upload a food photo — AI identifies the dish and builds Indian recipes."
            : "List what you have on hand and get step-by-step recipes."}
        </p>
      </div>

      <div className="flex gap-1 rounded-xl bg-[#111] p-1">
        <button
          type="button"
          onClick={() => switchTab("scan")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === "scan"
              ? "bg-[#00E5FF] text-black"
              : "text-[#9E9E9E] hover:text-white"
          }`}
        >
          Scan a Dish
        </button>
        <button
          type="button"
          onClick={() => switchTab("ingredients")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === "ingredients"
              ? "bg-[#BB86FC] text-black"
              : "text-[#9E9E9E] hover:text-white"
          }`}
        >
          By Ingredients
        </button>
      </div>

      {tab === "scan" && !loading && !hasResults && !error && (
        <div className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleImage(file);
            }}
            onClick={() => fileRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition sm:p-14 ${
              dragOver
                ? "border-[#00E5FF] bg-[#00E5FF]/10"
                : "border-[#333] bg-[#0a0a0a] hover:border-[#00E5FF]/50"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImage(file);
              }}
            />
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00E5FF]/10 text-3xl">
              📷
            </div>
            <p className="font-display text-lg font-semibold">
              Drop a food photo here or click to upload
            </p>
            <p className="mt-2 text-sm text-[#9E9E9E]">
              JPEG, PNG, WebP supported
            </p>
          </div>
        </div>
      )}

      {tab === "ingredients" && !loading && !hasResults && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleIngredients()}
              placeholder="e.g. paneer, tomato, onion"
              className="flex-1 rounded-xl border border-[#333] bg-[#111] px-4 py-3 text-white placeholder:text-[#666] transition focus:border-[#BB86FC] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleIngredients}
              className="rounded-xl bg-[#BB86FC] px-6 py-3 font-bold text-black transition hover:bg-[#9C64FF]"
            >
              Get Recipes
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setIngredientInput(s)}
                className="rounded-full border border-[#2a2a2a] bg-[#111] px-3 py-1.5 text-xs text-[#9E9E9E] transition hover:border-[#BB86FC]/40 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <LoadingSpinner
          message={
            tab === "scan"
              ? "Identifying dish & generating recipes..."
              : "Generating recipes from your ingredients..."
          }
        />
      )}

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-900/20 p-4 text-red-300">
          <p>{error}</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-3 text-sm font-semibold text-[#00E5FF] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && hasResults && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#9E9E9E]">
              {recipes.length} recipe{recipes.length === 1 ? "" : "s"} ready
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-[#333] px-3 py-1.5 text-sm text-[#9E9E9E] transition hover:border-[#00E5FF]/40 hover:text-white"
            >
              Start over
            </button>
          </div>

          {previewUrl && (
            <div className="overflow-hidden rounded-2xl border border-[#222]">
              <img
                src={previewUrl}
                alt="Uploaded dish"
                className="max-h-64 w-full object-cover"
              />
            </div>
          )}

          {analysis && (
            <div className="rounded-2xl border border-[#222] bg-[#111] p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-bold">
                  {analysis.dish_name}
                </h2>
                <span className="shrink-0 rounded-full bg-[#00E5FF]/10 px-3 py-1 text-sm font-bold text-[#00E5FF]">
                  {Math.round(analysis.confidence * 100)}%
                </span>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {analysis.cuisine_type && (
                  <span className="rounded-lg bg-[#BB86FC]/10 px-3 py-1 text-sm font-semibold text-[#BB86FC]">
                    {analysis.cuisine_type}
                  </span>
                )}
                <span className="rounded-lg bg-[#1a1a1a] px-3 py-1 text-sm text-[#9E9E9E]">
                  ~{analysis.calories_estimate} kcal
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.detected_ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-md bg-[#1a1a1a] px-2 py-1 text-xs text-[#ccc]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recipes.length > 0 && (
            <section>
              <h3 className="mb-4 font-display text-lg font-bold">
                Matching Recipes
              </h3>
              {recipes.map((r, i) => (
                <RecipeCard key={`${r.title}-${i}`} recipe={r} />
              ))}
            </section>
          )}

          {videos.length > 0 && (
            <section>
              <h3 className="mb-4 font-display text-lg font-bold">
                Watch on YouTube
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {videos.map((v) => (
                  <YouTubeCard key={v.video_id} video={v} />
                ))}
              </div>
            </section>
          )}

          {recipes.length > 0 && restaurants.length === 0 && (
            <div className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6 text-center">
              <p className="mb-4 text-sm text-[#9E9E9E]">
                Want to eat out instead? Find places serving this nearby.
              </p>
              <button
                type="button"
                onClick={handleFindRestaurants}
                disabled={loadingRestaurants}
                className="rounded-xl border border-[#03DAC6] px-6 py-3 font-semibold text-[#03DAC6] transition hover:bg-[#03DAC6]/10 disabled:opacity-50"
              >
                {loadingRestaurants
                  ? "Searching nearby..."
                  : "Find Nearby Restaurants"}
              </button>
            </div>
          )}

          {restaurants.length > 0 && (
            <section>
              <h3 className="mb-4 font-display text-lg font-bold">
                Nearby Restaurants
              </h3>
              {restaurants.map((r, i) => (
                <RestaurantCard key={`${r.name}-${i}`} restaurant={r} />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
