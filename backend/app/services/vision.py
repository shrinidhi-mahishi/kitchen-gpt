"""Gemini vision service — image to structured food analysis."""

import json
import logging
import re

from google import genai
from google.genai import types

from app.config import get_settings
from app.models.food import FoodAnalysisResponse
from app.prompts.vision import VISION_RESPONSE_SCHEMA, VISION_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


def _get_gemini_client() -> genai.Client:
    settings = get_settings()
    return genai.Client(api_key=settings.google_api_key)


def _repair_json(raw: str) -> dict:
    """Best-effort repair of truncated or malformed JSON from Gemini."""
    # 1. Strip trailing commas before } or ]
    text = re.sub(r",\s*([}\]])", r"\1", raw)

    # 2. Try parsing as-is first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 3. Handle truncation — close any open strings, arrays, objects
    # Remove a trailing incomplete string value (unterminated quote)
    text = re.sub(r',\s*"[^"]*$', "", text)  # trailing key or value
    text = re.sub(r':\s*"[^"]*$', ': ""', text)  # truncated value

    # Close open brackets/braces
    open_braces = text.count("{") - text.count("}")
    open_brackets = text.count("[") - text.count("]")
    text += "]" * max(open_brackets, 0)
    text += "}" * max(open_braces, 0)

    # Strip trailing commas again after surgery
    text = re.sub(r",\s*([}\]])", r"\1", text)

    return json.loads(text)


async def analyze_image(
    image_bytes: bytes,
    mime_type: str = "image/jpeg",
) -> FoodAnalysisResponse:
    """Send image bytes to Gemini and return validated food analysis.

    Uses Gemini's native structured output (response_mime_type +
    response_schema) to guarantee valid JSON matching our schema.
    """
    settings = get_settings()
    client = _get_gemini_client()

    image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)

    response = client.models.generate_content(
        model=settings.model_name,
        contents=[
            image_part,
            "Analyze this food image and identify the dish.",
        ],
        config=types.GenerateContentConfig(
            system_instruction=VISION_SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=VISION_RESPONSE_SCHEMA,
            temperature=0.2,
            max_output_tokens=4096,
        ),
    )

    raw_text = response.text
    logger.info("Gemini vision response: %s", raw_text)

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError:
        logger.warning("Raw JSON parse failed, attempting repair...")
        parsed = _repair_json(raw_text)

    return FoodAnalysisResponse.model_validate(parsed)
