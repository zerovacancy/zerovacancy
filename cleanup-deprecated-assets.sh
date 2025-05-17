#!/bin/bash
# Script to clean up deprecated and unused assets

echo "🧹 Cleaning up deprecated and unused assets..."

# Create backup directory for safety
BACKUP_DIR="./backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📂 Created backup directory: $BACKUP_DIR"

# 1. Handle archived-assets directory
if [ -d "public/archived-assets" ]; then
  echo "📦 Backing up archived-assets directory..."
  cp -r public/archived-assets "$BACKUP_DIR/"
  
  echo "🗑️ Removing archived-assets directory..."
  rm -rf public/archived-assets
  echo "✅ Removed archived-assets directory"
else
  echo "ℹ️ No archived-assets directory found"
fi

# 2. Handle lovable-uploads (git shows deleted files)
if [ -d "public/lovable-uploads" ]; then
  echo "📦 Backing up lovable-uploads directory..."
  cp -r public/lovable-uploads "$BACKUP_DIR/"
  
  echo "🗑️ Removing lovable-uploads directory..."
  rm -rf public/lovable-uploads
  echo "✅ Removed lovable-uploads directory"
else
  echo "ℹ️ No lovable-uploads directory found"
fi

# 3. Handle deprecated components
if [ -d "src/components/deprecated" ]; then
  echo "📦 Backing up deprecated components..."
  cp -r src/components/deprecated "$BACKUP_DIR/deprecated-components"
  
  echo "🗑️ Removing deprecated components..."
  rm -rf src/components/deprecated
  echo "✅ Removed deprecated components"
else
  echo "ℹ️ No deprecated components directory found"
fi

# 4. Handle michaelprofile.mov (git shows deleted)
if [ -f "public/michaelprofile.mov" ]; then
  echo "📦 Backing up michaelprofile.mov..."
  cp public/michaelprofile.mov "$BACKUP_DIR/"
  
  echo "🗑️ Removing michaelprofile.mov..."
  rm -f public/michaelprofile.mov
  echo "✅ Removed michaelprofile.mov"
else
  echo "ℹ️ No michaelprofile.mov file found"
fi

# 5. Backup old optimized images that were replaced with WebP/AVIF
echo "📦 Backing up original images that now have optimized versions..."
mkdir -p "$BACKUP_DIR/optimized-originals"

# Check for WebP/AVIF versions and back up the originals
find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r original; do
  webp_version="${original%.*}.webp"
  avif_version="${original%.*}.avif"
  
  if [ -f "$webp_version" ] || [ -f "$avif_version" ]; then
    # Get relative path for organizing in backup
    rel_path=$(echo "$original" | sed "s|public/||")
    backup_path="$BACKUP_DIR/optimized-originals/$(dirname "$rel_path")"
    
    mkdir -p "$backup_path"
    cp "$original" "$backup_path/"
    echo "📄 Backed up $original (has optimized version)"
  fi
done

echo ""
echo "🎉 Cleanup complete!"
echo "📋 Summary:"
echo "- Backed up all removed files to: $BACKUP_DIR"
echo "- Removed deprecated and unused assets"
echo "- Original files that have optimized versions are backed up but kept in place"
echo ""
echo "Note: The backup directory contains all removed files for safety."
echo "You can manually delete this backup once you've verified everything works correctly."