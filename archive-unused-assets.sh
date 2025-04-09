#!/bin/bash
# Script to move unused assets to archived directory

echo "🗄️ Moving unused assets to archived directory..."

# Create archived directories if they don't exist
mkdir -p public/archived-assets/creatorcontent/emily-johnson
mkdir -p public/archived-assets/creatorcontent/jane-cooper
mkdir -p public/archived-assets/creatorcontent/michael-brown
mkdir -p public/archived-assets/media

# Move unused creator content
echo "Moving emily-johnson unused assets..."
mv public/creatorcontent/emily-johnson/work-2.jpg public/archived-assets/creatorcontent/emily-johnson/ 2>/dev/null || echo "Already moved"
mv public/creatorcontent/emily-johnson/work-3.jpg public/archived-assets/creatorcontent/emily-johnson/ 2>/dev/null || echo "Already moved"

echo "Moving jane-cooper unused assets..."
mv public/creatorcontent/jane-cooper/work-1.jpg public/archived-assets/creatorcontent/jane-cooper/ 2>/dev/null || echo "Already moved"
mv public/creatorcontent/jane-cooper/work-2.jpg public/archived-assets/creatorcontent/jane-cooper/ 2>/dev/null || echo "Already moved"
mv public/creatorcontent/jane-cooper/work-3.jpg public/archived-assets/creatorcontent/jane-cooper/ 2>/dev/null || echo "Already moved"

echo "Moving michael-brown unused assets..."
mv public/creatorcontent/michael-brown/work-1.jpg public/archived-assets/creatorcontent/michael-brown/ 2>/dev/null || echo "Already moved"
mv public/creatorcontent/michael-brown/work-2.jpg public/archived-assets/creatorcontent/michael-brown/ 2>/dev/null || echo "Already moved"
mv public/creatorcontent/michael-brown/work-3.jpg public/archived-assets/creatorcontent/michael-brown/ 2>/dev/null || echo "Already moved"

# Move large video file
echo "Moving video files..."
mv public/michaelprofile.mov public/archived-assets/media/ 2>/dev/null || echo "Already moved"

echo "✅ Asset archival complete!"

# Update to vite.config.ts needed:
echo ""
echo "⚠️ IMPORTANT: Update your vite.config.ts to exclude archived assets from build"
echo "Add the following to your vite.config.ts build configuration:"
echo ""
echo "build: {"
echo "  // ... other config"
echo "  rollupOptions: {"
echo "    // ... other options"
echo "    output: {"
echo "      // ... other output options"
echo "    },"
echo "  },"
echo "  // Custom plugin to exclude archived assets from build"
echo "  plugins: ["
echo "    {  "
echo "      name: 'exclude-archived-assets',"
echo "      enforce: 'post',"
echo "      apply: 'build',"
echo "      generateBundle(outputOptions, bundle) {"
echo "        Object.keys(bundle).forEach(key => {"
echo "          if (key.includes('archived-assets/')) {"
echo "            delete bundle[key];"
echo "          }"
echo "        });"
echo "      }"
echo "    }"
echo "  ]"
echo "}"