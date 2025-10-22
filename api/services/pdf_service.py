"""
PDF Generation Service

Wraps the Node.js Puppeteer service for HTML to PDF conversion.
Provides Python interface for the FastAPI backend.
"""

import subprocess
import json
from pathlib import Path
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

PDF_GENERATOR_PATH = Path(__file__).parent / "pdf_generator" / "generate_pdf.js"


class PDFGenerationError(Exception):
    """Raised when PDF generation fails"""
    pass


def generate_pdf_from_html(
    html_path: Path,
    output_path: Path,
    format: str = "A4",
    margin: str = "medium",
    landscape: bool = False
) -> Dict[str, Any]:
    """
    Generate PDF from HTML file using Puppeteer

    Args:
        html_path: Path to input HTML file
        output_path: Path where PDF should be saved
        format: Paper format (A4, Letter, Legal)
        margin: Margin size (none, small, medium, large)
        landscape: Whether to use landscape orientation

    Returns:
        Dict with generation result metadata

    Raises:
        PDFGenerationError: If PDF generation fails
    """
    if not html_path.exists():
        raise PDFGenerationError(f"HTML file not found: {html_path}")

    if not PDF_GENERATOR_PATH.exists():
        raise PDFGenerationError(f"PDF generator script not found: {PDF_GENERATOR_PATH}")

    # Build command
    cmd = [
        "node",
        str(PDF_GENERATOR_PATH),
        str(html_path),
        str(output_path),
        "--format", format,
        "--margin", margin
    ]

    if landscape:
        cmd.append("--landscape")

    # Execute Node.js script
    try:
        logger.info(f"Generating PDF: {html_path} -> {output_path}")
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30,
            check=True
        )

        logger.info(f"PDF generation output: {result.stdout}")

        # Verify output file was created
        if not output_path.exists():
            raise PDFGenerationError(f"PDF file was not created: {output_path}")

        return {
            "success": True,
            "path": str(output_path),
            "size": output_path.stat().st_size,
            "format": format,
            "margin": margin,
            "landscape": landscape
        }

    except subprocess.TimeoutExpired:
        raise PDFGenerationError("PDF generation timed out after 30 seconds")

    except subprocess.CalledProcessError as e:
        error_msg = e.stderr or e.stdout or str(e)
        logger.error(f"PDF generation failed: {error_msg}")
        raise PDFGenerationError(f"PDF generation failed: {error_msg}")

    except Exception as e:
        logger.error(f"Unexpected error during PDF generation: {str(e)}")
        raise PDFGenerationError(f"Unexpected error: {str(e)}")


def generate_pdf_from_html_content(
    html_content: str,
    output_path: Path,
    format: str = "A4",
    margin: str = "medium",
    landscape: bool = False
) -> Dict[str, Any]:
    """
    Generate PDF from HTML content string using Puppeteer

    Args:
        html_content: HTML content as string
        output_path: Path where PDF should be saved
        format: Paper format (A4, Letter, Legal)
        margin: Margin size (none, small, medium, large)
        landscape: Whether to use landscape orientation

    Returns:
        Dict with generation result metadata

    Raises:
        PDFGenerationError: If PDF generation fails
    """
    import tempfile
    import os

    # Create temporary HTML file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as temp_html:
        temp_html.write(html_content)
        temp_html_path = Path(temp_html.name)

    try:
        # Generate PDF from temporary HTML file
        result = generate_pdf_from_html(
            html_path=temp_html_path,
            output_path=output_path,
            format=format,
            margin=margin,
            landscape=landscape
        )
        return result

    finally:
        # Clean up temporary HTML file
        try:
            os.unlink(temp_html_path)
        except Exception as e:
            logger.warning(f"Failed to delete temporary HTML file {temp_html_path}: {str(e)}")


def is_pdf_service_available() -> bool:
    """
    Check if PDF generation service is available

    Returns:
        True if Node.js and Puppeteer are available
    """
    try:
        # Check Node.js
        subprocess.run(
            ["node", "--version"],
            capture_output=True,
            timeout=5,
            check=True
        )

        # Check if PDF generator script exists
        if not PDF_GENERATOR_PATH.exists():
            logger.warning(f"PDF generator script not found: {PDF_GENERATOR_PATH}")
            return False

        # Check if node_modules exists
        node_modules = PDF_GENERATOR_PATH.parent / "node_modules"
        if not node_modules.exists():
            logger.warning("Puppeteer dependencies not installed. Run: cd api/services/pdf_generator && npm install")
            return False

        return True

    except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
        logger.warning("Node.js not found. PDF generation will be unavailable.")
        return False
