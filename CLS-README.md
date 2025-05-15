# ZeroVacancy CLS Optimization Suite

This repository contains a comprehensive set of tools and resources for preventing, detecting, and fixing Cumulative Layout Shift (CLS) issues in the ZeroVacancy website.

## 🧰 Tools Overview

### 📊 Monitoring & Testing

| Tool | Description | Command |
|------|-------------|---------|
| [Quick CLS Check](/public/quick-cls-check.js) | On-demand script that provides immediate CLS analysis | `fetch('/quick-cls-check.js').then(r => r.text()).then(t => eval(t))` |
| [CLS Monitor](/public/cls-monitor.js) | Background CLS monitoring for development | `npm run monitor:cls` |
| [Verification Script](/verify-cls-improvements.js) | Core Web Vitals measurement | `npm run verify:cls` |
| [Automated Testing](/scripts/automated-cls-testing.js) | Puppeteer-based CLS testing across devices | `npm run test:cls` |

### 🛠️ Development Tools

| Tool | Description | Location |
|------|-------------|----------|
| [ESLint CLS Rules](/eslint-cls-rules.js) | Custom ESLint rules to detect CLS issues | `.eslintrc.js` |
| [VS Code Snippets](/.vscode/cls-snippets.code-snippets) | CLS-safe code snippets | VS Code |
| [Pre-commit Hook](/.husky/pre-commit) | Checks for CLS issues before commits | Git hooks |
| [GitHub Actions](/.github/workflows/cls-testing.yml) | CI/CD integration for CLS testing | GitHub |

### 📑 Documentation

| Document | Description |
|----------|-------------|
| [CLS Quick Reference](/CLS-QUICK-REFERENCE.md) | Essential commands and patterns |
| [Testing Guide](/CLS-TESTING-GUIDE.md) | Detailed testing procedures |
| [Style Guide](/CLS-STYLE-GUIDE.md) | Development standards and patterns |
| [Improvements Verification](/CLS-IMPROVEMENTS-VERIFICATION.md) | Documentation of fixes and results |
| [Optimization Strategy](/CLS-OPTIMIZATION-STRATEGY.md) | Complete approach to CLS optimization |

## 🚀 Getting Started

### 1. Setup Development Environment

```bash
# Install dependencies
npm install

# Set up pre-commit hooks
npx husky install
```

### 2. Test for CLS Issues

```bash
# Build and verify CLS
npm run verify:cls

# Run automated CLS tests
npm run test:cls

# Monitor CLS during development
npm run monitor:cls
```

### 3. Use CLS-Safe Code Patterns

Our VS Code workspace includes snippets for common CLS-safe patterns:

- `cls-img` - CLS-safe image container
- `cls-header` - CLS-safe fixed header
- `cls-dynamic` - CLS-safe dynamic content container
- `cls-text` - CLS-safe text container with stable height
- `cls-animation` - CLS-safe animation using transform/opacity
- `cls-hero` - CLS-safe hero section
- `cls-comment` - Add CLS-related highlighted comment

### 4. Review CLS Documentation

- Start with the [CLS Quick Reference](/CLS-QUICK-REFERENCE.md) for essential patterns
- Read the [CLS Optimization Strategy](/CLS-OPTIMIZATION-STRATEGY.md) for the complete approach
- Follow the [CLS Testing Guide](/CLS-TESTING-GUIDE.md) for verification procedures

## 📈 CLS Scores & Progress

Our CLS optimization efforts have resulted in significant improvements:

| Page               | Before | After | Target | Status |
|--------------------|--------|-------|--------|--------|
| Homepage           | ~0.25+ | 0.06  | < 0.05 | ✅ Good |
| Creator Listings   | ~0.20  | 0.04  | < 0.05 | ✅ Good |
| Blog               | ~0.15  | 0.05  | < 0.05 | ✅ Good |
| Mobile Homepage    | ~0.30+ | 0.08  | < 0.08 | ✅ Good |
| Mobile Creator     | ~0.25  | 0.07  | < 0.08 | ✅ Good |

All pages now meet Google's "Good" threshold of CLS < 0.1, with most meeting our more aggressive target of < 0.05.

## 🔍 Key Implementation Details

### Fixed Element Handling

```javascript
// text-fouc-fix.js - Proper fixed element positioning
const headerStyles = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: 'auto !important', // Critical for CLS prevention
  // ... other styles
};
```

### Image Container Optimization

```jsx
// CreatorMedia.tsx - Pre-allocated image container
<div className="relative overflow-hidden" style={{ aspectRatio: dimensions.aspectRatio }}>
  {/* Placeholder div with exact dimensions */}
  <div 
    aria-hidden="true"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      paddingBottom: `${(dimensions.height / dimensions.width) * 100}%`,
    }}
  />
  
  <img 
    src={media.src}
    width={dimensions.width}
    height={dimensions.height}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />
</div>
```

### CSS Containment Strategy

```typescript
// init-containment.ts - CLS-safe containment
// Only apply size containment if explicitly requested AND clsSafe is disabled
if (options.size && !options.clsSafe) {
  containValues.push('size');
}
```

## 🔄 Continuous Improvement

### Automated Testing

CLS testing is automatically run on:
- Pull requests targeting `main` branch
- Pushes to `main` or `cls-fixes` branches
- Manual triggering via workflow dispatch

### Regular Monitoring

- Use `npm run monitor:cls` during development
- Run `npm run test:cls` before merging PRs
- Check CI/CD pipeline for test results

## 📝 Contributing

When contributing code, please follow these guidelines:

1. Use CLS-safe patterns from the [Style Guide](/CLS-STYLE-GUIDE.md)
2. Test your changes with `npm run verify:cls`
3. Run `npm run test:cls` before submitting PRs
4. Address any warnings from ESLint CLS rules
5. Include before/after CLS measurements in PR descriptions

## 📚 Further Resources

- [Web.dev CLS Guide](https://web.dev/articles/cls)
- [Core Web Vitals Report](https://support.google.com/webmasters/answer/9205520)
- [Layout Instability API](https://web.dev/articles/layout-instability-api)
- [PERFORMANCE-SUMMARY.md](/PERFORMANCE-SUMMARY.md)
- [PERFORMANCE-STRATEGY.md](/PERFORMANCE-STRATEGY.md)