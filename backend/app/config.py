"""Application configuration loaded from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """All configuration is read from environment variables / .env file."""

    # --- Google API (Gemini + Places share one key) ---
    google_api_key: str
    model_name: str = "gemini-2.5-pro"

    # --- Supabase ---
    supabase_url: str
    supabase_key: str

    # --- App ---
    app_name: str = "KitchenGPT"
    debug: bool = False
    allowed_origins: list[str] = ["*"]

    # --- Recipe generation ---
    recipe_results_limit: int = 3

    # --- YouTube ---
    youtube_results_limit: int = 3

    # --- Google Places ---
    places_base_url: str = "https://places.googleapis.com/v1"
    places_search_radius: int = 5000

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
