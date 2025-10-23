#!/usr/bin/env python3
"""
Generate favicon.ico from SVG logo

Converts the SerenityOps SVG logo to a multi-resolution .ico file
suitable for use as a favicon in web applications.
"""

import sys
from pathlib import Path

try:
    from cairosvg import svg2png
    from PIL import Image
    import io
except ImportError as e:
    print(f"Missing required packages. Install with:")
    print(f"  pip install cairosvg pillow")
    sys.exit(1)


def generate_favicon(svg_path: Path, output_path: Path):
    """
    Generate multi-resolution favicon from SVG

    Args:
        svg_path: Path to input SVG file
        output_path: Path for output .ico file
    """
    print(f"📄 Reading SVG: {svg_path}")

    # Read SVG file
    with open(svg_path, 'rb') as f:
        svg_data = f.read()

    # Generate PNG at different sizes for ICO
    sizes = [16, 32, 48, 64, 128, 256]
    images = []

    print(f"🔄 Converting SVG to PNG at multiple resolutions...")

    for size in sizes:
        print(f"  - {size}x{size}px")

        # Convert SVG to PNG at specific size
        png_data = svg2png(
            bytestring=svg_data,
            output_width=size,
            output_height=size
        )

        # Load PNG with Pillow
        img = Image.open(io.BytesIO(png_data))
        images.append(img)

    # Save as ICO with multiple resolutions
    print(f"💾 Saving favicon: {output_path}")
    images[0].save(
        output_path,
        format='ICO',
        sizes=[(img.width, img.height) for img in images],
        append_images=images[1:]
    )

    print(f"✅ Favicon generated successfully!")
    print(f"   Size: {output_path.stat().st_size / 1024:.1f} KB")


def main():
    # Paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    svg_path = project_root / "assets" / "logo.svg"
    output_dir = project_root / "frontend" / "public"
    output_path = output_dir / "favicon.ico"

    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)

    # Check if SVG exists
    if not svg_path.exists():
        print(f"❌ Error: SVG not found at {svg_path}")
        sys.exit(1)

    # Generate favicon
    generate_favicon(svg_path, output_path)

    # Also generate PNG versions for various uses
    print(f"\n🎨 Generating additional PNG assets...")

    # App icon (512x512)
    app_icon_path = output_dir / "logo512.png"
    svg_data = svg_path.read_bytes()
    png_512 = svg2png(bytestring=svg_data, output_width=512, output_height=512)
    app_icon_path.write_bytes(png_512)
    print(f"  ✓ logo512.png ({app_icon_path.stat().st_size / 1024:.1f} KB)")

    # Medium icon (192x192)
    medium_icon_path = output_dir / "logo192.png"
    png_192 = svg2png(bytestring=svg_data, output_width=192, output_height=192)
    medium_icon_path.write_bytes(png_192)
    print(f"  ✓ logo192.png ({medium_icon_path.stat().st_size / 1024:.1f} KB)")

    print(f"\n🎉 All assets generated!")
    print(f"\nGenerated files:")
    print(f"  - {output_path}")
    print(f"  - {app_icon_path}")
    print(f"  - {medium_icon_path}")


if __name__ == "__main__":
    main()
