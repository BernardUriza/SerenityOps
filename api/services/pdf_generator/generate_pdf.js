#!/usr/bin/env node
/**
 * SerenityOps PDF Generator
 *
 * Converts HTML to PDF using Puppeteer with professional formatting
 *
 * Usage:
 *   node generate_pdf.js <html_file> <output_pdf> [options]
 *
 * Options:
 *   --format <format>     Paper format: A4, Letter, Legal (default: A4)
 *   --margin <size>       Margin size: none, small, medium, large (default: medium)
 *   --landscape           Landscape orientation (default: portrait)
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const MARGIN_PRESETS = {
  none: { top: '0', right: '0', bottom: '0', left: '0' },
  small: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
  medium: { top: '0.75in', right: '0.75in', bottom: '0.75in', left: '0.75in' },
  large: { top: '1in', right: '1in', bottom: '1in', left: '1in' }
};

async function generatePDF(htmlPath, outputPath, options = {}) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none', // Better font rendering
      '--disable-font-subpixel-positioning' // Consistent font positioning
    ]
  });

  try {
    const page = await browser.newPage();

    // Enable emulate media for print styles
    await page.emulateMediaType('print');

    // Read HTML content
    const htmlContent = await fs.readFile(htmlPath, 'utf-8');

    // Set content with base URL for relative resources
    const baseUrl = `file://${path.dirname(path.resolve(htmlPath))}/`;
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      baseURL: baseUrl
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Additional wait to ensure Tailwind CSS is fully applied
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify styles are loaded
    const stylesLoaded = await page.evaluate(() => {
      const styles = document.styleSheets;
      return styles.length > 0;
    });

    if (!stylesLoaded) {
      console.warn('[PDF Generator] Warning: No stylesheets detected');
    }

    console.log(`[PDF Generator] Fonts loaded, CSS applied, ready to generate PDF`);

    // Generate PDF with options
    const pdfOptions = {
      path: outputPath,
      format: options.format || 'A4',
      landscape: options.landscape || false,
      margin: MARGIN_PRESETS[options.margin || 'medium'],
      printBackground: true,
      preferCSSPageSize: false
    };

    await page.pdf(pdfOptions);

    console.log(`[PDF Generator] Successfully generated: ${outputPath}`);
    console.log(`[PDF Generator] Format: ${pdfOptions.format}, Margin: ${options.margin || 'medium'}`);

    return {
      success: true,
      path: outputPath,
      size: (await fs.stat(outputPath)).size
    };
  } catch (error) {
    console.error(`[PDF Generator] Error: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
  }
}

// CLI Entry Point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node generate_pdf.js <html_file> <output_pdf> [--format A4] [--margin medium] [--landscape]');
    process.exit(1);
  }

  const [htmlPath, outputPath] = args;
  const options = {};

  // Parse options
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--format' && args[i + 1]) {
      options.format = args[++i];
    } else if (args[i] === '--margin' && args[i + 1]) {
      options.margin = args[++i];
    } else if (args[i] === '--landscape') {
      options.landscape = true;
    }
  }

  generatePDF(htmlPath, outputPath, options)
    .then(result => {
      console.log('[PDF Generator] Complete:', JSON.stringify(result));
      process.exit(0);
    })
    .catch(error => {
      console.error('[PDF Generator] Failed:', error.message);
      process.exit(1);
    });
}

module.exports = { generatePDF };
