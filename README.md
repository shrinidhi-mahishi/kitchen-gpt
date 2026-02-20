# KitchenGPT — AI Indian Food Analyser

KitchenGPT is a Micro-SaaS Android app that identifies dishes from photos, generates matching Indian recipes, finds YouTube cooking videos, and discovers nearby restaurants — powered entirely by Gemini 2.5 Pro.

## Architecture

```
Flutter App  ──>  FastAPI Backend  ──>  Gemini 2.5 Pro (vision + recipes)
                                   ──>  YouTube Data API (cooking videos)
                                   ──>  Google Places (restaurants)
                                   ──>  Supabase (auth + data)
```

**Two workflows:**

1. **Multimodal** — Take/upload a dish photo → Gemini identifies dish & ingredients → Gemini generates Indian recipes → YouTube fetches cooking videos → Google Places finds nearby restaurants.
2. **Text-based** — Type ingredients → Gemini generates matching Indian recipes → YouTube fetches videos → Google Places finds restaurants serving the top match.

## Project Structure

```
kitchen_gpt/
├── backend/                   # FastAPI (Python 3.12)
│   ├── app/
│   │   ├── main.py            # App entry-point, CORS, lifespan
│   │   ├── config.py          # Settings from .env
│   │   ├── models/            # Pydantic request/response models
│   │   ├── services/          # vision.py, recipe.py, youtube.py, geo.py
│   │   ├── api/               # router.py (endpoints), deps.py
│   │   └── prompts/           # Gemini system prompts (vision + recipes)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   └── kitchengpt/            # Flutter app
│       ├── lib/
│       │   ├── main.dart      # Entry-point + Supabase init
│       │   ├── app.dart       # MaterialApp + auth gating
│       │   ├── config/        # constants.dart
│       │   ├── models/        # Dart data classes
│       │   ├── services/      # api_service, auth_service, camera_service
│       │   ├── screens/       # login, signup, home, analyze_dish
│       │   └── widgets/       # recipe_card, restaurant_card, youtube_card, map_view
│       └── pubspec.yaml
└── README.md
```

## Prerequisites

- **Python 3.12+**
- **Flutter SDK 3.2+** (for the Android frontend)
- **API Keys** (see below)

## API Keys Required

| Service | Key Name | Get it at |
|---------|----------|-----------|
| Google (Gemini + Places + YouTube) | `GOOGLE_API_KEY` | https://aistudio.google.com/apikey |
| Supabase | `SUPABASE_URL` + `SUPABASE_KEY` | https://supabase.com/dashboard/project/_/settings/api |
| Google Maps (Flutter) | `GOOGLE_MAPS_API_KEY` | Same GCP project, enable Maps SDK for Android |

A single `GOOGLE_API_KEY` is used for Gemini (vision + recipe generation), YouTube Data API v3 (cooking videos), and Google Places (restaurant search). Make sure your GCP project has "Generative Language API", "YouTube Data API v3", and "Places API (New)" enabled.

## Backend Setup

```bash
cd kitchen_gpt/backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your actual API keys

# Run the server
uvicorn app.main:app --reload --port 8000
```

The API docs are available at `http://localhost:8000/docs` (Swagger UI).

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/analyze-dish` | Upload image → vision → Indian recipes + YouTube videos |
| `POST` | `/api/v1/recipes-by-ingredients` | Ingredients → Indian recipes + YouTube videos |
| `POST` | `/api/v1/nearby-restaurants` | Standalone restaurant geo-search |
| `GET`  | `/health` | Health check |

## Frontend Setup

```bash
cd kitchen_gpt/frontend/kitchengpt

# Configure environment
# Edit assets/.env with your Supabase and Google Maps keys

# Install Flutter dependencies
flutter pub get

# Run on connected Android device / emulator
flutter run
```

**Note:** For the Android emulator, the backend URL `http://10.0.2.2:8000` maps to `localhost` on your host machine.

### Android Configuration

Add your Google Maps API key in `android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```

## How Gemini Structured Output Guarantees JSON Reliability

KitchenGPT uses **Gemini 2.5 Pro** with native structured output for both vision analysis and recipe generation. The model is constrained to produce valid JSON matching a provided schema via:

```python
config=types.GenerateContentConfig(
    response_mime_type="application/json",
    response_schema=SCHEMA,  # JSON Schema dict
)
```

This is fundamentally different from asking the model to "please return JSON." The `response_schema` parameter constrains token generation at the decoding level, guaranteeing schema-conformant output every time. The result is then double-validated through a Pydantic model.

## Why Gemini-Only (No Spoonacular)

- **No daily quota walls** — Spoonacular's free tier caps at 50 points/day (~16 lookups). Gemini is usage-based with no daily cap.
- **One API key** — Gemini handles both vision and recipe generation. Simpler setup, fewer billing relationships.
- **Personalization** — Trivial to add dietary constraints ("make it low-sodium") to the prompt. Impossible with a static recipe API.
- **9.2/10 factual accuracy** — Peer-reviewed evaluation of Gemini for food-related generation (arxiv 2511.08215).
- **Cost** — ~$0.0002 per recipe generation call vs. $29-149/month fixed Spoonacular plans.

## Deployment (Railway)

1. Push the repo to GitHub.
2. Create a new Railway project and connect the repo.
3. Set the root directory to `kitchen_gpt/backend`.
4. Add all environment variables from `.env.example` in the Railway dashboard.
5. Railway auto-detects the Dockerfile and deploys.
6. Update the Flutter `assets/.env` `API_BASE_URL` to point to your Railway URL.

## 30-Day MVP Roadmap

| Days | Milestone |
|------|-----------|
| 1-3 | Backend skeleton — models, config, health endpoint. Deploy to Railway. |
| 4-7 | Vision service + recipe generation service (both Gemini). Test via Swagger. |
| 8-10 | Geo-search service + YouTube integration + orchestrator endpoint. Full backend working. |
| 11-14 | Flutter scaffolding, auth screens, Supabase integration. |
| 15-19 | AnalyzeDish screen — camera, API calls, recipe cards, YouTube cards. |
| 20-23 | Map integration, restaurant cards, UI polish. |
| 24-26 | Supabase DB tables, analysis history persistence. |
| 27-28 | Error handling, loading states, edge cases. |
| 29-30 | APK build, final testing, README documentation. |

## License

MIT
