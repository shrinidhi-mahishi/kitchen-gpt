import type { Restaurant } from "../lib/api";

function ratingColor(rating: number | null): string {
  if (rating == null) return "#666";
  if (rating >= 4.0) return "#2E7D32";
  if (rating >= 3.0) return "#F9A825";
  return "#C62828";
}

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  return (
    <div className="mb-3 flex items-center gap-4 rounded-2xl border border-[#222] bg-[#111] p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#03DAC6]/10 text-xl">
        🏪
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{restaurant.name}</p>
        <p className="truncate text-sm text-[#9E9E9E]">{restaurant.address}</p>
        {restaurant.rating != null && (
          <span
            className="mt-1 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: ratingColor(restaurant.rating) }}
          >
            {restaurant.rating.toFixed(1)}
          </span>
        )}
      </div>
      {restaurant.google_maps_uri && (
        <a
          href={restaurant.google_maps_uri}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-[#00E5FF]/10 px-3 py-2 text-sm font-semibold text-[#00E5FF] transition hover:bg-[#00E5FF]/20"
        >
          Navigate
        </a>
      )}
    </div>
  );
}
