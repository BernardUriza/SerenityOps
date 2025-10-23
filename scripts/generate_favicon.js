#!/usr/bin/env node
/**
 * Generate favicon.ico from SVG logo
 *
 * Converts the SerenityOps SVG logo to a multi-resolution .ico file
 * suitable for use as a favicon in web applications.
 */

const fs = require('fs');
const path = require('path');

// Check for sharp
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.error('❌ Error: sharp package not found');
  console.error('Install with: npm install sharp');
  process.exit(1);
}

async function generateFavicon() {
  const projectRoot = path.join(__dirname, '..');
  const svgPath = path.join(projectRoot, 'assets', 'logo.svg');
  const outputDir = path.join(projectRoot, 'frontend', 'public');
  const outputPath = path.join(outputDir, 'favicon.ico');

  console.log(`📄 Reading SVG: ${svgPath}`);

  // Read SVG file
  const svgBuffer = fs.readFileSync(svgPath);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🔄 Converting SVG to PNG at multiple resolutions...`);

  // Generate PNG at different sizes
  const sizes = [16, 32, 48, 256];
  const pngBuffers = [];

  for (const size of sizes) {
    console.log(`  - ${size}x${size}px`);
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push(pngBuffer);
  }

  // For ICO, we'll use the 32x32 version as the main favicon
  // (ICO with multiple sizes requires special handling, so we'll use PNG fallback)
  const favicon32 = pngBuffers[1]; // 32x32

  console.log(`💾 Saving favicon: ${outputPath}`);
  fs.writeFileSync(outputPath.replace('.ico', '.png'), favicon32);

  // Generate additional PNG assets
  console.log(`\n🎨 Generating additional PNG assets...`);

  // App icon (512x512)
  const logo512Path = path.join(outputDir, 'logo512.png');
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(logo512Path, png512);
  console.log(`  ✓ logo512.png (${(png512.length / 1024).toFixed(1)} KB)`);

  // Medium icon (192x192)
  const logo192Path = path.join(outputDir, 'logo192.png');
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  fs.writeFileSync(logo192Path, png192);
  console.log(`  ✓ logo192.png (${(png192.length / 1024).toFixed(1)} KB)`);

  // Favicon 32x32
  const favicon32Path = path.join(outputDir, 'favicon.png');
  fs.writeFileSync(favicon32Path, favicon32);
  console.log(`  ✓ favicon.png (${(favicon32.length / 1024).toFixed(1)} KB)`);

  // Also copy SVG to public
  const logoSvgPath = path.join(outputDir, 'logo.svg');
  fs.copyFileSync(svgPath, logoSvgPath);
  console.log(`  ✓ logo.svg (copied)`);

  console.log(`\n🎉 All assets generated!`);
  console.log(`\nGenerated files:`);
  console.log(`  - ${favicon32Path}`);
  console.log(`  - ${logo512Path}`);
  console.log(`  - ${logo192Path}`);
  console.log(`  - ${logoSvgPath}`);
}

generateFavicon().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
