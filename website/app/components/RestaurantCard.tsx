import type { Restaurant } from "../lib/api";

function ratingColor(rating: number | null): string {
  if (rating == null) return "#666";
  if (rating >= 4.0) return "#2E7D32";
  if (rating >= 3.0) return "#F9A825";
  return "#C62828";
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="p-4 rounded-2xl bg-[#111] border border-[#222] mb-3 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-xl shrink-0">
        🏪
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{restaurant.name}</p>
        <p className="text-sm text-[#9E9E9E] truncate">{restaurant.address}</p>
        {restaurant.rating != null && (
          <span
            className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-xs font-bold text-white"
            style={{ backgroundColor: ratingColor(restaurant.rating) }}
          >
            ⭐ {restaurant.rating.toFixed(1)}
          </span>
        )}
      </div>
      {restaurant.google_maps_uri && (
        <a
          href={restaurant.google_maps_uri}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] text-sm font-semibold hover:bg-[#00E5FF]/20 transition shrink-0"
        >
          Navigate
        </a>
      )}
    </div>
  );
}
