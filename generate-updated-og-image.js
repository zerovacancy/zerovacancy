import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import sharp from 'sharp';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Create a new page
    const page = await browser.newPage();
    
    // Set viewport size to match OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2 // Higher resolution for better quality
    });
    
    // Get the absolute path to the HTML file
    const htmlPath = path.resolve(__dirname, 'public', 'og-image-new.html');
    
    // File URL format for loading local resources properly
    const htmlUrl = `file://${htmlPath}`;
    
    // Navigate to the local HTML file
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });
    
    // Wait for fonts and images to load using a slight delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Take a screenshot
    const pngOutputPath = path.resolve(__dirname, 'public', 'og-image-new.png');
    await page.screenshot({
      path: pngOutputPath,
      type: 'png',
      omitBackground: false,
      fullPage: false
    });
    
    console.log('PNG OG image generated successfully!');
    
    // Convert PNG to WebP with sharp
    const webpOutputPath = path.resolve(__dirname, 'public', 'og-image-new.webp');
    await sharp(pngOutputPath)
      .webp({ quality: 90 })
      .toFile(webpOutputPath);
    
    console.log('WebP OG image generated successfully!');
    
    // Create a smaller PNG for fallback
    const fallbackOutputPath = path.resolve(__dirname, 'public', 'og-image.png');
    await sharp(pngOutputPath)
      .resize(1200, 630, { fit: 'inside' })
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(fallbackOutputPath);
      
    console.log('Fallback PNG image generated successfully!');
    
  } catch (error) {
    console.error('Error generating OG image:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();