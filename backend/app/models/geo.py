"""Pydantic models for Google Places geo-search results."""

from pydantic import BaseModel, Field


class LatLng(BaseModel):
    latitude: float
    longitude: float


class RestaurantResult(BaseModel):
    """A single restaurant from Google Places text search."""

    name: str
    address: str
    latitude: float
    longitude: float
    rating: float | None = None
    google_maps_uri: str = ""


class NearbyRestaurantsRequest(BaseModel):
    """Request body for nearby restaurant search.

    latitude/longitude are optional — if omitted, the server
    auto-detects location from the client's IP address.
    """

    dish_name: str
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    radius_meters: int = Field(default=5000, ge=100, le=50000)
