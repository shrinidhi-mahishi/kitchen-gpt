"""Google Places (New) geo-search service — find nearby restaurants."""

import logging

import httpx

from app.config import get_settings
from app.models.geo import RestaurantResult

logger = logging.getLogger(__name__)

FIELD_MASK = (
    "places.displayName,"
    "places.formattedAddress,"
    "places.location,"
    "places.rating,"
    "places.googleMapsUri"
)


async def geolocate_by_ip(
    client: httpx.AsyncClient,
    client_ip: str | None = None,
) -> tuple[float, float]:
    """Estimate latitude/longitude from an IP address.

    Uses the free ip-api.com service.  When client_ip is None or a
    private/loopback address the API returns the server's public IP
    location, which is a reasonable fallback for development.
    """
    url = (
        f"http://ip-api.com/json/{client_ip}"
        if client_ip and not client_ip.startswith(("127.", "10.", "192.168.", "::1"))
        else "http://ip-api.com/json/"
    )

    resp = await client.get(url, timeout=5.0)
    resp.raise_for_status()
    data = resp.json()

    if data.get("status") != "success":
        raise ValueError(f"IP geolocation failed: {data.get('message', 'unknown')}")

    lat = float(data["lat"])
    lng = float(data["lon"])
    logger.info("IP geolocation resolved to %s, %s (%s)", lat, lng, data.get("city", "?"))
    return lat, lng


async def search_nearby_restaurants(
    dish_name: str,
    latitude: float,
    longitude: float,
    client: httpx.AsyncClient,
    radius_meters: int | None = None,
) -> list[RestaurantResult]:
    """Search Google Places (New) for restaurants likely serving the dish.

    Uses the Text Search (New) endpoint with a location bias circle
    centered on the user's coordinates.
    """
    settings = get_settings()
    radius = radius_meters or settings.places_search_radius

    url = f"{settings.places_base_url}/places:searchText"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": settings.google_api_key,
        "X-Goog-FieldMask": FIELD_MASK,
    }

    body = {
        "textQuery": f"{dish_name} restaurant",
        "locationBias": {
            "circle": {
                "center": {
                    "latitude": latitude,
                    "longitude": longitude,
                },
                "radius": float(radius),
            }
        },
        "maxResultCount": 10,
    }

    resp = await client.post(url, json=body, headers=headers)
    resp.raise_for_status()

    data = resp.json()
    places = data.get("places", [])

    results: list[RestaurantResult] = []
    for place in places:
        location = place.get("location", {})
        display_name = place.get("displayName", {})

        results.append(
            RestaurantResult(
                name=display_name.get("text", "Unknown"),
                address=place.get("formattedAddress", ""),
                latitude=location.get("latitude", 0.0),
                longitude=location.get("longitude", 0.0),
                rating=place.get("rating"),
                google_maps_uri=place.get("googleMapsUri", ""),
            )
        )

    return results
