"use client";

import { useState } from "react";
import {
  nearbyRestaurants,
  getCurrentPosition,
  type Restaurant,
} from "../../lib/api";
import RestaurantCard from "../../components/RestaurantCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const QUICK = ["Biryani", "Dosa", "Paneer Butter Masala", "Idli", "Chole Bhature"];

export default function NearbyPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [usedLocation, setUsedLocation] = useState(false);

  async function handleSearch(dish?: string) {
    const dishName = (dish ?? query).trim();
    if (!dishName) return;

    setQuery(dishName);
    setLoading(true);
    setError(null);
    setRestaurants([]);
    setUsedLocation(false);

    try {
      const { lat, lng } = await getCurrentPosition();
      setUsedLocation(lat != null && lng != null);
      const data = await nearbyRestaurants(dishName, lat, lng);
      setRestaurants(data ?? []);
      if (!data?.length) {
        setError("No restaurants found. Try another dish name.");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Find nearby restaurants
        </h1>
        <p className="mt-2 text-[#9E9E9E]">
          Search by dish name. We&apos;ll use your location when available.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. Biryani, Dosa, Paneer..."
          className="flex-1 rounded-xl border border-[#333] bg-[#111] px-4 py-3 text-white placeholder:text-[#666] transition focus:border-[#03DAC6] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="rounded-xl bg-[#03DAC6] px-6 py-3 font-bold text-black transition hover:bg-[#00B5A3] disabled:opacity-50"
        >
          Find
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK.map((dish) => (
          <button
            key={dish}
            type="button"
            onClick={() => handleSearch(dish)}
            className="rounded-full border border-[#2a2a2a] bg-[#111] px-3 py-1.5 text-xs text-[#9E9E9E] transition hover:border-[#03DAC6]/40 hover:text-white"
          >
            {dish}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner message="Searching nearby restaurants..." />}

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-900/20 p-4 text-red-300">
          {error}
        </div>
      )}

      {!loading && restaurants.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-[#333] bg-[#0a0a0a] py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#03DAC6]/10 text-3xl">
            📍
          </div>
          <p className="font-display text-lg font-semibold">
            Search for a dish nearby
          </p>
          <p className="mt-2 text-sm text-[#666]">
            Allow location access for the most accurate results
          </p>
        </div>
      )}

      {restaurants.length > 0 && (
        <div>
          <p className="mb-4 text-sm text-[#9E9E9E]">
            {restaurants.length} restaurant
            {restaurants.length === 1 ? "" : "s"} found
            {usedLocation ? " near you" : " (using IP location fallback)"}
          </p>
          {restaurants.map((r, i) => (
            <RestaurantCard key={`${r.name}-${i}`} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
