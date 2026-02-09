# App Icons

## Quick Start

The easiest way to generate icons is:

1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload `icon.svg`
3. Download the generated icon pack
4. Extract PNG files to this directory

## Required Icon Sizes

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Alternative Methods

### Using ImageMagick (macOS/Linux)
```bash
# Install ImageMagick
brew install imagemagick  # macOS
# apt-get install imagemagick  # Linux

# Generate all sizes
convert icon.svg -resize 72x72 icon-72x72.png
convert icon.svg -resize 96x96 icon-96x96.png
convert icon.svg -resize 128x128 icon-128x128.png
convert icon.svg -resize 144x144 icon-144x144.png
convert icon.svg -resize 152x152 icon-152x152.png
convert icon.svg -resize 192x192 icon-192x192.png
convert icon.svg -resize 384x384 icon-384x384.png
convert icon.svg -resize 512x512 icon-512x512.png
```

### Using Node.js
```bash
npm install sharp
node generate-pngs.js
```

### Using Browser
Open `generate-icons.html` in a browser and download each size.

## Current Status

- ✅ icon.svg (source)
- ✅ generate-icons.html (browser-based generator)
- ✅ generate-pngs.js (this script)
- ⏳ icon-72x72.png (pending)
- ⏳ icon-96x96.png (pending)
- ⏳ icon-128x128.png (pending)
- ⏳ icon-144x144.png (pending)
- ⏳ icon-152x152.png (pending)
- ⏳ icon-192x192.png (pending)
- ⏳ icon-384x384.png (pending)
- ⏳ icon-512x512.png (pending)
