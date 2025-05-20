#!/bin/bash
# Script to help identify potentially unused assets in the codebase

echo "🔍 Checking for potentially unused assets..."

# Directory containing assets to check
ASSETS_DIR="public"
# Output file for results
OUTPUT_FILE="unused-assets-report.txt"

# Create or clear the output file
echo "Unused Assets Report - $(date)" > $OUTPUT_FILE
echo "=================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Get all image files
find $ASSETS_DIR -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.svg" -o -name "*.gif" \) | sort > /tmp/all_assets.txt

# For each asset, search for it in the codebase
while IFS= read -r asset; do
  # Get just the filename without the path
  filename=$(basename "$asset")
  # Also get the path without the public prefix for component references
  relativepath=${asset#"$ASSETS_DIR/"}
  
  # Skip archived assets as they're intentionally unused
  if [[ $asset == *"archived-assets"* ]]; then
    continue
  fi
  
  # Search for the filename or relative path in the codebase
  # Look in src, public, and index.html files
  grep_result=$(grep -r --include="*.{tsx,jsx,ts,js,html,css,md}" -l "$filename\|$relativepath\|/${filename}\|/${relativepath}" . 2>/dev/null)
  
  # If no results, check for references to the asset in preload or index files
  if [ -z "$grep_result" ]; then
    preload_result=$(grep -r --include="*.{tsx,jsx,ts,js,html}" -l "preload.*$filename\|preload.*$relativepath" . 2>/dev/null)
    
    if [ -z "$preload_result" ]; then
      # No references found - this might be an unused asset
      size=$(du -h "$asset" | cut -f1)
      echo "⚠️ Potentially unused: $asset ($size)" >> $OUTPUT_FILE
    else
      # Found in preload but not used in components - suspicious
      echo "⚠️ Only in preload: $asset" >> $OUTPUT_FILE
      echo "  Referenced in:" >> $OUTPUT_FILE
      echo "$preload_result" | sed 's/^/    - /' >> $OUTPUT_FILE
      echo "" >> $OUTPUT_FILE
    fi
  fi
done < /tmp/all_assets.txt

# Clean up
rm /tmp/all_assets.txt

echo "✅ Check complete. Results in $OUTPUT_FILE"
echo "NOTE: This is just a heuristic check. Please verify manually before deleting any assets."

# Make the script executable
chmod +x find-unused-assets.sh