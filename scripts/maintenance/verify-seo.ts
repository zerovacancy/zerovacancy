/**
 * SEO verification script
 * 
 * This script checks various SEO components of the website against best practices
 * Run with: ts-node verify-seo.ts
 */

import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// Define paths
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const ROBOTS_PATH = path.join(PUBLIC_DIR, 'robots.txt');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const HTML_PATHS = [
  path.join(PUBLIC_DIR, '../index.html'),
];

// Test results
interface TestResult {
  pass: boolean;
  message: string;
}

// Check categories
const categories = {
  technical: [] as TestResult[],
  onPage: [] as TestResult[],
  content: [] as TestResult[],
  mobile: [] as TestResult[],
  userExperience: [] as TestResult[],
  localSEO: [] as TestResult[],
  analytics: [] as TestResult[],
};

// Verify robots.txt
function checkRobotsTxt(): TestResult {
  try {
    const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf-8');
    
    // Basic checks
    const hasUserAgent = robotsContent.includes('User-agent:');
    const hasSitemap = robotsContent.includes('Sitemap:');
    const hasDisallow = robotsContent.includes('Disallow:');
    
    if (hasUserAgent && hasSitemap) {
      return {
        pass: true,
        message: 'robots.txt is properly configured with User-agent and Sitemap directives.',
      };
    } else {
      const missing = [];
      if (!hasUserAgent) missing.push('User-agent directive');
      if (!hasSitemap) missing.push('Sitemap directive');
      
      return {
        pass: false,
        message: `robots.txt is missing: ${missing.join(', ')}`,
      };
    }
  } catch (error) {
    return {
      pass: false,
      message: 'robots.txt file not found or cannot be read.',
    };
  }
}

// Verify sitemap.xml
function checkSitemapXml(): TestResult {
  try {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    
    // Basic format check
    const isValidXml = sitemapContent.includes('<?xml') && 
                       sitemapContent.includes('<urlset');
    
    // Count URLs
    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    
    if (isValidXml && urlCount > 0) {
      return {
        pass: true,
        message: `sitemap.xml is valid and contains ${urlCount} URLs.`,
      };
    } else {
      return {
        pass: false,
        message: 'sitemap.xml is not properly formatted or contains no URLs.',
      };
    }
  } catch (error) {
    return {
      pass: false,
      message: 'sitemap.xml file not found or cannot be read.',
    };
  }
}

// Check meta tags in HTML files
function checkMetaTags(htmlPath: string): TestResult[] {
  const results: TestResult[] = [];
  
  try {
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const $ = cheerio.load(htmlContent);
    
    // Check title
    const title = $('title').text();
    results.push({
      pass: !!title && title.length > 10 && title.length <= 60,
      message: `Title tag ${title ? 'exists' : 'is missing'} ${title ? `(${title.length} chars)` : ''}`,
    });
    
    // Check meta description
    const metaDescription = $('meta[name="description"]').attr('content');
    results.push({
      pass: !!metaDescription && metaDescription.length > 50 && metaDescription.length <= 160,
      message: `Meta description ${metaDescription ? 'exists' : 'is missing'} ${metaDescription ? `(${metaDescription.length} chars)` : ''}`,
    });
    
    // Check canonical
    const canonical = $('link[rel="canonical"]').attr('href');
    results.push({
      pass: !!canonical,
      message: `Canonical link ${canonical ? 'exists' : 'is missing'} ${canonical || ''}`,
    });
    
    // Check OG tags
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDescription = $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');
    
    results.push({
      pass: !!ogTitle && !!ogDescription && !!ogImage,
      message: `Open Graph tags ${ogTitle && ogDescription && ogImage ? 'are complete' : 'are missing elements'}`,
    });
    
    // Check Twitter Card
    const twitterCard = $('meta[name="twitter:card"]').attr('content');
    const twitterTitle = $('meta[name="twitter:title"]').attr('content');
    
    results.push({
      pass: !!twitterCard && !!twitterTitle,
      message: `Twitter Card tags ${twitterCard && twitterTitle ? 'are present' : 'are missing elements'}`,
    });
    
    // Check structured data
    const ldJson = $('script[type="application/ld+json"]');
    results.push({
      pass: ldJson.length > 0,
      message: `Structured data ${ldJson.length > 0 ? `found (${ldJson.length} instances)` : 'is missing'}`,
    });
    
    // Check viewport for mobile
    const viewport = $('meta[name="viewport"]').attr('content');
    results.push({
      pass: !!viewport && viewport.includes('width=device-width'),
      message: `Viewport meta tag ${viewport ? 'exists' : 'is missing'} for mobile optimization`,
    });
    
    return results;
  } catch (error) {
    return [{
      pass: false,
      message: `Could not read HTML file: ${htmlPath}`,
    }];
  }
}

// Run all checks
async function runSEOAudit() {
  console.log('🔍 Running SEO audit...\n');
  
  // Technical SEO checks
  console.log('Technical SEO:');
  const robotsResult = checkRobotsTxt();
  categories.technical.push(robotsResult);
  console.log(`  ${robotsResult.pass ? '✅' : '❌'} ${robotsResult.message}`);
  
  const sitemapResult = checkSitemapXml();
  categories.technical.push(sitemapResult);
  console.log(`  ${sitemapResult.pass ? '✅' : '❌'} ${sitemapResult.message}`);
  
  // On-page SEO checks for each HTML file
  console.log('\nOn-page SEO:');
  for (const htmlPath of HTML_PATHS) {
    console.log(`\n  Checking ${path.basename(htmlPath)}:`);
    const metaResults = checkMetaTags(htmlPath);
    
    for (const result of metaResults) {
      categories.onPage.push(result);
      console.log(`    ${result.pass ? '✅' : '❌'} ${result.message}`);
    }
  }
  
  // Generate summary
  console.log('\n📊 SEO Audit Summary:');
  
  let totalChecks = 0;
  let passedChecks = 0;
  
  for (const [category, results] of Object.entries(categories)) {
    if (results.length === 0) continue;
    
    const categoryTotal = results.length;
    const categoryPassed = results.filter(r => r.pass).length;
    
    totalChecks += categoryTotal;
    passedChecks += categoryPassed;
    
    const percentage = categoryTotal === 0 ? 0 : Math.round((categoryPassed / categoryTotal) * 100);
    console.log(`  ${category}: ${categoryPassed}/${categoryTotal} checks passed (${percentage}%)`);
  }
  
  const overallPercentage = totalChecks === 0 ? 0 : Math.round((passedChecks / totalChecks) * 100);
  console.log(`\nOverall: ${passedChecks}/${totalChecks} checks passed (${overallPercentage}%)`);
  
  if (overallPercentage < 80) {
    console.log('\n⚠️  Your SEO implementation needs improvement.');
  } else if (overallPercentage < 95) {
    console.log('\n👍 Your SEO implementation is good, but could be better.');
  } else {
    console.log('\n🎉 Excellent SEO implementation!');
  }
}

// Run the audit
runSEOAudit().catch(console.error);