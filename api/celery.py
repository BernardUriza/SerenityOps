"""
Celery configuration for SerenityOps

Configures Celery with Redis broker and fallback to in-memory transport.
System continues to work without Redis available.
"""

import os
import logging
from celery import Celery
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logger = logging.getLogger(__name__)

# Get broker and backend URLs from environment with fallbacks
broker_url = os.getenv("CELERY_BROKER_URL", "memory://")
result_backend = os.getenv("CELERY_RESULT_BACKEND", "rpc://")

# Initialize Celery app
app = Celery(
    "serenityops",
    broker=broker_url,
    backend=result_backend
)

# Celery configuration
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Auto-discover tasks
app.autodiscover_tasks(['api.services'])

# Log configuration
logger.info(f"[Redis] Celery broker set to {broker_url}")
logger.info(f"[Redis] Celery result backend set to {result_backend}")

if broker_url == "memory://":
    logger.warning("[Redis] Running with in-memory broker - tasks will not persist across restarts")

# Test Redis connection
try:
    if broker_url.startswith("redis://"):
        from redis import Redis
        redis_client = Redis.from_url(broker_url)
        redis_client.ping()
        logger.info("[Redis] Successfully connected to Redis")
except Exception as e:
    logger.warning(f"[Redis] Could not connect to Redis: {e}. Falling back to in-memory transport.")
