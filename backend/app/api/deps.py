"""Shared dependencies injected into route handlers."""

from fastapi import Request
import httpx


def get_http_client(request: Request) -> httpx.AsyncClient:
    """Return the shared async HTTP client stored on app.state during lifespan."""
    return request.app.state.http_client
