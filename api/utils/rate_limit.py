"""
Rate limiting for Claude API calls using Redis

Implements atomic rate limiting with sliding window.
Falls back gracefully if Redis is not available.
"""

import os
import logging
from typing import Optional
from fastapi import HTTPException
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logger = logging.getLogger(__name__)

# Initialize Redis client (or None if not available)
redis_client: Optional[any] = None
redis_url = os.getenv("RATE_LIMIT_REDIS_URL")

if redis_url:
    try:
        import redis
        redis_client = redis.from_url(redis_url, decode_responses=True)
        redis_client.ping()
        logger.info(f"[Redis] Rate limiter connected to {redis_url}")
    except ImportError:
        logger.warning("[Redis] redis package not installed - rate limiting disabled")
        redis_client = None
    except Exception as e:
        logger.warning(f"[Redis] Could not connect for rate limiting: {e}")
        redis_client = None
else:
    logger.info("[Redis] RATE_LIMIT_REDIS_URL not set - rate limiting disabled")


def check_rate_limit(
    user_id: str,
    limit: int = 60,
    window: int = 60
) -> None:
    """
    Check if user has exceeded rate limit for Claude API calls.

    Args:
        user_id: Unique identifier for the user (e.g., "default" for single-user system)
        limit: Maximum number of requests allowed in the window
        window: Time window in seconds (default: 60s)

    Raises:
        HTTPException: 429 if rate limit exceeded

    Notes:
        - If Redis is not available, this function does nothing (graceful degradation)
        - Uses atomic INCR with EXPIRE for sliding window rate limiting
    """
    if not redis_client:
        # Rate limiting disabled - allow all requests
        return

    try:
        key = f"rate:claude:{user_id}"

        # Atomic increment
        current = redis_client.incr(key)

        # Set expiry on first request
        if current == 1:
            redis_client.expire(key, window)

        # Check if limit exceeded
        if current > limit:
            remaining_ttl = redis_client.ttl(key)
            logger.warning(
                f"[Redis] Rate limit exceeded for user={user_id}: "
                f"{current}/{limit} requests. Resets in {remaining_ttl}s"
            )
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "limit": limit,
                    "window": window,
                    "reset_in_seconds": remaining_ttl,
                    "message": f"Too many Claude API requests. Try again in {remaining_ttl} seconds."
                }
            )

        # Log successful check
        if current % 10 == 0:  # Log every 10th request to reduce noise
            logger.info(f"[Redis] Rate limit check passed: {current}/{limit} for user={user_id}")

    except HTTPException:
        # Re-raise HTTP exceptions (rate limit exceeded)
        raise
    except Exception as e:
        # Log error but don't block the request
        logger.error(f"[Redis] Rate limit check failed: {e}")
        # Continue without rate limiting


def get_rate_limit_status(user_id: str) -> dict:
    """
    Get current rate limit status for a user.

    Args:
        user_id: Unique identifier for the user

    Returns:
        dict with keys: enabled, current_count, reset_in_seconds
    """
    if not redis_client:
        return {
            "enabled": False,
            "current_count": 0,
            "reset_in_seconds": 0
        }

    try:
        key = f"rate:claude:{user_id}"
        current = redis_client.get(key)
        ttl = redis_client.ttl(key) if current else 0

        return {
            "enabled": True,
            "current_count": int(current) if current else 0,
            "reset_in_seconds": max(0, ttl)
        }
    except Exception as e:
        logger.error(f"[Redis] Could not get rate limit status: {e}")
        return {
            "enabled": False,
            "current_count": 0,
            "reset_in_seconds": 0,
            "error": str(e)
        }
