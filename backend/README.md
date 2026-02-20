# KitchenGPT Backend

FastAPI backend for KitchenGPT -- AI-powered **Indian food** analysis and recipe generation using Gemini 2.5 Pro. Prompts are tuned for Indian cuisine (regional styles, Indian ingredient names, cooking techniques like tadka/tempering, pressure cooker instructions, etc.).

---

## Quick Start

### 1. Prerequisites

- **Python 3.12+** -- verify with `python3 --version`
- **A Google API key** with the **Generative Language API** enabled -- get one at https://aistudio.google.com/apikey

### 2. Clone and set up the virtual environment

```bash
cd kitchen_gpt/backend

python3 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```dotenv
GOOGLE_API_KEY=your_google_api_key_here
MODEL_NAME=gemini-2.5-pro

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Google API key with Generative Language API, YouTube Data API v3, and optionally Places API (New) enabled. |
| `MODEL_NAME` | No | Gemini model name. Defaults to `gemini-2.5-pro`. |
| `SUPABASE_URL` | Yes | Supabase project URL (placeholder value is fine for local API testing). |
| `SUPABASE_KEY` | Yes | Supabase anon key (placeholder value is fine for local API testing). |
| `RECIPE_RESULTS_LIMIT` | No | Number of recipes to generate per request. Defaults to `3`. |
| `YOUTUBE_RESULTS_LIMIT` | No | Number of YouTube videos to return per request. Defaults to `3`. |
| `PLACES_SEARCH_RADIUS` | No | Restaurant search radius in meters. Defaults to `5000`. |

### 5. Start the server

```bash
uvicorn app.main:app --reload --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### 6. Open Swagger UI

Go to **http://127.0.0.1:8000/docs** in your browser.

This gives you a full interactive API playground where you can test every endpoint directly.

There is also a ReDoc view at **http://127.0.0.1:8000/redoc**.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Endpoint | Location required? | Description |
|----------|--------------------|-------------|
| `POST /api/v1/analyze-dish` | No | Upload image → dish identification + Indian recipes + YouTube videos |
| `POST /api/v1/recipes-by-ingredients` | No | Ingredients → recipes + YouTube videos |
| `POST /api/v1/nearby-restaurants` | Optional (auto-detects from IP) | Dish name → nearby restaurants |
| `GET /health` | No | Health check |

---

### `GET /health`

Health check. No authentication required.

```bash
curl http://127.0.0.1:8000/health
```

```json
{"status": "ok", "service": "KitchenGPT"}
```

---

### `POST /api/v1/analyze-dish`

**Multimodal pipeline.** Upload a photo of food and get back dish identification, AI-generated Indian recipes, and YouTube cooking videos. No location required.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | file | Yes | JPEG, PNG, WebP, or HEIC image |

**Example with curl:**

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/analyze-dish \
  -F "image=@/path/to/food_photo.jpg"
```

You can also test via Swagger UI at `/docs` — it shows a file picker for the image field.

**Response:**

```json
{
  "analysis": {
    "dish_name": "Hyderabadi Chicken Biryani",
    "detected_ingredients": ["basmati rice", "chicken", "onion", "yogurt", "saffron", "ghee", "mint", "coriander"],
    "calories_estimate": 650,
    "confidence": 0.95,
    "cuisine_type": "Mughlai"
  },
  "recipes": [
    {
      "title": "Hyderabadi Dum Biryani",
      "ready_in_minutes": 90,
      "servings": 4,
      "summary": "A classic layered biryani cooked in the dum (slow steam) style...",
      "ingredients_used": ["basmati rice", "chicken", "onion", "yogurt", "saffron"],
      "ingredients_extra": ["ghee", "garam masala", "bay leaf", "green cardamom"],
      "steps": [
        {"number": 1, "step": "Wash and soak 2 cups basmati rice for 30 minutes..."},
        {"number": 2, "step": "Marinate the chicken in yogurt and spices..."}
      ]
    }
  ],
  "youtube_videos": [
    {
      "video_id": "dQw4w9WgXcQ",
      "title": "Hyderabadi Dum Biryani | Restaurant Style Recipe",
      "channel": "Chef Ranveer Brar",
      "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ]
}
```

> **Note:** YouTube videos require "YouTube Data API v3" enabled on your Google API key.

---

### `POST /api/v1/recipes-by-ingredients`

**Text-based workflow.** Send a list of ingredients and get AI-generated **Indian** recipes + YouTube cooking videos. No location required.

**Request body:**

```json
{
  "ingredients": ["paneer", "tomato", "onion", "capsicum"]
}
```

**Example:**

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/recipes-by-ingredients \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["paneer", "tomato", "onion", "capsicum"]}'
```

**Response:**

```json
{
  "recipes": [
    {
      "title": "Kadai Paneer",
      "ready_in_minutes": 40,
      "servings": 3,
      "summary": "A popular North Indian restaurant-style curry...",
      "ingredients_used": ["paneer", "tomato", "onion", "capsicum"],
      "ingredients_extra": ["ginger-garlic paste", "kasuri methi", "garam masala"],
      "steps": [
        {"number": 1, "step": "Cut 200g paneer into 1-inch cubes..."},
        {"number": 2, "step": "Heat oil in a kadai, add cumin seeds..."}
      ]
    }
  ],
  "youtube_videos": [
    {
      "video_id": "abc123",
      "title": "Kadai Paneer Recipe | Restaurant Style",
      "channel": "Kunal Kapur",
      "thumbnail_url": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      "video_url": "https://www.youtube.com/watch?v=abc123"
    }
  ]
}
```

---

### `POST /api/v1/nearby-restaurants`

**Restaurant search.** Find restaurants that serve a specific dish.

`latitude` and `longitude` are **optional** -- if omitted, the server auto-detects your location from your IP address (city-level accuracy).

> Requires "Places API (New)" enabled on your Google API key.

**Request body:**

```json
{
  "dish_name": "Margherita Pizza",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius_meters": 5000
}
```

All fields except `dish_name` are optional. Minimal request:

```json
{
  "dish_name": "Margherita Pizza"
}
```

**Examples:**

```bash
# With explicit coordinates
curl -s -X POST http://127.0.0.1:8000/api/v1/nearby-restaurants \
  -H "Content-Type: application/json" \
  -d '{"dish_name": "Margherita Pizza", "latitude": 40.7128, "longitude": -74.0060}'

# Auto-detect location from IP
curl -s -X POST http://127.0.0.1:8000/api/v1/nearby-restaurants \
  -H "Content-Type: application/json" \
  -d '{"dish_name": "Margherita Pizza"}'
```

**Response:**

```json
[
  {
    "name": "Joe's Pizza",
    "address": "7 Carmine St, New York, NY 10014",
    "latitude": 40.7306,
    "longitude": -74.0021,
    "rating": 4.5,
    "google_maps_uri": "https://maps.google.com/?cid=..."
  }
]
```

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, lifespan
│   ├── config.py            # Pydantic BaseSettings (.env)
│   ├── api/
│   │   ├── router.py        # All route definitions
│   │   └── deps.py          # Dependency injection (shared httpx client)
│   ├── models/
│   │   ├── food.py          # FoodAnalysisResponse, IngredientsRequest
│   │   ├── recipe.py        # RecipeDetail, InstructionStep
│   │   └── geo.py           # RestaurantResult, NearbyRestaurantsRequest
│   ├── services/
│   │   ├── vision.py        # Gemini vision — image to dish analysis
│   │   ├── recipe.py        # Gemini — ingredients to recipes
│   │   ├── youtube.py       # YouTube Data API — cooking video search
│   │   └── geo.py           # Google Places — nearby restaurant search
│   └── prompts/
│       ├── vision.py        # Vision system prompt + JSON schema
│       └── recipe.py        # Recipe generation prompt + JSON schema
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md                # (this file)
```

## Deployment

### Docker

```bash
docker build -t kitchengpt-backend .
docker run -p 8000:8000 --env-file .env kitchengpt-backend
```

### Railway / Render

1. Push to GitHub.
2. Connect the repo and set the root directory to `kitchen_gpt/backend`.
3. Add all environment variables from `.env.example`.
4. The platform auto-detects the `Dockerfile` and deploys.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `500 Internal Server Error` on startup | Missing `.env` file or required variables | Run `cp .env.example .env` and fill in `GOOGLE_API_KEY` |
| `502 Vision service error` | Invalid or expired Google API key | Verify your key at https://aistudio.google.com/apikey |
| `youtube_videos: []` always empty | YouTube Data API v3 not enabled | Enable "YouTube Data API v3" in your GCP console for the same project |
| `restaurants: []` always empty | Places API not enabled | Enable "Places API (New)" in your GCP console for the same project |
| JSON parse errors from Gemini | Rare trailing-comma edge case | Already handled automatically; if persistent, try `MODEL_NAME=gemini-2.0-flash` |
| Response truncation (incomplete recipes) | Token limit too low | `RECIPE_RESULTS_LIMIT=3` is the safe default; increase `max_output_tokens` in `services/recipe.py` if needed |
