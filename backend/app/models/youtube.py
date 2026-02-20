"""Pydantic models for YouTube video results."""

from pydantic import BaseModel, Field


class YouTubeVideo(BaseModel):
    """A single YouTube video result."""

    video_id: str
    title: str
    channel: str = ""
    thumbnail_url: str = ""
    video_url: str = ""
