"""Gemini recipe generation service — ingredients to structured recipes."""

import json
import logging
import re

from google import genai
from google.genai import types

from app.config import get_settings
from app.models.recipe import InstructionStep, RecipeDetail
from app.prompts.recipe import RECIPE_RESPONSE_SCHEMA, RECIPE_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


def _get_gemini_client() -> genai.Client:
    settings = get_settings()
    return genai.Client(api_key=settings.google_api_key)


def _fix_json(text: str) -> str:
    """Fix common JSON issues from LLM output (trailing commas, etc.)."""
    # Remove trailing commas before } or ]
    text = re.sub(r",\s*([}\]])", r"\1", text)
    return text


async def generate_recipes(
    ingredients: list[str],
    num_recipes: int | None = None,
) -> list[RecipeDetail]:
    """Generate recipes from ingredients using Gemini with structured output.

    Uses response_schema to guarantee valid JSON matching our recipe schema.
    Includes a fallback JSON fixer for edge-case trailing-comma issues.
    """
    settings = get_settings()
    client = _get_gemini_client()
    count = num_recipes or settings.recipe_results_limit

    user_prompt = (
        f"Ingredients available: {', '.join(ingredients)}\n\n"
        f"Generate exactly {count} different recipes using these ingredients. "
        "Vary the cuisine styles and cooking methods."
    )

    response = client.models.generate_content(
        model=settings.model_name,
        contents=[user_prompt],
        config=types.GenerateContentConfig(
            system_instruction=RECIPE_SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=RECIPE_RESPONSE_SCHEMA,
            temperature=0.7,
            max_output_tokens=8192,
        ),
    )

    raw_text = response.text
    logger.info("Gemini recipe response length: %d chars", len(raw_text))

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError:
        logger.warning("Raw JSON parse failed, attempting fix...")
        parsed = json.loads(_fix_json(raw_text))

    recipes: list[RecipeDetail] = []
    for item in parsed:
        steps = [
            InstructionStep(number=s["number"], step=s["step"])
            for s in item.get("steps", [])
        ]
        recipes.append(
            RecipeDetail(
                title=item["title"],
                ready_in_minutes=item.get("ready_in_minutes", 0),
                servings=item.get("servings", 0),
                summary=item.get("summary", ""),
                ingredients_used=item.get("ingredients_used", []),
                ingredients_extra=item.get("ingredients_extra", []),
                steps=steps,
            )
        )

    return recipes
