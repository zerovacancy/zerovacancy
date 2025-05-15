/**
 * CLS Linting Script
 * Identifies common patterns that cause CLS issues in the codebase
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// Patterns that often cause CLS issues
const problematicPatterns = [
  { 
    regex: /position:\s*fixed;\s*(?!.*(?:top|bottom):\s*0)/g, 
    description: 'Fixed position without top/bottom:0 can cause CLS during viewport changes'
  },
  { 
    regex: /position:\s*fixed;\s*bottom:\s*(?!0)/g, 
    description: 'Fixed position with non-zero bottom value can cause CLS with mobile keyboards'
  },
  { 
    regex: /height:\s*\d+vh/g, 
    description: 'Using vh units directly without stable viewport hooks can cause CLS on mobile'
  },
  { 
    regex: /transform:\s*translateY/g, 
    description: 'TranslateY during animations may cause layout shifts, use transform with opacity instead'
  },
  { 
    regex: /<img[^>]*(?!.*width=)[^>]*>/g, 
    description: 'Images without explicit width/height attributes can cause CLS'
  },
  { 
    regex: /transition(?!.*:\s*(?:transform|opacity))/g, 
    description: 'Transitions on layout properties can cause CLS, use transform and opacity instead'
  },
  { 
    regex: /(?<!contain:)(?:\s|;)height:\s*auto/g, 
    description: 'Auto height without CSS containment can lead to unpredictable shifts'
  }
];

// Paths to check (excluding node_modules, build directories, etc.)
const filesToCheck = glob.sync('src/**/*.{tsx,jsx,ts,js,css,scss}', {
  ignore: ['**/node_modules/**', '**/build/**', '**/dist/**']
});

// Track results
const results = {
  totalIssues: 0,
  fileIssues: {},
  summary: {}
};

// Initialize summary counters for each pattern
problematicPatterns.forEach(pattern => {
  results.summary[pattern.description] = 0;
});

// Check files
filesToCheck.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let fileHasIssues = false;
  
  problematicPatterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches && matches.length > 0) {
      if (!results.fileIssues[file]) {
        results.fileIssues[file] = [];
      }
      
      results.fileIssues[file].push({
        pattern: pattern.description,
        count: matches.length
      });
      
      results.totalIssues += matches.length;
      results.summary[pattern.description] += matches.length;
      fileHasIssues = true;
    }
  });
});

// Generate report
console.log(chalk.bold.blue('📊 CLS Linting Report'));
console.log(chalk.blue('==================='));

if (results.totalIssues === 0) {
  console.log(chalk.green('✅ No CLS issues detected'));
} else {
  console.log(chalk.yellow(`⚠️ Found ${results.totalIssues} potential CLS issues`));
  
  // File-specific issues
  console.log(chalk.bold('\nIssues by file:'));
  Object.keys(results.fileIssues).forEach(file => {
    console.log(chalk.bold(`\n📁 ${file}`));
    results.fileIssues[file].forEach(issue => {
      console.log(`  - ${chalk.yellow(issue.pattern)} (${issue.count} occurrences)`);
    });
  });
  
  // Summary by pattern
  console.log(chalk.bold('\nSummary by issue type:'));
  Object.keys(results.summary).forEach(description => {
    if (results.summary[description] > 0) {
      console.log(`- ${chalk.yellow(description)}: ${results.summary[description]} occurrences`);
    }
  });
  
  // Write report to file
  const reportData = JSON.stringify(results, null, 2);
  fs.writeFileSync('cls-violations.json', reportData);
  
  console.log(chalk.bold('\nRecommendations:'));
  console.log('- Review the issues above and apply appropriate containment strategies');
  console.log('- Consider using useLayoutShiftPrevention() hook for dynamic content');
  console.log('- Replace vh units with useStableViewportHeight() hook');
  console.log('- Always specify width/height for images');
  console.log('- Use transform and opacity for animations instead of layout properties');
  
  process.exit(1); // Exit with error to fail CI if issues are found
}

process.exit(0);