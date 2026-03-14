"""OpenAI recipe generation service — ingredients to structured recipes."""

import json
import logging

from openai import AsyncOpenAI

from app.config import get_settings
from app.models.recipe import InstructionStep, RecipeDetail
from app.prompts.recipe import RECIPE_RESPONSE_FORMAT, RECIPE_SYSTEM_PROMPT

logger = logging.getLogger(__name__)

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=get_settings().openai_api_key)
    return _client


async def generate_recipes(
    ingredients: list[str],
    num_recipes: int | None = None,
) -> list[RecipeDetail]:
    """Generate recipes from ingredients using OpenAI with structured output.

    Uses response_format with json_schema for guaranteed valid JSON.
    """
    settings = get_settings()
    client = _get_client()
    count = num_recipes or settings.recipe_results_limit

    user_prompt = (
        f"Ingredients available: {', '.join(ingredients)}\n\n"
        f"Generate exactly {count} different recipes using these ingredients. "
        "Vary the cuisine styles and cooking methods."
    )

    response = await client.chat.completions.create(
        model=settings.model_name,
        messages=[
            {"role": "system", "content": RECIPE_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        response_format=RECIPE_RESPONSE_FORMAT,
        max_completion_tokens=8192,
        reasoning_effort="low",
    )

    raw_text = response.choices[0].message.content
    logger.info("OpenAI recipe response length: %d chars", len(raw_text))

    parsed = json.loads(raw_text)
    recipe_items = parsed.get("recipes", parsed) if isinstance(parsed, dict) else parsed

    recipes: list[RecipeDetail] = []
    for item in recipe_items:
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
