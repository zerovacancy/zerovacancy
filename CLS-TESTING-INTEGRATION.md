# CLS Testing CI/CD Integration Guide

## Overview

This guide explains how to integrate the automated CLS (Cumulative Layout Shift) testing framework into your CI/CD pipeline to ensure layout stability is monitored and maintained throughout development.

## Prerequisites

- Node.js 16+
- Puppeteer
- GitHub Actions or similar CI/CD platform

## Local Testing

Before pushing changes, run the CLS tests locally:

```bash
# Quick test on current build
./analyze-site-cls.sh

# Full build and test
./analyze-site-cls.sh --build
```

## GitHub Actions Integration

We've set up a GitHub workflow that automatically runs CLS tests on:
- All pull requests to the main branch
- After merges to the main branch
- Manual triggers via workflow_dispatch

### Workflow File

The workflow configuration is located at `.github/workflows/cls-testing.yml`.

### Workflow Steps

1. **Build the Project**: Builds the application for testing
2. **Start Local Server**: Serves the built files for testing
3. **Run CLS Tests**: Runs the automated CLS testing script
4. **Generate Reports**: Creates HTML and JSON reports
5. **Upload Artifacts**: Uploads reports as workflow artifacts
6. **Create PR Comment**: Posts a summary of CLS results on PRs
7. **Fail Check**: Fails if CLS thresholds are exceeded

### How to Use

1. **For Pull Requests**: The workflow runs automatically and posts results as a comment
2. **For Manual Testing**: Go to Actions > CLS Testing > Run workflow

### Interpreting Results

The workflow produces:

1. **PR Comment**: Contains a summary of CLS scores and component-specific data
2. **HTML Report**: Detailed visual report with charts and component breakdown
3. **JSON Data**: Raw data for further analysis

## Setting Component Budgets

Component budgets can be configured in the testing script:

```javascript
// Example thresholds in scripts/automated-cls-testing.js
const componentThresholds = {
  'hero': 0.05,        // Stricter threshold for hero
  'rotating-text': 0.02, // Very strict for rotating text
  'default': 0.1       // Default Web Vitals "good" threshold
};
```

## Continuous Monitoring

Beyond CI/CD, we recommend:

1. **Weekly Reports**: Generate weekly CLS reports using the scheduled workflow
2. **Trend Analysis**: Track CLS scores over time to identify regressions
3. **Component Reviews**: Review CLS impact for new components

## Troubleshooting

### Common Issues

1. **Puppeteer Dependencies Missing**: 
   ```
   Error: Failed to launch browser: ...
   ```
   Solution: Ensure all required dependencies are installed in the CI environment

2. **Timeouts on CI**: 
   ```
   Error: Navigation timeout of 30000 ms exceeded
   ```
   Solution: Increase the timeout value in the testing script

3. **Inconsistent Results**: 
   ```
   Warning: CLS results vary between runs
   ```
   Solution: Increase the number of test runs and take an average

## Advanced Configuration

### Custom Testing Parameters

Modify these in the CI workflow file:

```yaml
- name: Run CLS tests
  run: node scripts/automated-cls-testing.js --url=http://localhost:3000 --threshold=0.1 --ci --runs=3
```

### Test Multiple Branches

To test multiple branches, modify the workflow trigger:

```yaml
on:
  push:
    branches: [ main, staging, develop ]
  pull_request:
    branches: [ main ]
```

## Best Practices

1. **Test Early**: Run CLS tests locally before creating PRs
2. **Component Focus**: Pay special attention to interactive components
3. **Mobile First**: Prioritize mobile device configurations
4. **Incremental Fixes**: Address high-impact issues first
5. **Documentation**: Document any allowed exceptions to CLS rules

## Additional Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [CLS-STYLE-GUIDE.md](./CLS-STYLE-GUIDE.md) - Component-specific guidelines
- [CLS-PREVENTION-GUIDE.md](./CLS-PREVENTION-GUIDE.md) - Best practices