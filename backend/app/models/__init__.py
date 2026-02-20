"""KitchenGPT data models."""

from .food import FoodAnalysisResponse, IngredientsRequest
from .geo import LatLng, NearbyRestaurantsRequest, RestaurantResult
from .recipe import InstructionStep, RecipeDetail
from .youtube import YouTubeVideo

from pydantic import BaseModel, Field


class DishAnalysisFullResponse(BaseModel):
    """Combined response for the /analyze-dish orchestrator endpoint."""

    analysis: FoodAnalysisResponse
    recipes: list[RecipeDetail] = Field(default_factory=list)
    youtube_videos: list[YouTubeVideo] = Field(default_factory=list)


class RecipeSearchResponse(BaseModel):
    """Response for the /recipes-by-ingredients endpoint."""

    recipes: list[RecipeDetail] = Field(default_factory=list)
    youtube_videos: list[YouTubeVideo] = Field(default_factory=list)


__all__ = [
    "FoodAnalysisResponse",
    "IngredientsRequest",
    "RecipeDetail",
    "InstructionStep",
    "RestaurantResult",
    "LatLng",
    "NearbyRestaurantsRequest",
    "DishAnalysisFullResponse",
    "RecipeSearchResponse",
    "YouTubeVideo",
]
