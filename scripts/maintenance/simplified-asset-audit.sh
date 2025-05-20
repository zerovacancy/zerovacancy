#!/bin/bash
# Simple script to identify potentially unused assets in the codebase

echo "🔍 Starting asset usage audit..."

# Output file for results
OUTPUT_FILE="simple-asset-audit.txt"

# Create or clear the output file
echo "Asset Usage Audit - $(date)" > $OUTPUT_FILE
echo "=======================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# First, let's check which files from heroparallax are still referenced
echo "## Checking heroparallax references" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

for file in public/archived-assets/heroparallax/*.{jpg,webp}; do
  basename=$(basename "$file")
  refs=$(grep -r "$basename" --include="*.{tsx,jsx,ts,js,html,css,md}" . | grep -v "archived-assets" | wc -l)
  
  if [ "$refs" -gt 0 ]; then
    echo "⚠️ Still referenced ($refs times): $basename" >> $OUTPUT_FILE
  else
    echo "✅ Not referenced: $basename" >> $OUTPUT_FILE
  fi
done

echo "" >> $OUTPUT_FILE
echo "## Large Media Files" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Find large files and check if they're referenced
find public -type f -size +1M | sort -n | while read -r file; do
  # Skip archived assets
  if [[ $file == *"archived-assets"* ]]; then
    continue
  fi
  
  basename=$(basename "$file")
  size_kb=$(du -k "$file" | cut -f1)
  size_mb=$(echo "scale=2; $size_kb/1024" | bc)
  
  refs=$(grep -r "$basename" --include="*.{tsx,jsx,ts,js,html,css,md}" . | grep -v "find-unused-assets.sh" | grep -v "$OUTPUT_FILE" | wc -l)
  
  if [ "$refs" -eq 0 ]; then
    echo "⚠️ Large unused file: $file (${size_mb}MB)" >> $OUTPUT_FILE
  else
    echo "✓ Large used file: $file (${size_mb}MB)" >> $OUTPUT_FILE
  fi
done

echo "" >> $OUTPUT_FILE
echo "## Preload-only References" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Check for files that are only referenced in preload
find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.svg" -o -name "*.gif" \) | while read -r file; do
  # Skip archived assets
  if [[ $file == *"archived-assets"* ]]; then
    continue
  fi
  
  basename=$(basename "$file")
  size_kb=$(du -k "$file" | cut -f1)
  
  normal_refs=$(grep -r "$basename" --include="*.{tsx,jsx,ts,js,html,css,md}" . | grep -v "preload" | grep -v "archived-assets" | grep -v "find-unused-assets.sh" | grep -v "$OUTPUT_FILE" | wc -l)
  preload_refs=$(grep -r "$basename" --include="*.{tsx,jsx,ts,js,html}" . | grep "preload" | grep -v "find-unused-assets.sh" | grep -v "$OUTPUT_FILE" | wc -l)
  
  if [ "$normal_refs" -eq 0 ] && [ "$preload_refs" -gt 0 ]; then
    echo "⚠️ Preload-only reference: $file (${size_kb}KB)" >> $OUTPUT_FILE
  fi
done

echo "" >> $OUTPUT_FILE
echo "## Checking vite.config.ts and build process" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

grep -A 20 "build.*options" vite.config.ts >> $OUTPUT_FILE 2>/dev/null || echo "No specific build options found" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "✅ Audit complete. Please review $OUTPUT_FILE for results."

# Make executable
chmod +x simplified-asset-audit.sh