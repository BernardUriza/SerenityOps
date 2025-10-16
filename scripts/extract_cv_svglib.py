#!/usr/bin/env python3
"""
Extract CV using svglib (Cairo-free alternative)
"""

import sys
from pathlib import Path

try:
    from svglib.svglib import svg2rlg
    from reportlab.graphics import renderPM
    from PIL import Image
    import pytesseract
except ImportError as e:
    print(f"ERROR: {e}")
    print("Install: pip install svglib reportlab pillow pytesseract")
    sys.exit(1)


def main():
    svg_path = Path(r"C:\Users\Bernard.Orozco\Downloads\C# Full Stack Developer .svg")
    png_path = Path("curriculum/cv_rendered_svglib.png")
    output_path = Path("curriculum/cv_extracted.txt")

    print("Converting SVG to PNG using svglib...")

    try:
        # Convert SVG to ReportLab drawing
        drawing = svg2rlg(svg_path)

        if drawing is None:
            print("ERROR: Could not parse SVG")
            return 1

        # Render to PNG
        renderPM.drawToFile(drawing, str(png_path), fmt="PNG", dpi=300)
        print(f"Generated: {png_path}")

        # OCR
        print("Running OCR...")
        try:
            image = Image.open(png_path)
            text = pytesseract.image_to_string(image, lang='eng')

            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(text)

            print(f"\nExtracted {len(text)} characters")
            print(f"Saved to: {output_path}\n")
            print("Preview:")
            print("-"*60)
            print(text[:500])
            print("-"*60)

        except pytesseract.TesseractNotFoundError:
            print("\nWARNING: Tesseract not found. PNG generated but OCR skipped.")
            print(f"PNG saved at: {png_path}")
            print("\nManual option: Open PNG and extract text manually")

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
