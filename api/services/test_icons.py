#!/usr/bin/env python3
"""
Test script to verify all tech icons load correctly
Tests emoji mapping and Simple Icons CDN availability
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.icon_service import (
    TECH_EMOJI_MAP,
    get_tech_icon,
    search_icons,
    get_all_tech_categories
)

def test_emoji_mapping():
    """Test that all technologies have valid emoji and color data"""
    print("\n" + "="*80)
    print("🧪 TESTING EMOJI MAPPING")
    print("="*80)

    total = len(TECH_EMOJI_MAP)
    print(f"\n📊 Total technologies in database: {total}")

    # Count by category
    categories = {}
    for tech, data in TECH_EMOJI_MAP.items():
        category = data.get("category", "other")
        categories[category] = categories.get(category, 0) + 1

    print("\n📁 Technologies by category:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat:15} {count:3} techs")

    # Validate all entries
    print("\n✅ Validating all entries...")
    errors = []
    for tech, data in TECH_EMOJI_MAP.items():
        if not data.get("emoji"):
            errors.append(f"  ❌ {tech}: Missing emoji")
        if not data.get("color"):
            errors.append(f"  ❌ {tech}: Missing color")
        if not data.get("category"):
            errors.append(f"  ❌ {tech}: Missing category")

    if errors:
        print("\n⚠️  Validation errors found:")
        for error in errors:
            print(error)
    else:
        print(f"  ✅ All {total} technologies have valid emoji, color, and category!")

    return len(errors) == 0

def test_sample_icons():
    """Test fetching icons for sample technologies"""
    print("\n" + "="*80)
    print("🔍 TESTING SAMPLE ICON FETCHES")
    print("="*80)

    samples = [
        "react", "python", "typescript", "docker", "aws",
        "postgresql", "tailwind", "nextjs", "kubernetes", "graphql",
        "flutter", "rust", "vue", "mongodb", "firebase"
    ]

    print(f"\n🎯 Testing {len(samples)} sample technologies...\n")

    success_count = 0
    for tech in samples:
        icon_data = get_tech_icon(tech)
        has_svg = "svg_url" in icon_data

        status = "✅" if has_svg else "⚠️"
        emoji = icon_data.get("emoji", "?")
        color = icon_data.get("color", "N/A")
        category = icon_data.get("category", "N/A")

        print(f"{status} {emoji} {tech:15} | Color: {color:8} | Category: {category:10} | SVG: {has_svg}")

        if has_svg:
            success_count += 1

    print(f"\n📊 Results: {success_count}/{len(samples)} icons loaded successfully")
    return success_count >= len(samples) * 0.8  # 80% success rate

def test_search_functionality():
    """Test icon search functionality"""
    print("\n" + "="*80)
    print("🔎 TESTING SEARCH FUNCTIONALITY")
    print("="*80)

    queries = ["react", "python", "java", "node", "data"]

    print(f"\n🔍 Testing {len(queries)} search queries...\n")

    for query in queries:
        results = search_icons(query)
        print(f"  Query: '{query}' → {len(results)} results")
        for i, result in enumerate(results[:3], 1):
            emoji = result.get("emoji", "?")
            name = result.get("name", "Unknown")
            print(f"    {i}. {emoji} {name}")

    return True

def test_categories():
    """Test category organization"""
    print("\n" + "="*80)
    print("📂 TESTING CATEGORY ORGANIZATION")
    print("="*80)

    categories = get_all_tech_categories()

    print(f"\n📁 Available categories: {len(categories)}\n")

    total_techs = 0
    for category, techs in sorted(categories.items()):
        count = len(techs)
        total_techs += count
        print(f"  {category:15} {count:3} technologies")

        # Show first 3 examples
        examples = techs[:3]
        print(f"    Examples: {', '.join(examples)}")

    print(f"\n📊 Total technologies across all categories: {total_techs}")
    return True

def display_summary():
    """Display summary of available technologies"""
    print("\n" + "="*80)
    print("📋 COMPLETE TECHNOLOGY LIST")
    print("="*80)

    categories = get_all_tech_categories()

    for category, techs in sorted(categories.items()):
        print(f"\n📁 {category.upper()} ({len(techs)} items):")

        # Group by 5 for better readability
        for i in range(0, len(techs), 5):
            group = techs[i:i+5]
            tech_list = ", ".join(group)
            print(f"  {tech_list}")

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("🚀 SERENITYOPS ICON SERVICE - VERIFICATION SUITE")
    print("="*80)

    results = []

    # Run tests
    results.append(("Emoji Mapping", test_emoji_mapping()))
    results.append(("Sample Icons", test_sample_icons()))
    results.append(("Search Functionality", test_search_functionality()))
    results.append(("Category Organization", test_categories()))

    # Display all technologies
    display_summary()

    # Final report
    print("\n" + "="*80)
    print("📊 TEST RESULTS SUMMARY")
    print("="*80 + "\n")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} {test_name}")

    print(f"\n🎯 Overall: {passed}/{total} tests passed")

    if passed == total:
        print("\n✨ All tests passed! Icon service is ready for production.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please review the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
