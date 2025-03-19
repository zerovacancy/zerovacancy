import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const imageDirectories = [
  'public/creatorcontent',
  'public/heroparallax',
  'public/property-transformations',
];
const formats = ['.jpg', '.jpeg', '.png', '.webp'];

// Max dimensions for different image types
const sizeLimits = {
  heroparallax: { width: 1920, height: null }, // Full width for hero images
  creatorcontent: { width: 800, height: null }, // Medium size for creator content
  default: { width: 1200, height: null }, // Default size
};

// Quality settings
const webpOptions = { quality: 80 };

// Process a single image
async function optimizeImage(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);
  
  // If file is smaller than 500KB, we can skip it
  if (fileSizeMB < 0.5) {
    console.log(`Skipping small file (${fileSizeMB.toFixed(2)}MB): ${filePath}`);
    return;
  }
  
  const dirName = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const outputPath = path.join(dirName, `${baseName}.webp`);
  
  // Determine size limits based on directory
  let sizeLimit = sizeLimits.default;
  for (const key in sizeLimits) {
    if (dirName.includes(key)) {
      sizeLimit = sizeLimits[key];
      break;
    }
  }
  
  try {
    console.log(`Optimizing: ${filePath} (${fileSizeMB.toFixed(2)}MB)`);
    
    // Create a sharp instance
    let sharpInstance = sharp(filePath);
    
    // Resize if needed, maintaining aspect ratio
    if (sizeLimit.width || sizeLimit.height) {
      sharpInstance = sharpInstance.resize({
        width: sizeLimit.width,
        height: sizeLimit.height,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to WebP with quality settings
    await sharpInstance
      .webp(webpOptions)
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newFileSizeMB = newStats.size / (1024 * 1024);
    
    console.log(`  ✓ Created: ${outputPath} (${newFileSizeMB.toFixed(2)}MB) - ${((1 - newFileSizeMB / fileSizeMB) * 100).toFixed(0)}% smaller`);
    
    return {
      original: filePath,
      optimized: outputPath,
      originalSize: fileSizeMB,
      optimizedSize: newFileSizeMB,
      savings: fileSizeMB - newFileSizeMB
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error);
    return null;
  }
}

// Walk through directories and process images
async function processDirectories() {
  console.log('Starting image optimization...');
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

  for (const directory of imageDirectories) {
    try {
      const files = getAllFiles(directory);
      
      for (const filePath of files) {
        // Check if it's an image we want to process
        const ext = path.extname(filePath).toLowerCase();
        if (!formats.includes(ext)) continue;
        
        // Skip already optimized webp files
        if (ext === '.webp') continue;
        
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
    } catch (error) {
      console.error(`Error processing directory ${directory}:`, error);
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
  
  // List top 5 biggest savings
  if (results.savings.length > 0) {
    console.log('\nBiggest savings:');
    results.savings
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 5)
      .forEach((item, index) => {
        console.log(`${index + 1}. ${item.original} - saved ${item.savings.toFixed(2)}MB (${((1 - item.optimizedSize / item.originalSize) * 100).toFixed(0)}%)`);
      });
  }
}

// Run the optimization
processDirectories().catch(console.error);