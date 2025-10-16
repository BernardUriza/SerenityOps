#!/usr/bin/env python3
"""
Import existing CV from SVG file and populate curriculum.yaml

This script parses Bernard's existing CV (SVG format) and extracts
all text content to populate curriculum.yaml with real data.
"""

import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def extract_text_from_svg(svg_path: Path) -> list[str]:
    """
    Extract all text elements from SVG file.

    Args:
        svg_path: Path to SVG file

    Returns:
        List of text strings found in SVG
    """
    try:
        tree = ET.parse(svg_path)
        root = tree.getroot()

        # SVG namespace
        ns = {'svg': 'http://www.w3.org/2000/svg'}

        # Extract all text and tspan elements
        text_elements = []

        # Try with namespace
        for text in root.findall('.//svg:text', ns):
            content = ''.join(text.itertext()).strip()
            if content:
                text_elements.append(content)

        # Try without namespace (some SVGs don't use it properly)
        if not text_elements:
            for text in root.iter():
                if 'text' in text.tag.lower() or 'tspan' in text.tag.lower():
                    if text.text and text.text.strip():
                        text_elements.append(text.text.strip())

        return text_elements

    except ET.ParseError as e:
        print(f"XML Parse Error: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Error reading SVG: {e}", file=sys.stderr)
        return []


def main():
    svg_path = Path(r"C:\Users\Bernard.Orozco\Downloads\C# Full Stack Developer .svg")

    if not svg_path.exists():
        print(f"ERROR: CV file not found at {svg_path}")
        return 1

    print(f"Extracting text from {svg_path.name}...")
    print(f"File size: {svg_path.stat().st_size / 1024 / 1024:.1f}MB")
    print()

    text_content = extract_text_from_svg(svg_path)

    if not text_content:
        print("ERROR: No text found in SVG")
        return 1

    print(f"Found {len(text_content)} text elements:")
    print("="*60)

    for i, text in enumerate(text_content[:50], 1):  # Show first 50 elements
        print(f"{i:3d}. {text}")

    if len(text_content) > 50:
        print(f"... and {len(text_content) - 50} more")

    # Save to file for analysis
    output_path = Path("curriculum/cv_extracted.txt")
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        for text in text_content:
            f.write(text + '\n')

    print()
    print(f"Full extraction saved to: {output_path}")
    print()
    print("Next step: Review extracted content and map to curriculum.yaml structure")

    return 0


if __name__ == "__main__":
    sys.exit(main())
