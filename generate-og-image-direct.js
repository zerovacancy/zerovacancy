import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
    const htmlPath = path.resolve(__dirname, 'public', 'og-image-direct.html');
    
    // File URL format for loading local resources properly
    const htmlUrl = `file://${htmlPath}`;
    
    // Navigate to the local HTML file
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });
    
    // Wait for a moment to ensure everything is rendered
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take a screenshot
    await page.screenshot({
      path: path.resolve(__dirname, 'public', 'og-image.png'),
      type: 'png',
      omitBackground: false,
      fullPage: false
    });
    
    console.log('OG image generated successfully!');
  } catch (error) {
    console.error('Error generating OG image:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();