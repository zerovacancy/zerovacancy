/**
 * Comprehensive Image Optimization Script
 * 
 * This script optimizes all images across the project, including:
 * - Large heroparallax images (archived but still taking space)
 * - Property transformation images
 * - Email assets and logos
 * - Favicon and app icons
 * - Any other unoptimized images
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const imageDirectories = [
  'public',                           // Process all of public
  'public/archived-assets',           // Including archived assets
  'public/property-transformations',  // Property images
  'public/brands',                    // Brand logos
  'email-preview'                     // Email assets
];

// Skip directories already handled by other optimization scripts
const skipDirectories = [
  'public/creatorcontent',  // Handled by optimize-creator-images.js
  'public/lovable-uploads'  // User uploads, handled separately
];

const formats = ['.jpg', '.jpeg', '.png', '.gif'];
const smallImagesThreshold = 50 * 1024; // 50KB

// Max dimensions for different image types
const sizeLimits = {
  heroparallax: { width: 1920, height: null }, // Full width for hero images
  property: { width: 1200, height: null },     // Property images
  favicon: { width: 192, height: 192 },        // Favicons (maintain exact dimensions)
  logo: { width: 400, height: null },          // Logos
  email: { width: 600, height: null },         // Email assets
  default: { width: 1200, height: null },      // Default size
};

// Quality settings
const webpOptions = { quality: 80 };
const avifOptions = { quality: 70 };
const pngOptions = { compressionLevel: 9, quality: 80 };
const jpegOptions = { quality: 85, progressive: true };

// Should we create multiple formats?
const createMultipleFormats = {
  favicon: true,  // Create multiple formats for favicons
  logo: true,     // Create multiple formats for logos
  default: false  // Don't create multiple formats by default
};

// Process a single image
async function optimizeImage(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);
  const fileSizeKB = stats.size / 1024;
  
  // We want to process all files, even "small" ones for this run
  // Debug log the file size
  console.log(`Processing file (${fileSizeKB.toFixed(2)}KB): ${filePath}`);
  
  const dirName = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath).toLowerCase();
  
  // Skip if this is already an optimized WebP or AVIF file
  if (['.webp', '.avif'].includes(ext) && fileSizeKB < 200) {
    console.log(`Skipping already optimized file: ${filePath}`);
    return;
  }
  
  // Check if we should skip this directory
  for (const skipDir of skipDirectories) {
    if (dirName.includes(skipDir)) {
      console.log(`Skipping directory (handled by another script): ${filePath}`);
      return;
    }
  }
  
  // Determine image type based on directory and filename
  let imageType = 'default';
  if (dirName.includes('heroparallax')) imageType = 'heroparallax';
  else if (dirName.includes('property-transformations')) imageType = 'property';
  else if (filePath.includes('favicon') || baseName === 'favicon') imageType = 'favicon';
  else if (filePath.includes('logo') || baseName.includes('logo')) imageType = 'logo';
  else if (dirName.includes('email') || filePath.includes('email')) imageType = 'email';
  
  // Determine size limits based on image type
  const sizeLimit = sizeLimits[imageType] || sizeLimits.default;
  
  // Determine if we should create multiple formats
  const multipleFormats = createMultipleFormats[imageType] || createMultipleFormats.default;
  
  // Output paths
  const webpOutputPath = path.join(dirName, `${baseName}.webp`);
  const avifOutputPath = path.join(dirName, `${baseName}.avif`);
  let pngOutputPath = null;
  let jpegOutputPath = null;
  
  // For favicons, create multiple sizes
  if (imageType === 'favicon') {
    const iconSizes = [16, 32, 48, 96, 192, 512];
    
    for (const size of iconSizes) {
      if (size <= sizeLimit.width) {
        await generateFavicon(filePath, dirName, baseName, size);
      }
    }
    
    // Generate manifest-compatible icon set
    await generateWebAppIcons(filePath, dirName);
    
    return; // Skip regular processing for favicons
  }
  
  try {
    console.log(`Optimizing: ${filePath} (${fileSizeMB.toFixed(2)}MB) as ${imageType}`);
    
    // Create a sharp instance
    let sharpInstance = sharp(filePath);
    let metadata = await sharpInstance.metadata();
    
    // Resize if needed, maintaining aspect ratio
    if (sizeLimit.width || sizeLimit.height) {
      sharpInstance = sharpInstance.resize({
        width: sizeLimit.width,
        height: sizeLimit.height,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Always create WebP for best compression
    await sharpInstance
      .clone()
      .webp(webpOptions)
      .toFile(webpOutputPath);
    
    const webpStats = fs.statSync(webpOutputPath);
    const webpSizeKB = webpStats.size / 1024;
    
    console.log(`  ✓ Created: ${webpOutputPath} (${webpSizeKB.toFixed(2)}KB) - ${((1 - webpSizeKB / fileSizeKB) * 100).toFixed(0)}% smaller`);
    
    // Create AVIF for browsers that support it (even better compression)
    try {
      await sharpInstance
        .clone()
        .avif(avifOptions)
        .toFile(avifOutputPath);
      
      const avifStats = fs.statSync(avifOutputPath);
      const avifSizeKB = avifStats.size / 1024;
      
      console.log(`  ✓ Created: ${avifOutputPath} (${avifSizeKB.toFixed(2)}KB) - ${((1 - avifSizeKB / fileSizeKB) * 100).toFixed(0)}% smaller`);
    } catch (error) {
      console.error(`  ✗ Error creating AVIF version for ${filePath}:`, error.message);
    }
    
    // If we should create optimized versions of original format
    if (multipleFormats) {
      if (ext === '.png' || ext === '.gif') {
        pngOutputPath = path.join(dirName, `${baseName}.optimized.png`);
        await sharpInstance
          .clone()
          .png(pngOptions)
          .toFile(pngOutputPath);
        
        const pngStats = fs.statSync(pngOutputPath);
        const pngSizeKB = pngStats.size / 1024;
        
        if (pngSizeKB < fileSizeKB) {
          console.log(`  ✓ Created: ${pngOutputPath} (${pngSizeKB.toFixed(2)}KB) - ${((1 - pngSizeKB / fileSizeKB) * 100).toFixed(0)}% smaller`);
          
          // Rename to replace original if smaller
          fs.renameSync(pngOutputPath, filePath);
          console.log(`  ✓ Replaced original PNG with optimized version`);
        } else {
          console.log(`  ✗ Optimized PNG not smaller (${pngSizeKB.toFixed(2)}KB vs ${fileSizeKB.toFixed(2)}KB), keeping original`);
          fs.unlinkSync(pngOutputPath);
        }
      } else if (ext === '.jpg' || ext === '.jpeg') {
        jpegOutputPath = path.join(dirName, `${baseName}.optimized.jpg`);
        await sharpInstance
          .clone()
          .jpeg(jpegOptions)
          .toFile(jpegOutputPath);
        
        const jpegStats = fs.statSync(jpegOutputPath);
        const jpegSizeKB = jpegStats.size / 1024;
        
        if (jpegSizeKB < fileSizeKB) {
          console.log(`  ✓ Created: ${jpegOutputPath} (${jpegSizeKB.toFixed(2)}KB) - ${((1 - jpegSizeKB / fileSizeKB) * 100).toFixed(0)}% smaller`);
          
          // Rename to replace original if smaller
          fs.renameSync(jpegOutputPath, filePath);
          console.log(`  ✓ Replaced original JPEG with optimized version`);
        } else {
          console.log(`  ✗ Optimized JPEG not smaller (${jpegSizeKB.toFixed(2)}KB vs ${fileSizeKB.toFixed(2)}KB), keeping original`);
          fs.unlinkSync(jpegOutputPath);
        }
      }
    }
    
    return {
      original: filePath,
      optimized: webpOutputPath,
      originalSize: fileSizeMB,
      optimizedSize: webpSizeKB / 1024,
      savings: fileSizeMB - (webpSizeKB / 1024)
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error);
    return null;
  }
}

// Special handling for favicons to create multiple sizes
async function generateFavicon(filePath, dirName, baseName, size) {
  const outputPath = path.join(dirName, `favicon-${size}.png`);
  try {
    await sharp(filePath)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`  ✓ Created favicon: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error creating favicon size ${size}:`, error.message);
    return false;
  }
}

// Generate web app icons for manifest.json
async function generateWebAppIcons(filePath, dirName) {
  const sizes = [192, 512];
  const outputDir = path.join(dirName, 'icons');
  
  // Create icons directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const size of sizes) {
    try {
      const outputPath = path.join(outputDir, `icon-${size}.png`);
      await sharp(filePath)
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`  ✓ Created web app icon: ${outputPath}`);
      
      // Create WebP version
      const webpOutputPath = path.join(outputDir, `icon-${size}.webp`);
      await sharp(filePath)
        .resize(size, size)
        .webp({ quality: 90 })
        .toFile(webpOutputPath);
      
      console.log(`  ✓ Created web app icon: ${webpOutputPath}`);
    } catch (error) {
      console.error(`  ✗ Error creating web app icon size ${size}:`, error.message);
    }
  }
}

// Walk through directories and process images
async function processDirectories() {
  console.log('Starting comprehensive image optimization...');
  const results = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    totalOriginalMB: 0,
    totalOptimizedMB: 0,
    savings: []
  };
  
  // Helper function to walk directories recursively
  function getAllFiles(dir) {
    const files = [];
    
    function traverseDir(currentPath) {
      if (!fs.existsSync(currentPath)) {
        console.log(`Directory does not exist: ${currentPath}`);
        return;
      }
      
      const allItems = fs.readdirSync(currentPath);
      
      for (const item of allItems) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          traverseDir(itemPath);
        } else {
          files.push(itemPath);
        }
      }
    }
    
    traverseDir(dir);
    return files;
  }

  // Process all directories and collect all image files
  const allImages = [];
  for (const directory of imageDirectories) {
    const fullPath = path.resolve(__dirname, directory);
    try {
      console.log(`Scanning ${fullPath}...`);
      const files = getAllFiles(fullPath);
      
      for (const filePath of files) {
        // Check if it's an image we want to process
        const ext = path.extname(filePath).toLowerCase();
        if (!formats.includes(ext)) continue;
        
        allImages.push(filePath);
      }
    } catch (error) {
      console.error(`Error processing directory ${directory}:`, error);
    }
  }
  
  console.log(`Found ${allImages.length} images to process`);
  
  // Sort images by size so we process the largest first
  const sortedImages = allImages.sort((a, b) => {
    const statA = fs.statSync(a);
    const statB = fs.statSync(b);
    return statB.size - statA.size;
  });
  
  // Process the images
  for (const filePath of sortedImages) {
    results.processed++;
    
    const result = await optimizeImage(filePath);
    if (result) {
      results.succeeded++;
      results.totalOriginalMB += result.originalSize;
      results.totalOptimizedMB += result.optimizedSize;
      results.savings.push(result);
    } else {
      results.failed++;
    }
  }
  
  // Print summary
  console.log('\nOptimization summary:');
  console.log(`Processed: ${results.processed} images`);
  console.log(`Succeeded: ${results.succeeded} images`);
  console.log(`Failed: ${results.failed} images`);
  console.log(`Total original size: ${results.totalOriginalMB.toFixed(2)}MB`);
  console.log(`Total optimized size: ${results.totalOptimizedMB.toFixed(2)}MB`);
  console.log(`Total savings: ${(results.totalOriginalMB - results.totalOptimizedMB).toFixed(2)}MB (${((1 - results.totalOptimizedMB / results.totalOriginalMB) * 100).toFixed(0)}%)`);
  
  // List top 10 biggest savings
  if (results.savings.length > 0) {
    console.log('\nBiggest savings:');
    results.savings
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 10)
      .forEach((item, index) => {
        console.log(`${index + 1}. ${item.original} - saved ${item.savings.toFixed(2)}MB (${((1 - item.optimizedSize / item.originalSize) * 100).toFixed(0)}%)`);
      });
  }
}

// Run the optimization
processDirectories().catch(console.error);