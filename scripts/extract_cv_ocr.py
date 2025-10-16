#!/usr/bin/env python3
"""
Extract CV text from SVG using OCR

Strategy:
1. Convert SVG to high-res PNG using cairosvg
2. Apply OCR using pytesseract
3. Structure extracted text
4. Save to curriculum/cv_extracted_ocr.txt for review

Requirements:
- pip install cairosvg pillow pytesseract
- Tesseract OCR binary installed (https://github.com/tesseract-ocr/tesseract)
  Windows: Download installer from https://github.com/UB-Mannheim/tesseract/wiki
  After install, add to PATH or configure pytesseract.pytesseract.tesseract_cmd
"""

import sys
from pathlib import Path

try:
    import cairosvg
    from PIL import Image
    import pytesseract
except ImportError as e:
    print(f"ERROR: Missing dependency: {e}")
    print("Install with: pip install cairosvg pillow pytesseract")
    sys.exit(1)


def svg_to_png(svg_path: Path, png_path: Path, dpi: int = 300) -> None:
    """
    Convert SVG to high-resolution PNG for OCR.

    Args:
        svg_path: Input SVG file
        png_path: Output PNG file
        dpi: Resolution (higher = better OCR, slower)
    """
    print(f"Converting SVG to PNG at {dpi} DPI...")
    print(f"  Input: {svg_path}")
    print(f"  Output: {png_path}")

    # Read SVG file
    with open(svg_path, 'rb') as f:
        svg_data = f.read()

    # Convert to PNG with high resolution
    cairosvg.svg2png(
        bytestring=svg_data,
        write_to=str(png_path),
        dpi=dpi
    )

    # Get PNG info
    with Image.open(png_path) as img:
        print(f"  Generated: {img.width}x{img.height} pixels")


def ocr_extract(png_path: Path) -> str:
    """
    Extract text from PNG using Tesseract OCR.

    Args:
        png_path: Input PNG file

    Returns:
        Extracted text
    """
    print(f"\nRunning OCR on {png_path.name}...")

    try:
        # Try to run OCR
        image = Image.open(png_path)
        text = pytesseract.image_to_string(image, lang='eng')
        return text

    except pytesseract.TesseractNotFoundError:
        print("\nERROR: Tesseract OCR not found!")
        print("\nInstallation instructions:")
        print("  Windows: https://github.com/UB-Mannheim/tesseract/wiki")
        print("  After install, either:")
        print("    1. Add to PATH, or")
        print("    2. Set: pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'")
        sys.exit(1)


def main():
    svg_path = Path(r"C:\Users\Bernard.Orozco\Downloads\C# Full Stack Developer .svg")
    png_path = Path("curriculum/cv_rendered.png")
    output_path = Path("curriculum/cv_extracted_ocr.txt")

    if not svg_path.exists():
        print(f"ERROR: CV file not found at {svg_path}")
        return 1

    # Create output directory
    png_path.parent.mkdir(exist_ok=True)
    output_path.parent.mkdir(exist_ok=True)

    print("="*60)
    print("CV Text Extraction via OCR")
    print("="*60)
    print()

    # Step 1: Convert SVG to PNG
    try:
        svg_to_png(svg_path, png_path, dpi=300)
    except Exception as e:
        print(f"ERROR converting SVG to PNG: {e}")
        return 1

    # Step 2: Extract text via OCR
    try:
        extracted_text = ocr_extract(png_path)
    except Exception as e:
        print(f"ERROR during OCR: {e}")
        return 1

    # Step 3: Save results
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(extracted_text)

    print(f"\nExtracted {len(extracted_text)} characters")
    print(f"Saved to: {output_path}")
    print()
    print("First 500 characters:")
    print("-"*60)
    print(extracted_text[:500])
    print("-"*60)
    print()
    print("Next steps:")
    print("1. Review extracted text in curriculum/cv_extracted_ocr.txt")
    print("2. Structure into curriculum.yaml manually or with assistance")

    return 0


if __name__ == "__main__":
    sys.exit(main())
