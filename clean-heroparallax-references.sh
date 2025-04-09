#!/bin/bash

# Script to clean up any heroparallax references and ensure they're properly archived
# This helps prevent the FOUC issue where old heroparallax images flash during page load

echo "🧹 Cleaning up heroparallax references..."

# 1. Ensure original heroparallax directory is removed from public
if [ -d "./public/heroparallax" ]; then
  echo "📁 Removing empty heroparallax directory from public..."
  rm -rf ./public/heroparallax
fi

# 2. Verify archived-assets directory exists
if [ ! -d "./public/archived-assets" ]; then
  echo "📁 Creating archived-assets directory..."
  mkdir -p ./public/archived-assets
fi

# 3. Ensure heroparallax images are in the archived-assets directory
if [ ! -d "./public/archived-assets/heroparallax" ]; then
  echo "📁 Creating archived-assets/heroparallax directory..."
  mkdir -p ./public/archived-assets/heroparallax
fi

# 4. Check if any heroparallax images remain in the main public directory
STRAY_IMAGES=$(find ./public -name "heroparallax*" -not -path "*archived-assets*" -type f | wc -l)
if [ "$STRAY_IMAGES" -gt 0 ]; then
  echo "🚨 Found $STRAY_IMAGES stray heroparallax images outside archived-assets. Moving them..."
  
  # Create archived directory if it doesn't exist
  mkdir -p ./public/archived-assets/heroparallax
  
  # Move stray images
  find ./public -name "heroparallax*" -not -path "*archived-assets*" -type f -exec mv {} ./public/archived-assets/heroparallax/ \;
fi

# 5. Add a .gitkeep file to maintain empty directories
touch ./public/archived-assets/heroparallax/.gitkeep

# 6. Add a README file in the archived directory
cat > ./public/archived-assets/heroparallax/README.md << 'EOF'
# Archived Heroparallax Images

These images were used in a previous version of the site but have been archived to prevent:

1. Flash of Unstyled Content (FOUC) issues on page load
2. Unnecessary bandwidth usage for assets no longer in use
3. Inclusion in production builds

## Important Notes

- DO NOT move these files back to the main public directory
- DO NOT reference these images in any component or CSS
- These files are excluded from production builds via the vite-exclude-archived-plugin.js

If you need to restore these images for any reason, please update the FOUCPrevention component
to prevent them from causing visual issues during page load.
EOF

echo "✅ Heroparallax cleanup complete!"
echo "📝 Note: These images are now properly archived and will be excluded from production builds."