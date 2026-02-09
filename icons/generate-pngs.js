#!/usr/bin/env node

/**
 * Icon Generator Script
 * Generates PNG icons from SVG source for PWA manifest
 *
 * Requirements: None (uses Canvas API via node-canvas if available)
 * Fallback: Provides instructions for manual generation
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = __dirname;
const svgPath = path.join(iconsDir, 'icon.svg');

console.log('📋 Task Manager PWA - Icon Generator\n');

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
    console.error('❌ Error: icon.svg not found');
    process.exit(1);
}

console.log('Using SVG source:', svgPath);
console.log('\nTo generate PNG icons, use one of these methods:\n');

console.log('📌 Method 1: Online Tool (Easiest)');
console.log('   1. Visit: https://www.pwabuilder.com/imageGenerator');
console.log('   2. Upload icon.svg');
console.log('   3. Download generated icon pack');
console.log('   4. Extract to /icons directory\n');

console.log('📌 Method 2: ImageMagick (Command Line)');
console.log('   Install: brew install imagemagick (macOS)');
console.log('   Then run these commands:\n');
sizes.forEach(size => {
    console.log(`   convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png`);
});
console.log('');

console.log('📌 Method 3: Inkscape (GUI)');
console.log('   1. Open icon.svg in Inkscape');
console.log('   2. File → Export PNG Image');
console.log('   3. Set width/height for each size needed');
console.log('   4. Export each size\n');

console.log('📌 Method 4: Use generate-icons.html');
console.log('   1. Open icons/generate-icons.html in browser');
console.log('   2. Right-click each icon and save');
console.log('   3. Save to /icons directory\n');

// Try to use sharp or jimp if available
try {
    const sharp = require('sharp');
    console.log('✅ Found sharp package, generating icons...\n');

    const svg = fs.readFileSync(svgPath);

    Promise.all(
        sizes.map(size => {
            const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
            return sharp(svg)
                .resize(size, size)
                .png()
                .toFile(outputPath)
                .then(() => {
                    console.log(`✓ Generated icon-${size}x${size}.png`);
                    return outputPath;
                });
        })
    ).then(files => {
        console.log(`\n✅ Successfully generated ${files.length} icons!`);
    }).catch(err => {
        console.error('\n❌ Error generating icons:', err.message);
        console.log('\nPlease use one of the manual methods above.');
    });

} catch (e) {
    console.log('ℹ️  sharp package not found (optional)');
    console.log('   To auto-generate: npm install sharp\n');
    console.log('For now, use one of the manual methods above.\n');

    // Create placeholder README
    const readmePath = path.join(iconsDir, 'README.md');
    const readmeContent = `# App Icons

## Quick Start

The easiest way to generate icons is:

1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload \`icon.svg\`
3. Download the generated icon pack
4. Extract PNG files to this directory

## Required Icon Sizes

${sizes.map(size => `- icon-${size}x${size}.png`).join('\n')}

## Alternative Methods

### Using ImageMagick (macOS/Linux)
\`\`\`bash
# Install ImageMagick
brew install imagemagick  # macOS
# apt-get install imagemagick  # Linux

# Generate all sizes
${sizes.map(size => `convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png`).join('\n')}
\`\`\`

### Using Node.js
\`\`\`bash
npm install sharp
node generate-pngs.js
\`\`\`

### Using Browser
Open \`generate-icons.html\` in a browser and download each size.

## Current Status

- ✅ icon.svg (source)
- ✅ generate-icons.html (browser-based generator)
- ✅ generate-pngs.js (this script)
${sizes.map(size => `- ⏳ icon-${size}x${size}.png (pending)`).join('\n')}
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log('📝 Created icons/README.md with detailed instructions\n');
}
