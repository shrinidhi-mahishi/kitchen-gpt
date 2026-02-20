"""Pydantic models for food analysis (vision service output)."""

from pydantic import BaseModel, Field


class IngredientsRequest(BaseModel):
    """Request body for text-based ingredient search."""

    ingredients: list[str] = Field(
        ..., min_length=1, description="List of ingredient names"
    )


class FoodAnalysisResponse(BaseModel):
    """Structured output from the Gemini vision model."""

    dish_name: str = Field(..., description="Identified dish name")
    detected_ingredients: list[str] = Field(
        ..., description="List of detected ingredients"
    )
    calories_estimate: int = Field(
        ..., ge=0, description="Estimated calories for the visible portion"
    )
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Model confidence score"
    )
    cuisine_type: str | None = Field(
        default=None, description="Detected cuisine type"
    )
