#!/usr/bin/env node

/**
 * Test CLS Optimized Components
 * 
 * This script runs automated CLS tests for our optimized components
 * to verify the improvements we've made.
 * 
 * Usage:
 *   node test-cls-optimized.js
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Components with stricter thresholds for testing
const componentThresholds = {
  'hero': 0.05,                     // Stricter threshold for hero
  'rotating-text': 0.02,            // Very strict for rotating text
  'portfolio-gallery': 0.05,        // Portfolio gallery component
  'creator-media': 0.05,            // Creator media component
  'creators-list': 0.05,            // Creators list component
  'desktop-creator-grid': 0.05,     // Desktop creator grid
  'mobile-creator-carousel': 0.05,  // Mobile creator carousel
  'results-container': 0.05,        // Results container
  'default': 0.1                    // Default Web Vitals threshold
};

// Run the automated CLS testing script
async function runCLSTests() {
  console.log('🔍 Running CLS tests on optimized components...\n');
  
  // Create command to run the automated CLS testing script
  const args = [
    './scripts/automated-cls-testing.js',
    '--url=http://localhost:3000',  // Use local server
    '--threshold=0.1',              // Overall threshold
    '--debug=true',                 // Enable debug mode
    '--report=true'                 // Generate report
  ];
  
  return new Promise((resolve, reject) => {
    // Spawn the process
    const process = spawn('node', args, { stdio: 'inherit' });
    
    // Handle process events
    process.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ CLS tests completed successfully');
        resolve(true);
      } else {
        console.error(`\n❌ CLS tests failed with code ${code}`);
        resolve(false);
      }
    });
    
    process.on('error', (err) => {
      console.error('Error running CLS tests:', err);
      reject(err);
    });
  });
}

// Validate test results against component-specific thresholds
function validateResults(resultsPath) {
  try {
    // Read the latest results file
    const resultsFiles = fs.readdirSync('./cls-reports')
      .filter(file => file.startsWith('cls-results-') && file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (resultsFiles.length === 0) {
      console.error('No test results found');
      return false;
    }
    
    const latestResultsFile = path.join('./cls-reports', resultsFiles[0]);
    const results = JSON.parse(fs.readFileSync(latestResultsFile, 'utf8'));
    
    console.log(`\n📊 Analyzing results from ${latestResultsFile}...\n`);
    
    // Track optimized component performance
    let optimizedResults = [];
    
    // Check each test result
    for (const result of results.results) {
      // Check component-specific results
      if (result.components) {
        for (const [selector, data] of Object.entries(result.components)) {
          // Find matching component threshold
          let threshold = componentThresholds.default;
          for (const [component, value] of Object.entries(componentThresholds)) {
            if (selector.includes(component)) {
              threshold = value;
              break;
            }
          }
          
          // Determine if this is one of our optimized components
          const isOptimized = 
            selector.includes('portfolio-gallery') ||
            selector.includes('creator-media') ||
            selector.includes('creators-list') ||
            selector.includes('desktop-creator-grid') ||
            selector.includes('mobile-creator-carousel') ||
            selector.includes('results-container');
          
          if (isOptimized) {
            const pass = data.cls <= threshold;
            optimizedResults.push({
              page: result.page,
              device: result.device,
              component: selector,
              cls: data.cls,
              threshold,
              pass
            });
          }
        }
      }
    }
    
    // Output optimized component results
    console.log('Optimized Component Results:');
    console.log('----------------------------');
    
    let passCount = 0;
    for (const result of optimizedResults) {
      const status = result.pass ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} - ${result.page} (${result.device}) - ${result.component}: CLS ${result.cls?.toFixed(4) || 'N/A'} (threshold: ${result.threshold})`);
      
      if (result.pass) {
        passCount++;
      }
    }
    
    const passRate = optimizedResults.length > 0 
      ? (passCount / optimizedResults.length * 100).toFixed(2)
      : 0;
      
    console.log(`\nOptimized Components Pass Rate: ${passRate}% (${passCount}/${optimizedResults.length})`);
    
    return passCount === optimizedResults.length;
  } catch (error) {
    console.error('Error validating results:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Run tests
    const success = await runCLSTests();
    
    if (success) {
      // Validate results
      const valid = validateResults();
      
      if (valid) {
        console.log('\n🎉 All optimized components pass CLS thresholds!');
      } else {
        console.warn('\n⚠️ Some optimized components exceed CLS thresholds. Review the report for details.');
      }
    }
    
    console.log('\nTest complete. Review generated HTML report for details.');
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Run the tests
main();