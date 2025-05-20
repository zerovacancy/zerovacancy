/**
 * Script to generate a dynamic sitemap.xml file with all blog posts and pages
 * 
 * Run with: ts-node generate-sitemap.ts
 */

import { writeFileSync } from 'fs';
import path from 'path';
import { generateDynamicSitemap } from '../src/utils/seo-utils';

const BASE_URL = 'https://www.zerovacancy.ai';
const OUTPUT_PATH = path.resolve(__dirname, '../public/sitemap.xml');

/**
 * Generate the sitemap file
 */
async function run() {
  console.log('Generating sitemap.xml...');
  
  try {
    // Generate the sitemap using the utility function
    await generateDynamicSitemap(BASE_URL, OUTPUT_PATH);
    
    console.log(`✅ Sitemap successfully written to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
run();