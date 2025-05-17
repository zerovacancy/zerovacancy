#!/usr/bin/env node

/**
 * Automated CLS Testing Script
 * 
 * This script uses Puppeteer to automatically test CLS scores
 * across critical pages of the site, generating a report for
 * CI/CD pipelines.
 * 
 * Usage:
 *   node automated-cls-testing.js [--url=https://example.com] [--threshold=0.1] [--ci]
 * 
 * Options:
 *   --url        Base URL to test (default: http://localhost:3000)
 *   --threshold  CLS threshold to pass tests (default: 0.1)
 *   --ci         Run in CI mode with minimal output
 *   --debug      Enable debug mode with screenshots and trace
 *   --report     Generate HTML report (default: true)
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.split('=');
    acc[key.slice(2)] = value || true;
  }
  return acc;
}, {});

// Default options
const options = {
  url: args.url || 'http://localhost:3000',
  threshold: parseFloat(args.threshold || 0.1),
  ci: !!args.ci,
  debug: !!args.debug,
  report: args.report !== 'false'
};

// Critical pages to test
const pages = [
  { 
    path: '/', 
    name: 'Homepage',
    selectors: [
      '#hero', 
      '.rotating-text-container', 
      '.how-it-works-section',
      '.testimonials-section',
      '.features-section',
      '.footer'
    ],
    interactions: ['scrollTo', 'resize', 'wait']
  },
  { 
    path: '/search', 
    name: 'Creator Listings',
    selectors: [
      '.search-filters',
      '.creator-grid',
      '.desktop-creator-grid', // Added optimized grid component
      '.mobile-creator-carousel',
      '.search-header',
      '.results-container', // Added results container
      '.creators-list-container' // Added creator list container
    ],
    interactions: ['scrollTo', 'resize', 'click']
  },
  { 
    path: '/creator', 
    name: 'Creator Profile',
    selectors: [
      '.creator-info',
      '.portfolio-gallery', // Added portfolio gallery
      '.portfolio-gallery-container',
      '.portfolio-thumbnail-container',
      '.creator-media-container' // Added creator media container
    ],
    interactions: ['scrollTo', 'resize', 'click']
  },
  { 
    path: '/blog', 
    name: 'Blog',
    selectors: [
      '.blog-header',
      '.blog-post-grid',
      '.featured-blog-posts',
      '.blog-categories'
    ],
    interactions: ['scrollTo', 'resize']
  },
  {
    path: '/pricing',
    name: 'Pricing Page',
    selectors: [
      '.pricing-container',
      '.pricing-cards',
      '.pricing-toggle',
      '.pricing-features'
    ],
    interactions: ['scrollTo', 'resize', 'click']
  },
  {
    path: '/index',
    name: 'Index Page',
    selectors: [
      '.preview-search-section',
      '.featured-creators',
      '.cta-section'
    ],
    interactions: ['scrollTo', 'resize'] 
  }
];

// Device configurations
const devices = [
  // Desktop devices
  { name: 'Desktop-Large', width: 1920, height: 1080, mobile: false },
  { name: 'Desktop', width: 1280, height: 800, mobile: false },
  
  // Tablet devices
  { name: 'Tablet-Landscape', width: 1024, height: 768, mobile: true },
  { name: 'Tablet-Portrait', width: 768, height: 1024, mobile: true },
  
  // Mobile devices
  { name: 'Mobile-Large', width: 428, height: 926, mobile: true }, // iPhone 12 Pro Max
  { name: 'Mobile-Medium', width: 390, height: 844, mobile: true }, // iPhone 12 Pro
  { name: 'Mobile-Small', width: 375, height: 667, mobile: true }, // iPhone SE
  { name: 'Mobile-Tiny', width: 320, height: 568, mobile: true } // iPhone 5
];

// Results storage
const results = [];
const reportsDir = path.join(__dirname, '..', 'cls-reports');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Generate timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');

/**
 * Measure CLS for a specific page and device
 */
async function measureCLS(browser, pageUrl, pageConfig, device) {
  const page = await browser.newPage();
  const pageName = pageConfig.name;
  
  // Set viewport
  await page.setViewport({
    width: device.width,
    height: device.height,
    deviceScaleFactor: 1,
    isMobile: device.mobile,
    hasTouch: device.mobile
  });
  
  // Setup CLS tracking with enhanced component detection
  // First, get the component tracker code
  const componentTrackerPath = path.join(__dirname, 'component-cls-tracker.js');
  const componentTrackerCode = fs.readFileSync(componentTrackerPath, 'utf8');
  
  // Inject the tracker into the page
  await page.evaluateOnNewDocument(`
    // Initialize tracking variables
    window.layoutShiftScore = 0;
    window.componentSpecificShifts = {};
    
    // Function for component-specific tracking
    ${componentTrackerCode.replace('export default trackComponentShifts', '')}
    
    // Create PerformanceObserver to track CLS
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            // Track overall CLS
            window.layoutShiftScore += entry.value;
            
            // Use the enhanced component tracker
            trackComponentShifts(entry);
          }
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('PerformanceObserver not supported:', e);
    }
  `);
  
  // Start tracing if in debug mode
  if (options.debug) {
    await page.tracing.start({ 
      path: path.join(reportsDir, `trace-${pageName.toLowerCase()}-${device.name.toLowerCase()}.json`),
      categories: ['devtools.timeline']
    });
  }
  
  try {
    // Navigate to the page
    console.log(`Testing ${pageName} on ${device.name}...`);
    const response = await page.goto(pageUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    if (!response.ok() && !options.ci) {
      console.warn(`Warning: ${pageUrl} returned status ${response.status()}`);
    }
    
    // Wait for initial page load and layout stabilization
    await page.waitForTimeout(1500);
    
    // Take initial screenshot if in debug mode
    if (options.debug) {
      await page.screenshot({ 
        path: path.join(reportsDir, `screenshot-initial-${pageName.toLowerCase()}-${device.name.toLowerCase()}.png`),
        fullPage: true
      });
    }
    
    // Perform component-specific interactions if defined
    let componentResults = {};
    
    if (pageConfig.selectors) {
      for (const selector of pageConfig.selectors) {
        try {
          // Wait for the selector to appear
          await page.waitForSelector(selector, { timeout: 5000 });
          console.log(`  Testing component: ${selector}`);
          
          // Record CLS before interaction
          const preCLS = await page.evaluate(() => window.layoutShiftScore || 0);
          
          // Perform interactions if specified
          if (pageConfig.interactions) {
            for (const interaction of pageConfig.interactions) {
              if (interaction === 'scrollTo') {
                // Scroll to the element
                await page.evaluate((sel) => {
                  const element = document.querySelector(sel);
                  if (element) {
                    element.scrollIntoView({behavior: 'smooth'});
                  }
                }, selector);
                await page.waitForTimeout(500);
              } else if (interaction === 'resize') {
                // Test resize by changing viewport
                const originalWidth = page.viewport().width;
                await page.setViewport({
                  width: originalWidth - 50,
                  height: device.height,
                  deviceScaleFactor: 1,
                  isMobile: device.mobile
                });
                await page.waitForTimeout(500);
                await page.setViewport({
                  width: originalWidth,
                  height: device.height,
                  deviceScaleFactor: 1,
                  isMobile: device.mobile
                });
                await page.waitForTimeout(500);
              } else if (interaction === 'wait') {
                // Simply wait for any animations to complete
                await page.waitForTimeout(3000);
              }
            }
          }
          
          // Take post-interaction screenshot
          if (options.debug) {
            await page.screenshot({ 
              path: path.join(reportsDir, `screenshot-${selector.replace(/[^a-zA-Z0-9]/g, '-')}-${device.name.toLowerCase()}.png`),
              fullPage: false,
              clip: await page.evaluate((sel) => {
                const element = document.querySelector(sel);
                if (!element) return null;
                const { x, y, width, height } = element.getBoundingClientRect();
                return { x, y, width: Math.min(width, 1000), height: Math.min(height, 1000) };
              }, selector)
            });
          }
          
          // Get CLS after interaction
          const postCLS = await page.evaluate(() => window.layoutShiftScore || 0);
          const clsDuringInteraction = postCLS - preCLS;
          
          componentResults[selector] = {
            cls: clsDuringInteraction,
            passed: clsDuringInteraction <= (options.threshold / 2) // Stricter threshold for components
          };
          
          // Log component result
          const componentStatus = componentResults[selector].passed ? 'PASS' : 'FAIL';
          const componentStatusColor = componentResults[selector].passed ? '\x1b[32m' : '\x1b[31m';
          console.log(`  ${componentStatusColor}${componentStatus}\x1b[0m ${selector}: CLS = ${clsDuringInteraction.toFixed(4)}`);
        } catch (error) {
          console.error(`  Error testing component ${selector}:`, error.message);
          componentResults[selector] = {
            cls: null,
            passed: false,
            error: error.message
          };
        }
      }
    }
    
    // Scroll the page to trigger any lazy-loaded content
    await autoScroll(page);
    
    // Wait for any layout shifts to settle
    await page.waitForTimeout(1000);
    
    // Get the final CLS scores
    const { layoutShiftScore, componentSpecificShifts } = await page.evaluate(() => {
      return { 
        layoutShiftScore: window.layoutShiftScore || 0,
        componentSpecificShifts: window.componentSpecificShifts || {}
      };
    });
    
    // Take final screenshot
    if (options.debug) {
      await page.screenshot({ 
        path: path.join(reportsDir, `screenshot-final-${pageName.toLowerCase()}-${device.name.toLowerCase()}.png`),
        fullPage: true
      });
    }
    
    // Store the result with component-specific data
    const result = {
      page: pageName,
      device: device.name,
      cls: layoutShiftScore,
      url: pageUrl,
      passed: layoutShiftScore <= options.threshold,
      components: componentResults,
      componentShifts: componentSpecificShifts,
      timestamp: new Date().toISOString()
    };
    
    results.push(result);
    
    // Log the result
    const status = result.passed ? 'PASS' : 'FAIL';
    const statusColor = result.passed ? '\x1b[32m' : '\x1b[31m';
    console.log(`${statusColor}${status}\x1b[0m ${pageName} (${device.name}): CLS = ${layoutShiftScore.toFixed(4)}`);
    
    return result;
  } catch (error) {
    console.error(`Error testing ${pageName} on ${device.name}:`, error);
    
    // Store the error result
    results.push({
      page: pageName,
      device: device.name,
      cls: null,
      url: pageUrl,
      passed: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    return null;
  } finally {
    // Stop tracing if in debug mode
    if (options.debug) {
      await page.tracing.stop();
    }
    
    // Close the page
    await page.close();
  }
}

/**
 * Helper function to scroll the page
 */
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const scrollInterval = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        if (totalHeight >= scrollHeight || totalHeight > 10000) {
          clearInterval(scrollInterval);
          window.scrollTo(0, 0); // Scroll back to top
          setTimeout(resolve, 200);
        }
      }, 100);
    });
  });
}

/**
 * Generate HTML report
 */
function generateReport() {
  const reportPath = path.join(reportsDir, `cls-report-${timestamp}.html`);
  
  // Calculate statistics
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  const passRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(2) : 0;
  
  // Create HTML report
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CLS Test Report - ${timestamp}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3 {
      color: #6741d9;
    }
    .summary {
      display: flex;
      justify-content: space-between;
      background: #f7f7f7;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .summary-item {
      text-align: center;
    }
    .big-number {
      font-size: 32px;
      font-weight: bold;
    }
    .pass-rate {
      font-size: 48px;
      font-weight: bold;
      color: ${passRate >= 100 ? '#4caf50' : passRate >= 80 ? '#ff9800' : '#f44336'};
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
      font-weight: 600;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .pass {
      color: #4caf50;
      font-weight: bold;
    }
    .fail {
      color: #f44336;
      font-weight: bold;
    }
    .cls-value {
      font-family: monospace;
      font-size: 14px;
    }
    .threshold {
      display: inline-block;
      padding: 2px 6px;
      background: #e0e0e0;
      border-radius: 4px;
      font-size: 12px;
    }
    .timestamp {
      color: #666;
      font-size: 12px;
      margin-top: 30px;
    }
    .component-detail {
      margin-top: 10px;
      margin-bottom: 20px;
      background: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #6741d9;
    }
    .component-table {
      width: 100%;
      margin-top: 10px;
      font-size: 14px;
    }
    .component-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .component-score {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
    }
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border: 1px solid transparent;
      border-bottom: none;
      margin-right: 5px;
      border-radius: 4px 4px 0 0;
      background: #f2f2f2;
    }
    .tab.active {
      border-color: #ddd;
      background: white;
      font-weight: bold;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .chart-container {
      height: 300px;
      margin: 20px 0;
    }
    .meter {
      height: 20px;
      position: relative;
      background: #f3f3f3;
      border-radius: 10px;
      padding: 0;
      box-shadow: inset 0 1px 3px rgba(0,0,0,.2);
    }
    .meter > span {
      display: block;
      height: 100%;
      border-radius: 10px;
      position: relative;
      overflow: hidden;
      font-size: 12px;
      font-weight: bold;
      line-height: 20px;
      color: white;
      text-align: center;
    }
    .good { background-color: #4caf50; }
    .needs-improvement { background-color: #ff9800; }
    .poor { background-color: #f44336; }
  </style>
</head>
<body>
  <h1>CLS Test Report</h1>
  <p>Generated on ${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <div class="summary-item">
      <div class="big-number">${totalTests}</div>
      <div>Total Tests</div>
    </div>
    <div class="summary-item">
      <div class="big-number" style="color: #4caf50;">${passedTests}</div>
      <div>Passed</div>
    </div>
    <div class="summary-item">
      <div class="big-number" style="color: #f44336;">${failedTests}</div>
      <div>Failed</div>
    </div>
    <div class="summary-item">
      <div class="pass-rate">${passRate}%</div>
      <div>Pass Rate</div>
    </div>
  </div>
  
  <h2>Test Configuration</h2>
  <p>
    <strong>Base URL:</strong> ${options.url}<br>
    <strong>CLS Threshold:</strong> <span class="threshold">${options.threshold}</span><br>
    <strong>Devices Tested:</strong> ${devices.map(d => d.name).join(', ')}<br>
    <strong>Pages Tested:</strong> ${pages.map(p => p.name).join(', ')}
  </p>
  
  <div class="tabs">
    <div class="tab active" onclick="showTab('overview')">Overview</div>
    <div class="tab" onclick="showTab('components')">Component Analysis</div>
    <div class="tab" onclick="showTab('detailed')">Detailed Results</div>
  </div>
  
  <div id="overview" class="tab-content active">
    <h2>Overview Results</h2>
    <table>
      <thead>
        <tr>
          <th>Page</th>
          <th>Device</th>
          <th>CLS Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(result => `
          <tr>
            <td>${result.page}</td>
            <td>${result.device}</td>
            <td class="cls-value">${result.cls !== null ? result.cls.toFixed(4) : 'N/A'}</td>
            <td class="${result.passed ? 'pass' : 'fail'}">${result.passed ? 'PASS' : 'FAIL'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div id="components" class="tab-content">
    <h2>Component Analysis</h2>
    
    ${results.filter(r => r.components && Object.keys(r.components).length > 0).map(result => `
      <div class="component-detail">
        <h3>${result.page} - ${result.device}</h3>
        <p>Overall CLS: <span class="cls-value ${result.passed ? 'pass' : 'fail'}">${result.cls !== null ? result.cls.toFixed(4) : 'N/A'}</span></p>
        
        <h4>Component Breakdown</h4>
        <table class="component-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>CLS Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(result.components || {}).map(([selector, data]) => `
              <tr>
                <td>${selector}</td>
                <td class="cls-value">${data.cls !== null ? data.cls.toFixed(4) : 'N/A'}</td>
                <td class="${data.passed ? 'pass' : 'fail'}">${data.passed ? 'PASS' : 'FAIL'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        ${result.componentShifts && Object.keys(result.componentShifts).length > 0 ? `
          <h4>Component Shift Distribution</h4>
          ${Object.entries(result.componentShifts || {}).map(([component, value]) => {
            const percentage = result.cls > 0 ? (value / result.cls * 100).toFixed(1) : 0;
            const barClass = value <= 0.05 ? 'good' : value <= 0.15 ? 'needs-improvement' : 'poor';
            return `
              <div style="margin-bottom: 10px;">
                <div class="component-title">
                  <span>${component}</span>
                  <span class="component-score" style="background: ${barClass === 'good' ? '#e8f5e9' : barClass === 'needs-improvement' ? '#fff8e1' : '#ffebee'}; color: ${barClass === 'good' ? '#2e7d32' : barClass === 'needs-improvement' ? '#f57c00' : '#c62828'}">
                    CLS: ${value.toFixed(4)} (${percentage}%)
                  </span>
                </div>
                <div class="meter">
                  <span class="${barClass}" style="width: ${Math.min(percentage * 5, 100)}%">${percentage}%</span>
                </div>
              </div>
            `;
          }).join('')}
        ` : ''}
      </div>
    `).join('')}
    
    ${results.filter(r => r.components && Object.keys(r.components).length > 0).length === 0 ? 
      '<p>No component-specific analysis available.</p>' : ''}
  </div>
  
  <div id="detailed" class="tab-content">
    <h2>Detailed Results</h2>
    <table>
      <thead>
        <tr>
          <th>Page</th>
          <th>Device</th>
          <th>CLS Score</th>
          <th>Status</th>
          <th>URL</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(result => `
          <tr>
            <td>${result.page}</td>
            <td>${result.device}</td>
            <td class="cls-value">${result.cls !== null ? result.cls.toFixed(4) : 'N/A'}</td>
            <td class="${result.passed ? 'pass' : 'fail'}">${result.passed ? 'PASS' : 'FAIL'}</td>
            <td>${result.url}</td>
            <td>${new Date(result.timestamp).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="timestamp">
    Report ID: ${timestamp}
  </div>
  
  <script>
    function showTab(tabId) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Deactivate all tab buttons
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show the selected tab
      document.getElementById(tabId).classList.add('active');
      
      // Activate the clicked tab button
      document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
    }
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(reportPath, html);
  console.log(`\nHTML report generated: ${reportPath}`);
  
  // Also save JSON results
  const jsonPath = path.join(reportsDir, `cls-results-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify({
    timestamp,
    options,
    summary: {
      totalTests,
      passedTests,
      failedTests,
      passRate
    },
    results
  }, null, 2));
  
  return {
    reportPath,
    jsonPath,
    summary: {
      totalTests,
      passedTests,
      failedTests,
      passRate
    }
  };
}

/**
 * Main function
 */
async function runTests() {
  console.log(`\n=== CLS Testing - ${timestamp} ===`);
  console.log(`Base URL: ${options.url}`);
  console.log(`Threshold: ${options.threshold}`);
  console.log(`Mode: ${options.ci ? 'CI' : 'Development'}${options.debug ? ' (Debug)' : ''}`);
  console.log('================================\n');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars'],
    defaultViewport: null
  });
  
  try {
    // Run tests
    for (const pageConfig of pages) {
      const pageUrl = `${options.url}${pageConfig.path}`;
      
      for (const device of devices) {
        await measureCLS(browser, pageUrl, pageConfig, device);
      }
    }
  } finally {
    await browser.close();
  }
  
  // Generate report if enabled
  let reportInfo = null;
  if (options.report) {
    reportInfo = generateReport();
  }
  
  // Calculate final status
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const allPassed = passedTests === totalTests;
  
  // Print summary
  console.log('\n=== Summary ===');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Pass Rate: ${totalTests > 0 ? (passedTests / totalTests * 100).toFixed(2) : 0}%`);
  
  // Exit with appropriate code for CI integration
  if (options.ci) {
    process.exit(allPassed ? 0 : 1);
  }
  
  return { results, reportInfo };
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});