import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// List of highest-priority large images to optimize
const imagesToOptimize = [
  'public/creatorcontent/michael-brown/work-3.jpg',
  'public/og-image-new.png',
  'public/creatorcontent/emily-johnson/work-2.jpg',
  'public/creatorcontent/michael-brown/work-1.jpg',
  'public/creatorcontent/jane-cooper/work-3.jpg',
  'public/heroparallax/heroparallax2.jpg',
  'public/heroparallax/heroparallax6.jpg'
];

// Function to optimize a single image
async function optimizeImage(inputPath, options = {}) {
  const ext = path.extname(inputPath).toLowerCase();
  const filename = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);
  const outputPath = path.join(dir, `${filename}.webp`);
  
  console.log(`Optimizing: ${inputPath} → ${outputPath}`);
  
  try {
    const originalSize = fs.statSync(inputPath).size / (1024 * 1024);
    
    // Default settings for optimization
    const settings = {
      width: 1200,
      quality: 80,
      ...options
    };
    
    // Process the image
    await sharp(inputPath)
      .resize({ 
        width: settings.width, 
        height: null, 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: settings.quality })
      .toFile(outputPath);
    
    const newSize = fs.statSync(outputPath).size / (1024 * 1024);
    const savings = originalSize - newSize;
    const savingsPercent = (savings / originalSize) * 100;
    
    console.log(`  ✓ Original: ${originalSize.toFixed(2)} MB`);
    console.log(`  ✓ Optimized: ${newSize.toFixed(2)} MB`);
    console.log(`  ✓ Saved: ${savings.toFixed(2)} MB (${savingsPercent.toFixed(0)}%)`);
    
    return {
      originalPath: inputPath,
      outputPath,
      originalSize,
      newSize,
      savings
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${inputPath}:`, error);
    return null;
  }
}

// Main function to process all images
async function run() {
  console.log('Starting quick image optimization...\n');
  
  const results = [];
  
  for (const imagePath of imagesToOptimize) {
    // Skip if webp already exists
    const ext = path.extname(imagePath);
    const webpPath = imagePath.replace(ext, '.webp');
    
    if (fs.existsSync(webpPath)) {
      console.log(`Skipping ${imagePath} - WebP version already exists`);
      continue;
    }
    
    // Customize settings based on image type
    let settings = { width: 1200, quality: 80 };
    
    if (imagePath.includes('heroparallax')) {
      settings = { width: 1920, quality: 80 };
    } else if (imagePath.includes('creatorcontent')) {
      settings = { width: 800, quality: 80 };
    }
    
    const result = await optimizeImage(imagePath, settings);
    if (result) {
      results.push(result);
    }
  }
  
  // Print summary
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSavings = totalOriginal - totalNew;
  const totalSavingsPercent = (totalSavings / totalOriginal) * 100;
  
  console.log('\nOptimization Summary:');
  console.log(`Images processed: ${results.length}/${imagesToOptimize.length}`);
  console.log(`Total original size: ${totalOriginal.toFixed(2)} MB`);
  console.log(`Total optimized size: ${totalNew.toFixed(2)} MB`);
  console.log(`Total savings: ${totalSavings.toFixed(2)} MB (${totalSavingsPercent.toFixed(0)}%)`);
}

run().catch(console.error);