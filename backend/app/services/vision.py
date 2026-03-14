"""OpenAI vision service — image to structured food analysis."""

import base64
import json
import logging

from openai import AsyncOpenAI

from app.config import get_settings
from app.models.food import FoodAnalysisResponse
from app.prompts.vision import VISION_RESPONSE_FORMAT, VISION_SYSTEM_PROMPT

logger = logging.getLogger(__name__)

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=get_settings().openai_api_key)
    return _client


async def analyze_image(
    image_bytes: bytes,
    mime_type: str = "image/jpeg",
) -> FoodAnalysisResponse:
    """Send image bytes to OpenAI and return validated food analysis.

    Uses structured output (response_format with json_schema) for
    guaranteed valid JSON matching our schema.
    """
    settings = get_settings()
    client = _get_client()

    b64_image = base64.b64encode(image_bytes).decode("utf-8")
    data_url = f"data:{mime_type};base64,{b64_image}"

    response = await client.chat.completions.create(
        model=settings.model_name,
        messages=[
            {"role": "system", "content": VISION_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": data_url, "detail": "high"},
                    },
                    {
                        "type": "text",
                        "text": "Analyze this food image and identify the dish.",
                    },
                ],
            },
        ],
        response_format=VISION_RESPONSE_FORMAT,
        max_completion_tokens=4096,
        reasoning_effort="low",
    )

    raw_text = response.choices[0].message.content
    logger.info("OpenAI vision response: %s", raw_text)

    parsed = json.loads(raw_text)
    return FoodAnalysisResponse.model_validate(parsed)
