"""
Icon Service - Provides tech stack icons and emojis
Integrates with Simple Icons and emoji databases
"""

import requests
from typing import List, Dict, Optional
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

# Tech stack to emoji mapping
TECH_EMOJI_MAP = {
    # Languages
    "python": {"emoji": "🐍", "color": "#3776AB", "category": "language"},
    "javascript": {"emoji": "💛", "color": "#F7DF1E", "category": "language"},
    "typescript": {"emoji": "🔷", "color": "#3178C6", "category": "language"},
    "java": {"emoji": "☕", "color": "#007396", "category": "language"},
    "csharp": {"emoji": "🔵", "color": "#239120", "category": "language"},
    "c#": {"emoji": "🔵", "color": "#239120", "category": "language"},
    "go": {"emoji": "🐹", "color": "#00ADD8", "category": "language"},
    "rust": {"emoji": "🦀", "color": "#000000", "category": "language"},
    "php": {"emoji": "🐘", "color": "#777BB4", "category": "language"},
    "ruby": {"emoji": "💎", "color": "#CC342D", "category": "language"},
    "swift": {"emoji": "🦅", "color": "#FA7343", "category": "language"},
    "kotlin": {"emoji": "🟣", "color": "#7F52FF", "category": "language"},

    # Frameworks
    "react": {"emoji": "⚛️", "color": "#61DAFB", "category": "framework"},
    "vue": {"emoji": "🟢", "color": "#4FC08D", "category": "framework"},
    "angular": {"emoji": "🔺", "color": "#DD0031", "category": "framework"},
    "next": {"emoji": "▲", "color": "#000000", "category": "framework"},
    "nextjs": {"emoji": "▲", "color": "#000000", "category": "framework"},
    "svelte": {"emoji": "🔥", "color": "#FF3E00", "category": "framework"},
    "django": {"emoji": "🎸", "color": "#092E20", "category": "framework"},
    "flask": {"emoji": "🌶️", "color": "#000000", "category": "framework"},
    "fastapi": {"emoji": "⚡", "color": "#009688", "category": "framework"},
    "express": {"emoji": "🚂", "color": "#000000", "category": "framework"},
    "nestjs": {"emoji": "🐱", "color": "#E0234E", "category": "framework"},
    "spring": {"emoji": "🍃", "color": "#6DB33F", "category": "framework"},

    # Databases
    "postgresql": {"emoji": "🐘", "color": "#4169E1", "category": "database"},
    "mysql": {"emoji": "🐬", "color": "#4479A1", "category": "database"},
    "mongodb": {"emoji": "🍃", "color": "#47A248", "category": "database"},
    "redis": {"emoji": "🔴", "color": "#DC382D", "category": "database"},
    "sqlite": {"emoji": "🗄️", "color": "#003B57", "category": "database"},
    "elasticsearch": {"emoji": "🔍", "color": "#005571", "category": "database"},
    "dynamodb": {"emoji": "🗃️", "color": "#4053D6", "category": "database"},

    # Cloud/DevOps
    "aws": {"emoji": "☁️", "color": "#FF9900", "category": "platform"},
    "azure": {"emoji": "🔷", "color": "#0078D4", "category": "platform"},
    "gcp": {"emoji": "🌐", "color": "#4285F4", "category": "platform"},
    "docker": {"emoji": "🐳", "color": "#2496ED", "category": "tool"},
    "kubernetes": {"emoji": "☸️", "color": "#326CE5", "category": "tool"},
    "terraform": {"emoji": "🛠️", "color": "#7B42BC", "category": "tool"},
    "jenkins": {"emoji": "🔨", "color": "#D24939", "category": "tool"},
    "github": {"emoji": "🐙", "color": "#181717", "category": "tool"},
    "gitlab": {"emoji": "🦊", "color": "#FCA121", "category": "tool"},
    "bitbucket": {"emoji": "🪣", "color": "#0052CC", "category": "tool"},

    # Tools
    "git": {"emoji": "📚", "color": "#F05032", "category": "tool"},
    "vscode": {"emoji": "💻", "color": "#007ACC", "category": "tool"},
    "vim": {"emoji": "📝", "color": "#019733", "category": "tool"},
    "figma": {"emoji": "🎨", "color": "#F24E1E", "category": "tool"},
    "postman": {"emoji": "📮", "color": "#FF6C37", "category": "tool"},
}

@lru_cache(maxsize=128)
def get_simple_icons_data(query: str) -> Optional[Dict]:
    """
    Fetch icon data from Simple Icons API
    Cached to reduce API calls
    """
    try:
        normalized_query = query.lower().replace(" ", "").replace("-", "")
        url = f"https://cdn.simpleicons.org/{normalized_query}"

        # Check if icon exists (HEAD request)
        response = requests.head(url, timeout=2)
        if response.status_code == 200:
            return {
                "svg_url": url,
                "name": query,
                "available": True
            }
        return None
    except Exception as e:
        logger.warning(f"Failed to fetch Simple Icons data for {query}: {e}")
        return None

def get_tech_icon(query: str) -> Dict:
    """
    Get icon data for a technology
    Returns emoji, svg_url, color, and category
    """
    normalized = query.lower().replace(" ", "").replace("-", "")

    # Check local emoji map first
    if normalized in TECH_EMOJI_MAP:
        icon_data = TECH_EMOJI_MAP[normalized].copy()
        icon_data["name"] = query

        # Try to get SVG from Simple Icons
        simple_icon = get_simple_icons_data(normalized)
        if simple_icon:
            icon_data["svg_url"] = simple_icon["svg_url"]

        return icon_data

    # Fallback: try Simple Icons only
    simple_icon = get_simple_icons_data(normalized)
    if simple_icon:
        return {
            "name": query,
            "svg_url": simple_icon["svg_url"],
            "emoji": "🔧",  # Generic tool emoji
            "color": "#808080",
            "category": "other"
        }

    # Final fallback
    return {
        "name": query,
        "emoji": "🔧",
        "color": "#808080",
        "category": "other"
    }

def search_icons(query: str) -> List[Dict]:
    """
    Search for icons matching a query
    Returns list of possible matches
    """
    query_lower = query.lower()
    results = []

    # Search local emoji map
    for tech, data in TECH_EMOJI_MAP.items():
        if query_lower in tech or tech in query_lower:
            icon_data = data.copy()
            icon_data["name"] = tech

            # Try to get SVG
            simple_icon = get_simple_icons_data(tech)
            if simple_icon:
                icon_data["svg_url"] = simple_icon["svg_url"]

            results.append(icon_data)

    # If no results, try exact match with Simple Icons
    if not results:
        simple_icon = get_simple_icons_data(query)
        if simple_icon:
            results.append({
                "name": query,
                "svg_url": simple_icon["svg_url"],
                "emoji": "🔧",
                "color": "#808080",
                "category": "other"
            })

    return results if results else [get_tech_icon(query)]

def get_all_tech_categories() -> Dict[str, List[str]]:
    """
    Get all available technologies organized by category
    """
    categories: Dict[str, List[str]] = {
        "language": [],
        "framework": [],
        "database": [],
        "platform": [],
        "tool": [],
        "other": []
    }

    for tech, data in TECH_EMOJI_MAP.items():
        category = data.get("category", "other")
        categories[category].append(tech)

    return categories
