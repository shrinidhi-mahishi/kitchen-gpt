"""KitchenGPT API routes — orchestration, recipes, geo-search, and YouTube."""

import asyncio
import logging

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
import httpx

from app.api.deps import get_http_client
from app.models import (
    DishAnalysisFullResponse,
    FoodAnalysisResponse,
    IngredientsRequest,
    NearbyRestaurantsRequest,
    RecipeSearchResponse,
    YouTubeVideo,
)
from app.models.geo import RestaurantResult
from app.services import geo, recipe, vision, youtube

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic"}


# --------------------------------------------------------------------------- #
#  POST /analyze-dish  — Upload image → vision + recipes + YouTube
# --------------------------------------------------------------------------- #
@router.post("/analyze-dish", response_model=DishAnalysisFullResponse)
async def analyze_dish(
    image: UploadFile = File(...),
    client: httpx.AsyncClient = Depends(get_http_client),
):
    """Multimodal workflow: upload an image → dish identification → recipes + YouTube videos.

    Accepts JPEG, PNG, WebP, or HEIC images via multipart/form-data.
    """
    content_type = image.content_type or "image/jpeg"
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported image type: {content_type}. Use JPEG, PNG, WebP, or HEIC.",
        )

    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Step 1: Vision — identify dish
    try:
        analysis: FoodAnalysisResponse = await vision.analyze_image(
            image_bytes, mime_type=content_type
        )
    except Exception as exc:
        logger.exception("Vision analysis failed")
        raise HTTPException(status_code=502, detail=f"Vision service error: {exc}")

    # Step 2: Recipes + YouTube in parallel
    recipe_task = _safe_generate_recipes(analysis.detected_ingredients)
    youtube_task = _safe_youtube_search(analysis.dish_name, client)
    recipes, videos = await asyncio.gather(recipe_task, youtube_task)

    return DishAnalysisFullResponse(
        analysis=analysis,
        recipes=recipes,
        youtube_videos=[YouTubeVideo(**v) for v in videos],
    )


# --------------------------------------------------------------------------- #
#  POST /recipes-by-ingredients  — Text-based recipe generation + YouTube
# --------------------------------------------------------------------------- #
@router.post("/recipes-by-ingredients", response_model=RecipeSearchResponse)
async def recipes_by_ingredients(
    body: IngredientsRequest,
    client: httpx.AsyncClient = Depends(get_http_client),
):
    """Text workflow: ingredients → AI-generated Indian recipes + YouTube videos."""

    try:
        recipes = await recipe.generate_recipes(body.ingredients)
    except Exception as exc:
        logger.exception("Recipe generation failed")
        raise HTTPException(status_code=502, detail=f"Recipe generation error: {exc}")

    # Use first recipe title as YouTube query
    dish_query = recipes[0].title if recipes else ", ".join(body.ingredients)
    videos = await _safe_youtube_search(dish_query, client)

    return RecipeSearchResponse(
        recipes=recipes,
        youtube_videos=[YouTubeVideo(**v) for v in videos],
    )


# --------------------------------------------------------------------------- #
#  POST /nearby-restaurants  — Standalone geo-search (auto-detects location)
# --------------------------------------------------------------------------- #
@router.post("/nearby-restaurants", response_model=list[RestaurantResult])
async def nearby_restaurants(
    body: NearbyRestaurantsRequest,
    request: Request,
    client: httpx.AsyncClient = Depends(get_http_client),
):
    """Find nearby restaurants serving a specific dish.

    latitude/longitude are optional — if omitted, location is
    auto-detected from the client's IP address.
    """
    lat = body.latitude
    lng = body.longitude

    if lat is None or lng is None:
        try:
            client_ip = request.client.host if request.client else None
            lat, lng = await geo.geolocate_by_ip(client, client_ip)
        except Exception as exc:
            logger.warning("IP geolocation failed: %s", exc)
            raise HTTPException(
                status_code=422,
                detail="Could not auto-detect location. Please provide latitude and longitude.",
            )

    try:
        return await geo.search_nearby_restaurants(
            body.dish_name,
            lat,
            lng,
            client,
            radius_meters=body.radius_meters,
        )
    except Exception as exc:
        logger.exception("Geo search failed")
        raise HTTPException(status_code=502, detail=f"Places API error: {exc}")


# --------------------------------------------------------------------------- #
#  Helpers
# --------------------------------------------------------------------------- #
async def _safe_generate_recipes(ingredients: list[str]):
    try:
        return await recipe.generate_recipes(ingredients)
    except Exception as exc:
        logger.warning("Recipe generation failed: %s", exc)
        return []


async def _safe_youtube_search(dish_name: str, client: httpx.AsyncClient):
    try:
        return await youtube.search_videos(dish_name, client)
    except Exception as exc:
        logger.warning("YouTube search failed: %s", exc)
        return []
