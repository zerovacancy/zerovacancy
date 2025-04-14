/**
 * Optimize Creator Content Images - Performance Improvement
 * 
 * This script specifically targets the large images in the creatorcontent directory
 * that are negatively impacting mobile performance.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = path.join(__dirname, 'public/creatorcontent');
const OUTPUT_DIR = path.join(__dirname, 'public/creatorcontent'); // Replace in place
const WEBP_QUALITY = 75; // Balance quality and size
const JPEG_QUALITY = 80;
const MAX_WIDTH = 1200; // Max width for any image
const MOBILE_WIDTH = 640; // Width for mobile-specific versions

// Size thresholds for optimization (in bytes)
const SIZE_THRESHOLD = 1 * 1024 * 1024; // 1MB

// Process all images in a directory recursively
async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip the 'optimized' directory if it exists
      if (entry.name !== 'optimized') {
        await processDirectory(fullPath);
      }
    } else if (isImageFile(entry.name)) {
      const stats = fs.statSync(fullPath);
      
      // Only process files larger than the threshold
      if (stats.size > SIZE_THRESHOLD) {
        await optimizeImage(fullPath);
      }
    }
  }
}

// Check if file is an image based on extension
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

// Optimize a single image
async function optimizeImage(imagePath) {
  try {
    console.log(`Processing ${imagePath}...`);
    const relativePath = path.relative(SOURCE_DIR, imagePath);
    const originalSize = fs.statSync(imagePath).size;
    const originalSizeInMB = (originalSize / 1024 / 1024).toFixed(2);
    const ext = path.extname(imagePath).toLowerCase();
    
    // Create the directory structure if it doesn't exist
    const outputDir = path.dirname(path.join(OUTPUT_DIR, relativePath));
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Always create a WebP version for modern browsers
    const webpOutputPath = path.join(outputDir, `${path.basename(imagePath, ext)}.webp`);
    
    // Set up Sharp pipeline
    let pipeline = sharp(imagePath)
      .resize({
        width: MAX_WIDTH,
        height: null,
        fit: 'inside',
        withoutEnlargement: true
      });
    
    // Generate WebP
    await pipeline
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpOutputPath);
    
    // Generate optimized JPEG (if original is JPEG or PNG)
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      // Use a temporary path to avoid "Cannot use same file for input and output" error
      const tempPath = path.join(outputDir, `temp_${path.basename(imagePath, ext)}.jpg`);
      await pipeline
        .jpeg({ quality: JPEG_QUALITY, progressive: true })
        .toFile(tempPath);
      
      // Optimized JPEG file size
      const jpegSize = fs.statSync(tempPath).size;
      const jpegSizeInMB = (jpegSize / 1024 / 1024).toFixed(2);
      console.log(`  JPEG: ${originalSizeInMB}MB → ${jpegSizeInMB}MB (${Math.round((1 - jpegSize/originalSize) * 100)}% reduction)`);
      
      // Replace original if optimized version is smaller
      if (jpegSize < originalSize && ext !== '.webp') {
        // First rename the original file as a backup
        const backupPath = imagePath + '.bak';
        fs.renameSync(imagePath, backupPath);
        
        // Then move the optimized file to the original path
        fs.renameSync(tempPath, imagePath);
        
        // Delete the backup
        fs.unlinkSync(backupPath);
        
        console.log(`  Replaced original with optimized JPEG`);
      } else {
        // If we didn't replace the original, delete the temp file
        fs.unlinkSync(tempPath);
      }
    }
    
    // WebP file size
    const webpSize = fs.statSync(webpOutputPath).size;
    const webpSizeInMB = (webpSize / 1024 / 1024).toFixed(2);
    console.log(`  WebP: ${originalSizeInMB}MB → ${webpSizeInMB}MB (${Math.round((1 - webpSize/originalSize) * 100)}% reduction)`);
    
    // Create mobile versions (smaller size for bandwidth)
    await createMobileVersion(imagePath, ext);
    
    console.log(`  Completed processing ${path.basename(imagePath)}`);
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

// Create mobile-specific versions
async function createMobileVersion(imagePath, ext) {
  try {
    const relativePath = path.relative(SOURCE_DIR, imagePath);
    const dirName = path.dirname(relativePath);
    const baseName = path.basename(imagePath, ext);
    
    // Create mobile directory if it doesn't exist
    const mobileDirPath = path.join(OUTPUT_DIR, dirName, 'mobile');
    if (!fs.existsSync(mobileDirPath)) {
      fs.mkdirSync(mobileDirPath, { recursive: true });
    }
  
    // WebP for mobile
    const mobileWebpPath = path.join(mobileDirPath, `${baseName}.webp`);
    await sharp(imagePath)
      .resize({
        width: MOBILE_WIDTH,
        height: null,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: WEBP_QUALITY - 5 }) // Slightly lower quality for mobile
      .toFile(mobileWebpPath);
    
    // JPEG for mobile fallback
    const mobileJpegPath = path.join(mobileDirPath, `${baseName}.jpg`);
    await sharp(imagePath)
      .resize({
        width: MOBILE_WIDTH,
        height: null,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: JPEG_QUALITY - 5, progressive: true })
      .toFile(mobileJpegPath);
      
    console.log(`  Created mobile versions in ${mobileDirPath}`);
  } catch (error) {
    console.error(`  Error creating mobile version for ${imagePath}:`, error.message);
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  
  const startTime = Date.now();
  
  await processDirectory(SOURCE_DIR);
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log(`\nOptimization complete! Processed in ${duration.toFixed(2)} seconds`);
}

main().catch(error => {
  console.error('Error optimizing images:', error);
  process.exit(1);
});