"use client";

import { useState } from "react";
import { nearbyRestaurants, type Restaurant } from "../../lib/api";
import RestaurantCard from "../../components/RestaurantCard";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function NearbyPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setRestaurants([]);

    try {
      let lat: number | undefined;
      let lng: number | undefined;

      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
          })
        ).catch(() => null);
        if (pos) {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        }
      }

      const data = await nearbyRestaurants(query.trim(), lat, lng);
      setRestaurants(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Find Nearby Restaurants</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. Biryani, Dosa, Paneer..."
          className="flex-1 px-4 py-3 rounded-xl bg-[#111] border border-[#333] text-white placeholder:text-[#666] focus:border-[#03DAC6] focus:outline-none transition"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-[#03DAC6] text-black font-bold hover:bg-[#00B5A3] transition disabled:opacity-50"
        >
          Find
        </button>
      </div>

      {loading && <LoadingSpinner message="Searching nearby..." />}

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-300 mb-4">
          {error}
        </div>
      )}

      {!loading && restaurants.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📍</div>
          <p className="text-[#9E9E9E]">
            Search for a dish to find nearby restaurants
          </p>
          <p className="text-sm text-[#666] mt-2">
            We&apos;ll use your location for accurate results
          </p>
        </div>
      )}

      {restaurants.length > 0 && (
        <div>
          <p className="text-sm text-[#9E9E9E] mb-4">
            {restaurants.length} restaurants found
          </p>
          {restaurants.map((r, i) => (
            <RestaurantCard key={i} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
