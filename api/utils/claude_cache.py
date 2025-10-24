"""
Caching for Claude API responses using Redis

Reduces redundant API calls by caching responses with TTL.
Falls back gracefully if Redis is not available.
"""

import os
import json
import hashlib
import logging
from typing import Optional, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logger = logging.getLogger(__name__)

# Configuration
ttl = int(os.getenv("CLAUDE_CACHE_TTL", "180"))  # 3 minutes default
redis_url = os.getenv("RATE_LIMIT_REDIS_URL")

# Initialize Redis client (or None if not available)
redis_client: Optional[any] = None

if redis_url:
    try:
        import redis
        redis_client = redis.from_url(redis_url, decode_responses=False)  # Binary mode for JSON
        redis_client.ping()
        logger.info(f"[Redis] Claude cache connected with TTL={ttl}s")
    except ImportError:
        logger.warning("[Redis] redis package not installed - caching disabled")
        redis_client = None
    except Exception as e:
        logger.warning(f"[Redis] Could not connect for caching: {e}")
        redis_client = None
else:
    logger.info("[Redis] Caching disabled (no RATE_LIMIT_REDIS_URL)")


def _hash_key(prompt: str, model: str = "default") -> str:
    """
    Generate a stable hash key for a prompt + model combination.

    Args:
        prompt: The prompt text to hash
        model: Model identifier (e.g., "claude-sonnet-4-20250514")

    Returns:
        SHA256 hash hex digest
    """
    combined = f"{model}:{prompt}"
    return hashlib.sha256(combined.encode('utf-8')).hexdigest()


def get_cached_response(prompt: str, model: str = "default") -> Optional[dict]:
    """
    Retrieve cached Claude API response if available.

    Args:
        prompt: The prompt text (used for cache key)
        model: Model identifier

    Returns:
        Cached response dict or None if not found/expired

    Notes:
        - Returns None if Redis is not available (graceful degradation)
        - Returns None if cache miss or expired
    """
    if not redis_client:
        return None

    try:
        key = f"claude:cache:{_hash_key(prompt, model)}"
        value = redis_client.get(key)

        if value:
            response = json.loads(value)
            logger.info(f"[Redis] Cache HIT for prompt hash {_hash_key(prompt, model)[:8]}...")
            return response

        logger.debug(f"[Redis] Cache MISS for prompt hash {_hash_key(prompt, model)[:8]}...")
        return None

    except Exception as e:
        logger.error(f"[Redis] Error retrieving from cache: {e}")
        return None


def set_cached_response(prompt: str, response: dict, model: str = "default", custom_ttl: Optional[int] = None) -> None:
    """
    Store Claude API response in cache with TTL.

    Args:
        prompt: The prompt text (used for cache key)
        response: The API response dict to cache
        model: Model identifier
        custom_ttl: Override default TTL (in seconds)

    Notes:
        - Silently fails if Redis is not available (graceful degradation)
        - Uses SETEX for atomic set with expiry
    """
    if not redis_client:
        return

    try:
        key = f"claude:cache:{_hash_key(prompt, model)}"
        value = json.dumps(response)
        cache_ttl = custom_ttl if custom_ttl is not None else ttl

        redis_client.setex(key, cache_ttl, value)
        logger.info(
            f"[Redis] Cached response for prompt hash {_hash_key(prompt, model)[:8]}... "
            f"(TTL={cache_ttl}s)"
        )

    except Exception as e:
        logger.error(f"[Redis] Error storing in cache: {e}")


def invalidate_cache(prompt: str, model: str = "default") -> bool:
    """
    Invalidate a specific cached response.

    Args:
        prompt: The prompt text to invalidate
        model: Model identifier

    Returns:
        True if key was deleted, False otherwise
    """
    if not redis_client:
        return False

    try:
        key = f"claude:cache:{_hash_key(prompt, model)}"
        deleted = redis_client.delete(key)
        if deleted:
            logger.info(f"[Redis] Invalidated cache for prompt hash {_hash_key(prompt, model)[:8]}...")
        return bool(deleted)
    except Exception as e:
        logger.error(f"[Redis] Error invalidating cache: {e}")
        return False


def clear_all_cache() -> int:
    """
    Clear all Claude API response caches.

    Returns:
        Number of keys deleted

    Warning:
        This deletes ALL keys matching the pattern "claude:cache:*"
    """
    if not redis_client:
        return 0

    try:
        pattern = "claude:cache:*"
        keys = redis_client.keys(pattern)
        if keys:
            deleted = redis_client.delete(*keys)
            logger.info(f"[Redis] Cleared {deleted} cached responses")
            return deleted
        return 0
    except Exception as e:
        logger.error(f"[Redis] Error clearing cache: {e}")
        return 0


def get_cache_stats() -> dict:
    """
    Get statistics about the cache.

    Returns:
        dict with keys: enabled, total_keys, estimated_memory_bytes
    """
    if not redis_client:
        return {
            "enabled": False,
            "total_keys": 0,
            "estimated_memory_bytes": 0
        }

    try:
        pattern = "claude:cache:*"
        keys = redis_client.keys(pattern)

        # Estimate memory usage (rough approximation)
        memory = 0
        for key in keys[:100]:  # Sample first 100 keys to avoid blocking
            try:
                memory += redis_client.memory_usage(key) or 0
            except:
                pass

        return {
            "enabled": True,
            "total_keys": len(keys),
            "estimated_memory_bytes": memory * (len(keys) / min(100, len(keys))) if keys else 0
        }
    except Exception as e:
        logger.error(f"[Redis] Error getting cache stats: {e}")
        return {
            "enabled": False,
            "total_keys": 0,
            "estimated_memory_bytes": 0,
            "error": str(e)
        }
