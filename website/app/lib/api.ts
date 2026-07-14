const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kitchen-gpt.onrender.com/api/v1";

export interface FoodAnalysis {
  dish_name: string;
  detected_ingredients: string[];
  calories_estimate: number;
  confidence: number;
  cuisine_type: string | null;
}

export interface InstructionStep {
  number: number;
  step: string;
}

export interface Recipe {
  title: string;
  ready_in_minutes: number;
  servings: number;
  summary: string;
  ingredients_used: string[];
  ingredients_extra: string[];
  steps: InstructionStep[];
}

export interface YouTubeVideo {
  video_id: string;
  title: string;
  channel: string;
  thumbnail_url: string;
  video_url: string;
}

export interface Restaurant {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number | null;
  google_maps_uri: string;
}

export interface DishAnalysisResponse {
  analysis: FoodAnalysis;
  recipes: Recipe[];
  youtube_videos: YouTubeVideo[];
}

export interface RecipeSearchResponse {
  recipes: Recipe[];
  youtube_videos: YouTubeVideo[];
}

async function parseError(res: Response): Promise<string> {
  const err = await res.json().catch(() => ({ detail: res.statusText }));
  const detail = err?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (typeof d === "string" ? d : d?.msg || JSON.stringify(d)))
      .join("; ");
  }
  return `Error ${res.status}`;
}

export async function analyzeDish(file: File): Promise<DishAnalysisResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/analyze-dish`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function recipesByIngredients(
  ingredients: string[]
): Promise<RecipeSearchResponse> {
  const res = await fetch(`${API_URL}/recipes-by-ingredients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function nearbyRestaurants(
  dishName: string,
  latitude?: number,
  longitude?: number
): Promise<Restaurant[]> {
  const body: Record<string, unknown> = { dish_name: dishName };
  if (latitude != null) body.latitude = latitude;
  if (longitude != null) body.longitude = longitude;

  const res = await fetch(`${API_URL}/nearby-restaurants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export class LocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocationError";
  }
}

/** Requires browser GPS. Throws LocationError if denied/unavailable. */
export async function getCurrentPosition(): Promise<{
  lat: number;
  lng: number;
}> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new LocationError(
      "Location is not supported in this browser. Please use Chrome or Safari."
    );
  }

  if (!window.isSecureContext) {
    throw new LocationError(
      "Location requires HTTPS. Open the site via https:// and try again."
    );
  }

  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      })
    );
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? Number((err as GeolocationPositionError).code)
        : null;
    if (code === 1) {
      throw new LocationError(
        "Location permission denied. Allow location for this site in your browser settings, then try again."
      );
    }
    if (code === 2) {
      throw new LocationError(
        "Location unavailable. Turn on device location services and try again."
      );
    }
    if (code === 3) {
      throw new LocationError(
        "Location timed out. Move to an open area and try again."
      );
    }
    throw new LocationError(
      "Could not get your current location. Please allow location access and try again."
    );
  }
}
