# CLS Quick Reference Guide

This quick reference provides essential commands, patterns, and guidelines for preventing Cumulative Layout Shift (CLS) issues.

## 📊 CLS Testing Commands

### 🔍 Immediate Testing

```bash
# Run quick CLS check in browser console
fetch('/quick-cls-check.js').then(r => r.text()).then(t => eval(t))

# Verify CLS after building
npm run verify:cls

# Monitor CLS during development
npm run monitor:cls
```

### 🤖 Automated Testing 

```bash
# Run CLS tests across pages and devices
npm run test:cls

# Run CLS tests in CI mode
npm run test:cls:ci

# Run with custom URL and threshold
node scripts/automated-cls-testing.js --url=https://staging.example.com --threshold=0.05
```

## 📝 Code Patterns for Preventing CLS

### ✅ Images

```html
<!-- Always use width/height attributes -->
<img src="image.jpg" width="800" height="600" alt="Description">

<!-- OR use aspect ratio container -->
<div style="aspect-ratio: 16/9; position: relative;">
  <img style="position: absolute; width: 100%; height: 100%; object-fit: cover;" 
       src="image.jpg" alt="Description">
</div>
```

### ✅ Fixed Headers

```css
/* Good: Fixed header with proper positioning */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto; /* Critical - never use bottom: 0 */
  width: 100%;
  height: 64px; /* Always define explicit height */
  transform: translateZ(0); /* Hardware acceleration */
}

/* Bad: Fixed header with bottom: 0 (causes CLS) */
header {
  position: fixed;
  top: 0;
  bottom: 0; /* Will cause CLS when mobile browser UI shows/hides */
}
```

### ✅ Dynamic Content

```jsx
// Pre-allocate space for dynamic content
<div style={{ minHeight: '200px' }}>
  {isLoaded ? <DynamicContent /> : <Skeleton />}
</div>

// Set explicit height for text containers
<div style={{ 
  height: '44px', 
  minHeight: '44px', 
  maxHeight: '44px' 
}}>
  {rotatingText}
</div>
```

### ✅ Animations

```css
/* Good: Only animate transform and opacity */
@keyframes goodAnimation {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Bad: Animating layout properties */
@keyframes badAnimation {
  from { height: 100px; margin-top: 0; }
  to { height: 150px; margin-top: 20px; }
}
```

## 🛑 Common CLS Issues to Avoid

- ❌ Images without width and height attributes
- ❌ Fixed headers with `bottom: 0` instead of `bottom: auto` 
- ❌ Dynamic content without reserved space
- ❌ Animating layout properties (height, width, margin, padding)
- ❌ Fonts loading without fallbacks
- ❌ Third-party elements without size constraints

## 🔎 Diagnosing CLS Issues

### Chrome DevTools

1. Open Chrome DevTools (F12) → Performance tab
2. Click "Start profiling and reload page"
3. Look for red bars indicating layout shifts
4. Click on a layout shift to see details

### Layout Shift Regions

1. Open Chrome DevTools (F12) → Run command (Ctrl+Shift+P)
2. Type "Rendering" and select "Show Rendering"
3. Enable "Layout Shift Regions" 
4. Red highlights will show shifting elements

## 📚 Further Reading

- [CLS Optimization Strategy](/docs/CLS-OPTIMIZATION-STRATEGY.md) - Complete optimization approach
- [CLS Testing Guide](/docs/CLS-TESTING-GUIDE.md) - Detailed testing procedures
- [CLS Style Guide](/docs/CLS-STYLE-GUIDE.md) - Development standards
- [CLS Improvements Verification](/docs/CLS-IMPROVEMENTS-VERIFICATION.md) - Documentation of fixes
