/**
 * CLS Report Comparison Script
 * Compares two CLS test reports and generates a comparison report
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Default report directory
const REPORTS_DIR = path.join(process.cwd(), 'cls-reports');

// Check for command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(chalk.red('Usage: node compare-cls-reports.js <baseline-report> <comparison-report> [output-format]'));
  console.error(chalk.yellow('Example: node compare-cls-reports.js baseline improvement html'));
  process.exit(1);
}

// Get report names from arguments
const baselineReportName = args[0];
const comparisonReportName = args[1];
const outputFormat = args[2] || 'all'; // Default to all formats

// Find the most recent report files matching the names
function findReportFile(reportName) {
  // If it's a full path, use it directly
  if (reportName.endsWith('.json')) {
    return reportName;
  }
  
  // Otherwise, look for the most recent file with this name prefix
  const files = fs.readdirSync(REPORTS_DIR)
    .filter(file => file.includes(reportName) && file.endsWith('.json'))
    .sort((a, b) => {
      const statsA = fs.statSync(path.join(REPORTS_DIR, a));
      const statsB = fs.statSync(path.join(REPORTS_DIR, b));
      return statsB.mtime.getTime() - statsA.mtime.getTime();
    });
  
  if (files.length === 0) {
    console.error(chalk.red(`No report files found matching "${reportName}"`));
    process.exit(1);
  }
  
  return path.join(REPORTS_DIR, files[0]);
}

// Find report files
const baselineReportPath = findReportFile(baselineReportName);
const comparisonReportPath = findReportFile(comparisonReportName);

console.log(chalk.blue(`Comparing CLS reports:`));
console.log(`  Baseline: ${baselineReportPath}`);
console.log(`  Comparison: ${comparisonReportPath}`);

// Load report data
let baselineData, comparisonData;
try {
  baselineData = JSON.parse(fs.readFileSync(baselineReportPath, 'utf8'));
  comparisonData = JSON.parse(fs.readFileSync(comparisonReportPath, 'utf8'));
} catch (error) {
  console.error(chalk.red(`Error loading report files: ${error.message}`));
  process.exit(1);
}

// Generate comparison data
function generateComparison() {
  const comparison = {
    summary: {
      baselineDate: baselineData.timestamp || 'unknown',
      comparisonDate: comparisonData.timestamp || 'unknown',
      baselineOverallCLS: baselineData.overall?.cls || 0,
      comparisonOverallCLS: comparisonData.overall?.cls || 0,
      improvement: 0,
      components: {},
      passRate: 0
    },
    components: []
  };
  
  // Calculate overall improvement percentage
  const baselineCLS = comparison.summary.baselineOverallCLS;
  const comparisonCLS = comparison.summary.comparisonOverallCLS;
  
  if (baselineCLS > 0) {
    comparison.summary.improvement = ((baselineCLS - comparisonCLS) / baselineCLS * 100).toFixed(2);
  }
  
  // Combine all component data
  const allComponentNames = new Set([
    ...Object.keys(baselineData.components || {}),
    ...Object.keys(comparisonData.components || {})
  ]);
  
  // Threshold for passing
  const CLS_THRESHOLD = 0.1;
  let passedComponents = 0;
  
  // Generate component-specific comparisons
  Array.from(allComponentNames).forEach(componentName => {
    const baselineComponent = baselineData.components?.[componentName] || { cls: 0 };
    const comparisonComponent = comparisonData.components?.[componentName] || { cls: 0 };
    
    const baselineCLS = baselineComponent.cls || 0;
    const comparisonCLS = comparisonComponent.cls || 0;
    
    let improvementPercent = 0;
    if (baselineCLS > 0) {
      improvementPercent = ((baselineCLS - comparisonCLS) / baselineCLS * 100).toFixed(2);
    }
    
    const passed = comparisonCLS <= CLS_THRESHOLD;
    if (passed) passedComponents++;
    
    comparison.components.push({
      name: componentName,
      baselineCLS: baselineCLS.toFixed(4),
      comparisonCLS: comparisonCLS.toFixed(4),
      improvement: improvementPercent,
      passed,
      status: passed ? 'PASS' : 'FAIL',
      thresholdExceeded: comparisonCLS > CLS_THRESHOLD,
      regressionDetected: comparisonCLS > baselineCLS
    });
  });
  
  // Calculate pass rate
  comparison.summary.passRate = (passedComponents / allComponentNames.size * 100).toFixed(2);
  
  // Sort components by improvement (descending)
  comparison.components.sort((a, b) => parseFloat(b.improvement) - parseFloat(a.improvement));
  
  return comparison;
}

// Generate console report
function generateConsoleReport(comparison) {
  console.log('\n' + chalk.bold.blue('CLS Comparison Summary'));
  console.log('=======================');
  console.log(`Baseline Date: ${comparison.summary.baselineDate}`);
  console.log(`Comparison Date: ${comparison.summary.comparisonDate}`);
  console.log(`Baseline Overall CLS: ${chalk.yellow(comparison.summary.baselineOverallCLS.toFixed(4))}`);
  console.log(`Comparison Overall CLS: ${formatCLS(comparison.summary.comparisonOverallCLS)}`);
  console.log(`Overall Improvement: ${formatImprovement(comparison.summary.improvement)}%`);
  console.log(`Pass Rate: ${comparison.summary.passRate}% (CLS ≤ 0.1)`);
  
  console.log('\n' + chalk.bold('Component Breakdown'));
  console.log('--------------------');
  
  // Table headers
  console.log(
    chalk.bold('Component'.padEnd(30)) + 
    chalk.bold('Before'.padEnd(10)) + 
    chalk.bold('After'.padEnd(10)) + 
    chalk.bold('Improvement'.padEnd(15)) + 
    chalk.bold('Status')
  );
  
  // Table rows
  comparison.components.forEach(component => {
    console.log(
      component.name.padEnd(30) + 
      component.baselineCLS.padEnd(10) + 
      formatCLS(component.comparisonCLS, false).padEnd(10) + 
      formatImprovement(component.improvement).padEnd(15) + 
      formatStatus(component.status)
    );
  });
  
  // Problem areas
  const regressions = comparison.components.filter(c => c.regressionDetected);
  const failures = comparison.components.filter(c => c.thresholdExceeded);
  
  if (regressions.length > 0) {
    console.log('\n' + chalk.bold.yellow('⚠️ Regressions Detected'));
    regressions.forEach(component => {
      console.log(`- ${component.name}: ${component.baselineCLS} → ${component.comparisonCLS}`);
    });
  }
  
  if (failures.length > 0) {
    console.log('\n' + chalk.bold.yellow('❌ Components Exceeding Threshold (0.1)'));
    failures.forEach(component => {
      console.log(`- ${component.name}: ${component.comparisonCLS}`);
    });
  }
  
  // Recommendations
  console.log('\n' + chalk.bold('Recommendations'));
  if (failures.length > 0) {
    console.log(chalk.yellow('→ Focus on fixing the following components:'));
    failures
      .sort((a, b) => parseFloat(b.comparisonCLS) - parseFloat(a.comparisonCLS))
      .slice(0, 3)
      .forEach(component => {
        console.log(`   - ${component.name} (CLS: ${component.comparisonCLS})`);
      });
  } else if (regressions.length > 0) {
    console.log(chalk.yellow('→ Investigate regressions in the following components:'));
    regressions
      .sort((a, b) => parseFloat(b.comparisonCLS) - parseFloat(a.comparisonCLS))
      .slice(0, 3)
      .forEach(component => {
        console.log(`   - ${component.name} (CLS: ${component.comparisonCLS})`);
      });
  } else {
    console.log(chalk.green('✅ All components are below the CLS threshold'));
    console.log(chalk.green('→ Continue monitoring for regressions'));
  }
}

// Generate HTML report
function generateHTMLReport(comparison) {
  const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
  const outputPath = path.join(REPORTS_DIR, `cls-comparison-${timestamp}.html`);
  
  const passedComponents = comparison.components.filter(c => c.passed).length;
  const totalComponents = comparison.components.length;
  const passRate = ((passedComponents / totalComponents) * 100).toFixed(1);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CLS Comparison Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #1a73e8;
    }
    .summary {
      background-color: #f0f7ff;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    .summary-item {
      flex: 1;
      min-width: 200px;
    }
    .summary-label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .summary-value {
      font-size: 18px;
    }
    .positive {
      color: #0f9d58;
    }
    .negative {
      color: #d93025;
    }
    .neutral {
      color: #f29900;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    tr:hover {
      background-color: #f4f8fd;
    }
    .pass {
      background-color: #e6f4ea;
      color: #0f9d58;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    .fail {
      background-color: #fce8e6;
      color: #d93025;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    .recommendations {
      background-color: #fff9e6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .chart-container {
      height: 400px;
      margin: 30px 0;
    }
    .footer {
      margin-top: 40px;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>CLS Comparison Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <div class="summary-item">
      <div class="summary-label">Baseline Date</div>
      <div class="summary-value">${comparison.summary.baselineDate}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Comparison Date</div>
      <div class="summary-value">${comparison.summary.comparisonDate}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Baseline Overall CLS</div>
      <div class="summary-value">${comparison.summary.baselineOverallCLS.toFixed(4)}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Current Overall CLS</div>
      <div class="summary-value ${comparison.summary.comparisonOverallCLS <= 0.1 ? 'positive' : 'negative'}">
        ${comparison.summary.comparisonOverallCLS.toFixed(4)}
      </div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Overall Improvement</div>
      <div class="summary-value ${parseFloat(comparison.summary.improvement) > 0 ? 'positive' : 'negative'}">
        ${comparison.summary.improvement}%
      </div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Components Pass Rate</div>
      <div class="summary-value ${parseFloat(passRate) >= 90 ? 'positive' : parseFloat(passRate) >= 75 ? 'neutral' : 'negative'}">
        ${passRate}% (${passedComponents}/${totalComponents})
      </div>
    </div>
  </div>
  
  <h2>Component Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Before CLS</th>
        <th>After CLS</th>
        <th>Improvement</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${comparison.components.map(component => `
        <tr>
          <td>${component.name}</td>
          <td>${component.baselineCLS}</td>
          <td class="${parseFloat(component.comparisonCLS) <= 0.1 ? 'positive' : 'negative'}">${component.comparisonCLS}</td>
          <td class="${parseFloat(component.improvement) > 0 ? 'positive' : parseFloat(component.improvement) < 0 ? 'negative' : 'neutral'}">
            ${component.improvement}%
          </td>
          <td><span class="${component.passed ? 'pass' : 'fail'}">${component.status}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="chart-container">
    <canvas id="clsComparisonChart"></canvas>
  </div>
  
  <div class="recommendations">
    <h3>Recommendations</h3>
    ${
      comparison.components.filter(c => !c.passed).length > 0 
      ? `<p>Focus on fixing the following components with high CLS:</p>
         <ul>
           ${comparison.components
             .filter(c => !c.passed)
             .sort((a, b) => parseFloat(b.comparisonCLS) - parseFloat(a.comparisonCLS))
             .slice(0, 5)
             .map(c => `<li><strong>${c.name}</strong>: CLS ${c.comparisonCLS}</li>`)
             .join('')}
         </ul>`
      : `<p class="positive">✅ All components are below the CLS threshold.</p>`
    }
    
    ${
      comparison.components.filter(c => parseFloat(c.comparisonCLS) > parseFloat(c.baselineCLS)).length > 0
      ? `<p>Investigate regressions in these components:</p>
         <ul>
           ${comparison.components
             .filter(c => parseFloat(c.comparisonCLS) > parseFloat(c.baselineCLS))
             .sort((a, b) => parseFloat(b.comparisonCLS) - parseFloat(a.comparisonCLS))
             .slice(0, 5)
             .map(c => `<li><strong>${c.name}</strong>: ${c.baselineCLS} → ${c.comparisonCLS}</li>`)
             .join('')}
         </ul>`
      : ``
    }
  </div>
  
  <script>
    // Chart data
    const components = ${JSON.stringify(comparison.components.slice(0, 10).map(c => c.name))};
    const baselineData = ${JSON.stringify(comparison.components.slice(0, 10).map(c => parseFloat(c.baselineCLS)))};
    const comparisonData = ${JSON.stringify(comparison.components.slice(0, 10).map(c => parseFloat(c.comparisonCLS)))};
    
    // Create chart
    const ctx = document.getElementById('clsComparisonChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: components,
        datasets: [
          {
            label: 'Before CLS',
            data: baselineData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'After CLS',
            data: comparisonData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'CLS Score'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Component'
            }
          }
        }
      }
    });
  </script>
  
  <div class="footer">
    <p>Generated with ZeroVacancy CLS Testing Framework</p>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  console.log(chalk.green(`\nHTML report generated: ${outputPath}`));
  return outputPath;
}

// Generate CSV report
function generateCSVReport(comparison) {
  const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
  const outputPath = path.join(REPORTS_DIR, `cls-comparison-${timestamp}.csv`);
  
  // CSV header
  let csv = 'Component Name,Before CLS,After CLS,Improvement (%),Status,Notes\n';
  
  // Add CSV rows
  comparison.components.forEach(component => {
    let notes = '';
    if (component.regressionDetected) notes = 'Regression detected';
    else if (component.thresholdExceeded) notes = 'Exceeds threshold';
    
    csv += `"${component.name}",${component.baselineCLS},${component.comparisonCLS},${component.improvement}%,${component.status},"${notes}"\n`;
  });
  
  // Add summary row
  csv += `\n"OVERALL",${comparison.summary.baselineOverallCLS.toFixed(4)},${comparison.summary.comparisonOverallCLS.toFixed(4)},${comparison.summary.improvement}%,${comparison.summary.comparisonOverallCLS <= 0.1 ? 'PASS' : 'FAIL'},"Pass rate: ${comparison.summary.passRate}%"\n`;
  
  fs.writeFileSync(outputPath, csv);
  console.log(chalk.green(`\nCSV report generated: ${outputPath}`));
  return outputPath;
}

// Helper functions for formatting
function formatCLS(cls, includeColor = true) {
  const value = parseFloat(cls);
  if (!includeColor) return value.toFixed(4);
  
  if (value <= 0.05) return chalk.green(value.toFixed(4));
  if (value <= 0.1) return chalk.yellow(value.toFixed(4));
  return chalk.red(value.toFixed(4));
}

function formatImprovement(improvement) {
  const value = parseFloat(improvement);
  if (value > 0) return chalk.green(`+${value}`);
  if (value < 0) return chalk.red(value);
  return chalk.gray('0');
}

function formatStatus(status) {
  if (status === 'PASS') return chalk.green('✓ PASS');
  return chalk.red('✗ FAIL');
}

// Generate comparison and reports
const comparison = generateComparison();

if (outputFormat === 'console' || outputFormat === 'all') {
  generateConsoleReport(comparison);
}

if (outputFormat === 'html' || outputFormat === 'all') {
  generateHTMLReport(comparison);
}

if (outputFormat === 'csv' || outputFormat === 'all') {
  generateCSVReport(comparison);
}

// Create directory if it doesn't exist
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}