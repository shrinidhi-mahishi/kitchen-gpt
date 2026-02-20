"""YouTube Data API v3 — search for cooking videos."""

import logging

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


async def search_videos(
    dish_name: str,
    client: httpx.AsyncClient,
    max_results: int = 3,
) -> list[dict]:
    """Search YouTube for recipe/cooking videos for a dish.

    Returns a list of dicts matching the YouTubeVideo model schema.
    Silently returns an empty list on any error so it never blocks
    the main response.
    """
    settings = get_settings()

    params = {
        "part": "snippet",
        "q": f"{dish_name} recipe cooking",
        "type": "video",
        "maxResults": max_results,
        "relevanceLanguage": "en",
        "regionCode": "IN",
        "key": settings.google_api_key,
    }

    try:
        resp = await client.get(YOUTUBE_SEARCH_URL, params=params, timeout=8.0)
        resp.raise_for_status()
        data = resp.json()
    except Exception as exc:
        logger.warning("YouTube search failed for '%s': %s", dish_name, exc)
        return []

    results = []
    for item in data.get("items", []):
        video_id = item.get("id", {}).get("videoId")
        if not video_id:
            continue
        snippet = item.get("snippet", {})
        results.append(
            {
                "video_id": video_id,
                "title": snippet.get("title", ""),
                "channel": snippet.get("channelTitle", ""),
                "thumbnail_url": snippet.get("thumbnails", {})
                .get("high", {})
                .get("url", ""),
                "video_url": f"https://www.youtube.com/watch?v={video_id}",
            }
        )

    logger.info("YouTube returned %d videos for '%s'", len(results), dish_name)
    return results
