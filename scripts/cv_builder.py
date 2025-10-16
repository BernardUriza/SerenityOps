#!/usr/bin/env python3
"""
CV Builder - AI-Powered Curriculum Vitae Generation

Uses Claude API to generate professional, modern CVs from structured YAML data.

Usage:
    python scripts/cv_builder.py --format html
    python scripts/cv_builder.py --format pdf
    python scripts/cv_builder.py --format html --output custom_cv.html
"""

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

import yaml

try:
    from anthropic import Anthropic
except ImportError:
    print("ERROR: anthropic library not installed")
    print("Install with: pip install anthropic")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("WARNING: python-dotenv not installed. Using environment variables only.")


# ========================
# Configuration
# ========================

CURRICULUM_PATH = Path("curriculum/curriculum.yaml")
OUTPUT_DIR = Path("curriculum/versions")

# Get API key from environment variable
CLAUDE_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not CLAUDE_API_KEY:
    print("ERROR: ANTHROPIC_API_KEY not found in environment")
    print("Please set it in .env file or as environment variable")
    sys.exit(1)


# ========================
# Core Functions
# ========================

def load_curriculum(path: Path = CURRICULUM_PATH) -> Dict[str, Any]:
    """
    Load structured CV data from YAML file.

    Returns:
        Dictionary containing all CV data sections
    """
    if not path.exists():
        raise FileNotFoundError(f"Curriculum file not found: {path}")

    with open(path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def generate_html_with_claude(cv_data: Dict[str, Any]) -> str:
    """
    Generate professional HTML CV using Claude API.

    Args:
        cv_data: Curriculum data from YAML

    Returns:
        Complete HTML document as string
    """
    # Convert YAML data to formatted string for prompt
    import yaml
    yaml_string = yaml.dump(cv_data, default_flow_style=False, allow_unicode=True)

    prompt = f"""Generate a professional, modern CV in HTML based on this YAML data:

```yaml
{yaml_string}
```

Requirements:
- Use contemporary design: clean typography, good spacing, professional colors
- Make it ATS-friendly but visually appealing
- Include all sections: personal, summary, experience, projects, skills, education
- Use semantic HTML5 elements
- Include embedded CSS in <style> tag (no external stylesheets)
- Responsive design that works on desktop and mobile
- Professional color scheme (blues, grays, or similar)
- Clear section headers with visual hierarchy
- Print-friendly styling

Return ONLY the complete HTML (including <!DOCTYPE>, <head>, <body>). No markdown code blocks, no explanations."""

    print("Calling Claude API to generate HTML...")
    print(f"Prompt length: {len(prompt)} characters")

    client = Anthropic(api_key=CLAUDE_API_KEY)

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            temperature=0.7,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        html_content = message.content[0].text

        # Remove markdown code blocks if Claude added them despite instructions
        if html_content.startswith("```html"):
            html_content = html_content.replace("```html", "").replace("```", "").strip()
        elif html_content.startswith("```"):
            html_content = html_content.replace("```", "").strip()

        print(f"Generated HTML: {len(html_content)} characters")
        return html_content

    except Exception as e:
        print(f"ERROR calling Claude API: {e}")
        raise


def html_to_pdf(html_content: str, output_path: Path) -> None:
    """
    Convert HTML to PDF using WeasyPrint.

    Args:
        html_content: HTML string
        output_path: Destination PDF file path
    """
    try:
        from weasyprint import HTML
        print(f"Converting HTML to PDF: {output_path}")
        HTML(string=html_content).write_pdf(output_path)
        print("PDF generated successfully")
    except ImportError:
        print("\nWARNING: WeasyPrint not installed or Cairo dependencies missing")
        print("Install instructions:")
        print("  pip install weasyprint")
        print("  Windows: Install GTK3 runtime from https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer")
        print("\nFalling back to HTML output only")
        raise
    except Exception as e:
        print(f"ERROR generating PDF: {e}")
        raise


def save_file(content: str, output_path: Path) -> Path:
    """
    Save content to file.

    Args:
        content: File content
        output_path: Destination path

    Returns:
        Path to saved file
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return output_path


def generate_cv(
    format: str = "html",
    output_path: Path | None = None
) -> Path:
    """
    Main CV generation orchestrator.

    Args:
        format: Output format ('html' or 'pdf')
        output_path: Optional custom output path

    Returns:
        Path to generated file
    """
    # 1. Load curriculum
    print(f"Loading curriculum from {CURRICULUM_PATH}...")
    cv_data = load_curriculum()
    print(f"Loaded CV for: {cv_data.get('personal', {}).get('full_name', 'Unknown')}")

    # 2. Generate HTML with Claude
    html_content = generate_html_with_claude(cv_data)

    # 3. Determine output path
    if output_path is None:
        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        if format == "html":
            filename = f"cv_{timestamp}.html"
        elif format == "pdf":
            filename = f"cv_{timestamp}.pdf"
        else:
            raise ValueError(f"Unknown format: {format}")
        output_path = OUTPUT_DIR / filename

    # 4. Save based on format
    if format == "html":
        return save_file(html_content, output_path)
    elif format == "pdf":
        # Save HTML first as intermediate
        html_path = output_path.with_suffix('.html')
        save_file(html_content, html_path)
        print(f"Saved intermediate HTML: {html_path}")

        # Convert to PDF
        try:
            html_to_pdf(html_content, output_path)
            return output_path
        except Exception as e:
            print(f"\nPDF generation failed. HTML version available at: {html_path}")
            return html_path
    else:
        raise ValueError(f"Unsupported format: {format}")


# ========================
# CLI Interface
# ========================

def parse_arguments() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Generate professional CV from curriculum.yaml using Claude API",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        "--format",
        choices=["html", "pdf"],
        default="html",
        help="Output format (default: html). PDF requires WeasyPrint + Cairo."
    )

    parser.add_argument(
        "--output",
        type=Path,
        help="Custom output path (auto-generated if not provided)"
    )

    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )

    return parser.parse_args()


def main() -> int:
    """Main entry point."""
    args = parse_arguments()

    print("="*60)
    print("SerenityOps CV Builder - Claude API Edition")
    print("="*60)
    print()

    try:
        output_file = generate_cv(
            format=args.format,
            output_path=args.output
        )

        print()
        print("="*60)
        print(f"[SUCCESS] CV generated: {output_file}")
        print(f"File size: {output_file.stat().st_size / 1024:.1f} KB")
        print("="*60)
        return 0

    except FileNotFoundError as e:
        print(f"[ERROR] File not found: {e}")
        return 1

    except ValueError as e:
        print(f"[ERROR] Invalid input: {e}")
        return 1

    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
