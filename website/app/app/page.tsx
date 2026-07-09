"use client";

import { useState, useRef } from "react";
import {
  analyzeDish,
  recipesByIngredients,
  nearbyRestaurants,
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

export default function AppPage() {
  const [tab, setTab] = useState<Tab>("scan");
  const [loading, setLoading] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [ingredientInput, setIngredientInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function resetResults() {
    setAnalysis(null);
    setRecipes([]);
    setVideos([]);
    setRestaurants([]);
    setError(null);
  }

  function switchTab(t: Tab) {
    setTab(t);
    resetResults();
  }

  async function handleImage(file: File) {
    resetResults();
    setLoading(true);
    try {
      const data: DishAnalysisResponse = await analyzeDish(file);
      setAnalysis(data.analysis);
      setRecipes(data.recipes);
      setVideos(data.youtube_videos);
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
    if (parts.length === 0) return;

    resetResults();
    setLoading(true);
    try {
      const data: RecipeSearchResponse = await recipesByIngredients(parts);
      setRecipes(data.recipes);
      setVideos(data.youtube_videos);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleFindRestaurants() {
    const dishName = analysis?.dish_name || (recipes.length > 0 ? recipes[0].title : null);
    if (!dishName) return;

    setLoadingRestaurants(true);
    try {
      let lat: number | undefined;
      let lng: number | undefined;
      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        ).catch(() => null);
        if (pos) {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        }
      }
      const data = await nearbyRestaurants(dishName, lat, lng);
      setRestaurants(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Restaurant search failed");
    } finally {
      setLoadingRestaurants(false);
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#111] rounded-xl mb-6">
        <button
          onClick={() => switchTab("scan")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === "scan"
              ? "bg-[#00E5FF] text-black"
              : "text-[#9E9E9E] hover:text-white"
          }`}
        >
          📸 Scan a Dish
        </button>
        <button
          onClick={() => switchTab("ingredients")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === "ingredients"
              ? "bg-[#BB86FC] text-black"
              : "text-[#9E9E9E] hover:text-white"
          }`}
        >
          🍳 By Ingredients
        </button>
      </div>

      {/* Scan tab */}
      {tab === "scan" && !loading && recipes.length === 0 && !error && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleImage(file);
          }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
            dragOver
              ? "border-[#00E5FF] bg-[#00E5FF]/5"
              : "border-[#333] hover:border-[#00E5FF]/50"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImage(file);
            }}
          />
          <div className="text-5xl mb-4">📷</div>
          <p className="text-lg font-semibold">
            Drop a food photo here or click to upload
          </p>
          <p className="text-sm text-[#9E9E9E] mt-2">
            JPEG, PNG, WebP supported
          </p>
        </div>
      )}

      {/* Ingredients tab */}
      {tab === "ingredients" && !loading && recipes.length === 0 && !error && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleIngredients()}
              placeholder="e.g. paneer, tomato, onion"
              className="flex-1 px-4 py-3 rounded-xl bg-[#111] border border-[#333] text-white placeholder:text-[#666] focus:border-[#BB86FC] focus:outline-none transition"
            />
            <button
              onClick={handleIngredients}
              className="px-6 py-3 rounded-xl bg-[#BB86FC] text-black font-bold hover:bg-[#9C64FF] transition"
            >
              Search
            </button>
          </div>
          <p className="text-sm text-[#9E9E9E]">
            Enter ingredients separated by commas and hit Search
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-300 mb-4">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && (analysis || recipes.length > 0) && (
        <div className="space-y-8">
          {/* Analysis card */}
          {analysis && (
            <div className="p-5 rounded-2xl bg-[#111] border border-[#222]">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold">{analysis.dish_name}</h2>
                <span className="px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-sm font-bold">
                  {Math.round(analysis.confidence * 100)}%
                </span>
              </div>
              {analysis.cuisine_type && (
                <span className="inline-block px-3 py-1 rounded-lg bg-[#BB86FC]/10 text-[#BB86FC] text-sm font-semibold mb-3">
                  {analysis.cuisine_type}
                </span>
              )}
              <p className="text-sm text-[#9E9E9E] mb-3">
                🔥 ~{analysis.calories_estimate} kcal
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.detected_ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-2 py-1 rounded-md bg-[#1a1a1a] text-xs text-[#ccc]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recipes */}
          {recipes.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Matching Recipes</h3>
              {recipes.map((r, i) => (
                <RecipeCard key={i} recipe={r} />
              ))}
            </div>
          )}

          {/* YouTube */}
          {videos.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Watch on YouTube</h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {videos.map((v) => (
                  <YouTubeCard key={v.video_id} video={v} />
                ))}
              </div>
            </div>
          )}

          {/* Find Restaurants */}
          {recipes.length > 0 && restaurants.length === 0 && (
            <div className="text-center">
              <button
                onClick={handleFindRestaurants}
                disabled={loadingRestaurants}
                className="px-6 py-3 rounded-xl border border-[#03DAC6] text-[#03DAC6] font-semibold hover:bg-[#03DAC6]/10 transition disabled:opacity-50"
              >
                {loadingRestaurants ? "Searching..." : "📍 Find Nearby Restaurants"}
              </button>
            </div>
          )}

          {/* Restaurants */}
          {restaurants.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Nearby Restaurants</h3>
              {restaurants.map((r, i) => (
                <RestaurantCard key={i} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
