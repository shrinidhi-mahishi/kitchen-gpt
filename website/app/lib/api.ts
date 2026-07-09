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

export async function analyzeDish(file: File): Promise<DishAnalysisResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/analyze-dish`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Error ${res.status}`);
  }

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

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Error ${res.status}`);
  }

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

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Error ${res.status}`);
  }

  return res.json();
}
