"""
Claude API client wrapper with rate limiting and caching

Provides a centralized interface for Claude API calls with:
- Rate limiting (Redis-based)
- Response caching (optional, Redis-based)
- Error handling and logging
"""

import logging
from typing import Optional, List, Dict, Any
from anthropic import Anthropic
from .rate_limit import check_rate_limit
from .claude_cache import get_cached_response, set_cached_response

logger = logging.getLogger(__name__)


def call_claude_with_protection(
    client: Anthropic,
    model: str,
    max_tokens: int,
    messages: List[Dict[str, str]],
    user_id: str = "default",
    use_cache: bool = False,
    cache_ttl: Optional[int] = None
) -> Any:
    """
    Call Claude API with rate limiting and optional caching.

    Args:
        client: Anthropic client instance
        model: Model identifier (e.g., "claude-sonnet-4-20250514")
        max_tokens: Maximum tokens for response
        messages: Message history for the API call
        user_id: User identifier for rate limiting (default: "default" for single-user system)
        use_cache: Whether to use caching for this request
        cache_ttl: Custom TTL for cache (seconds)

    Returns:
        Claude API response object

    Raises:
        HTTPException: 429 if rate limit exceeded
        Exception: Any other API errors

    Notes:
        - Rate limiting is always applied (if Redis available)
        - Caching is optional and only used if use_cache=True
        - Falls back gracefully if Redis is not available
    """
    # Apply rate limiting
    check_rate_limit(user_id=user_id, limit=60, window=60)

    # Generate cache key from first user message (for simple caching)
    cache_prompt = None
    if use_cache and messages:
        for msg in messages:
            if msg.get("role") == "user":
                cache_prompt = msg.get("content", "")
                break

    # Check cache if enabled
    if use_cache and cache_prompt:
        cached = get_cached_response(cache_prompt, model=model)
        if cached:
            logger.info(f"[Claude] Returning cached response for model={model}")
            # Reconstruct response object from cached data
            class CachedResponse:
                def __init__(self, data):
                    self.content = [type('obj', (object,), {'text': data['text']})]
                    self.model = data.get('model', model)
                    self.role = data.get('role', 'assistant')

            return CachedResponse(cached)

    # Make actual API call
    logger.info(f"[Claude] Making API call to model={model} with max_tokens={max_tokens}")
    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=messages
    )

    # Cache response if enabled
    if use_cache and cache_prompt and response:
        try:
            cached_data = {
                'text': response.content[0].text if response.content else "",
                'model': response.model,
                'role': response.role
            }
            set_cached_response(cache_prompt, cached_data, model=model, custom_ttl=cache_ttl)
        except Exception as e:
            logger.warning(f"[Claude] Failed to cache response: {e}")

    return response
