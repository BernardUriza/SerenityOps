#!/usr/bin/env python3
"""
Separate server entrypoint to avoid caching issues
"""
import uvicorn
from main import app

if __name__ == "__main__":
    print("=" * 60)
    print("SerenityOps API Server (via server.py)")
    print("=" * 60)
    print("Starting on http://localhost:8000")
    print("API docs: http://localhost:8000/docs")
    print("=" * 60)

    # List registered routes for debugging
    routes = [r.path for r in app.routes if hasattr(r, 'path') and '/api/' in r.path]
    print(f"Registered API routes: {len(routes)}")
    for route in sorted(routes):
        print(f"  - {route}")
    print("=" * 60)

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
