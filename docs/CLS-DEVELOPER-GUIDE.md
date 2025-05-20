# CLS Developer Guide

This guide provides developers with best practices, tools, and workflows for preventing and fixing Cumulative Layout Shift (CLS) issues in the ZeroVacancy project.

## Table of Contents
- [Understanding CLS](#understanding-cls)
- [Development Workflow](#development-workflow)
- [CLS Testing Tools](#cls-testing-tools)
- [Common CLS Issues & Solutions](#common-cls-issues--solutions)
- [Component-Specific Guidance](#component-specific-guidance)
- [Creating CLS Improvement PRs](#creating-cls-improvement-prs)
- [Resources](#resources)

## Understanding CLS

Cumulative Layout Shift (CLS) is a Core Web Vital that measures visual stability. It quantifies how much visible content shifts unexpectedly during page load and interaction. Google considers a good CLS score to be 0.1 or less.

### Why CLS Matters
- Improves user experience by reducing frustration from content jumps
- Affects search ranking through Core Web Vitals metrics
- Reduces accidental clicks and user errors
- Creates a more professional, stable feeling application

### How CLS is Calculated
CLS is the sum of all individual layout shift scores, where each score is calculated as:
```
layout shift score = impact fraction × distance fraction
```

- **Impact fraction**: The portion of the viewport that was affected by the shift
- **Distance fraction**: How far elements moved relative to the viewport

## Development Workflow

### 1. Before You Code: Understand CLS Prevention
- Review the [CLS Prevention Guide](./CLS-PREVENTION-GUIDE.md)
- Understand [common CLS patterns](#common-cls-issues--solutions)
- Know the [component-specific guidelines](#component-specific-guidance)

### 2. During Development: Use CLS Monitoring
```bash
# Start development with CLS monitoring
npm run dev:cls
```

This will:
- Start the development server 
- Add a CLS monitor overlay to your browser
- Highlight elements causing layout shifts in real-time
- Provide component-specific CLS metrics

### 3. Before Committing: Run CLS Linting
```bash
# Run automated CLS linting
npm run lint:cls
```

This will:
- Check for common CLS-causing code patterns
- Provide a report of potential issues
- Recommend fixes for each type of issue

### 4. Before Creating a PR: Run Automated CLS Tests
```bash
# Run comprehensive CLS tests
npm run test:cls
```

### 5. Create a CLS-focused PR
Use the [CLS improvement PR template](/.github/PULL_REQUEST_TEMPLATE/cls_improvement.md) when submitting changes.

## CLS Testing Tools

### Development Monitoring
- **CLS Monitor**: Live overlay during development (`npm run dev:cls`)
- **Chrome DevTools**: Enable "Layout Shift Regions" in the Rendering tab
- **Mobile Testing**: Use real devices with `npm run dev:mobile-cls`

### Automated Tools
- **CLS Linting**: Finds common CLS-causing patterns (`npm run lint:cls`)
- **Automated CLS Testing**: Component-specific CLS tests (`npm run test:cls`)
- **Component CLS Tracker**: Tests specific components (`npm run test:cls:component ComponentName`)
- **Mobile CLS Testing**: Mobile-specific CLS tests (`npm run test:cls:mobile`)

### CI/CD Integration
CLS testing is integrated into our CI/CD pipeline:
- **Pull Requests**: Automatic CLS testing for every PR
- **Main Branch**: Regular CLS benchmark testing
- **Reports**: CLS reports are generated as artifacts

## Common CLS Issues & Solutions

### 1. Dynamic Content Without Reserved Space

**Issue:**
```jsx
// BAD: No space reserved for dynamic content
<div className="content-container">
  {isLoaded && <DynamicContent />}
</div>
```

**Solution:**
```jsx
// GOOD: Use ResizeObserver and CSS containment
import { useLayoutShiftPrevention } from '../hooks/use-optimized-render';

function StableComponent() {
  const { containerRef, isStabilized, containerDimensions } = useLayoutShiftPrevention();
  
  return (
    <div 
      ref={containerRef}
      className="content-container"
      style={{
        contain: 'layout size',
        minHeight: '200px', // Fallback minimum size
        ...(containerDimensions.height > 0 && {
          height: `${containerDimensions.height}px`
        })
      }}
    >
      {isLoaded && <DynamicContent />}
    </div>
  );
}
```

### 2. Images Without Dimensions

**Issue:**
```jsx
// BAD: No width/height attributes
<img src="/image.jpg" alt="Description" />
```

**Solution:**
```jsx
// GOOD: Always specify width and height
<img src="/image.jpg" alt="Description" width={800} height={600} />

// BETTER: Use OptimizedImage component
import { OptimizedImage } from '../components/ui/optimized-image';

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true} // For above-the-fold images
/>
```

### 3. Fixed Positioning With Non-Zero Bottom

**Issue:**
```css
/* BAD: Fixed position with non-zero bottom */
.mobile-panel {
  position: fixed;
  bottom: 50px;
}
```

**Solution:**
```css
/* GOOD: Fixed position with bottom:0 and padding */
.mobile-panel {
  position: fixed;
  bottom: 0;
  padding-bottom: 50px;
}
```

### 4. Viewport Height Issues on Mobile

**Issue:**
```css
/* BAD: Direct use of vh units */
.hero {
  height: 100vh;
}
```

**Solution:**
```jsx
// GOOD: Use viewport height stabilization
import { useStableViewportHeight } from '../hooks/use-viewport-height';

function StableHeightComponent() {
  useStableViewportHeight();
  
  return (
    <div 
      className="hero"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }} 
    >
      {/* Content */}
    </div>
  );
}
```

### 5. Layout-Affecting Animations

**Issue:**
```css
/* BAD: Animating layout properties */
.animated-element {
  transition: height 0.3s, width 0.3s, margin 0.3s;
}
```

**Solution:**
```css
/* GOOD: Only animate transform and opacity */
.animated-element {
  transition: transform 0.3s, opacity 0.3s;
}
```

## Component-Specific Guidance

### Hero Components
- Always pre-allocate space with aspect ratios
- Use `useStableViewportHeight()` for full-height heroes
- Keep text FOUC prevention active
- Load mobile-optimized images first

### Image Galleries
- Implement aspect ratio containers for all images
- Use hardware acceleration with `transform: translateZ(0)`
- Never transition layout properties
- Implement ResizeObserver for dynamic gallery heights

### Card Grids
- Calculate grid layouts before rendering
- Implement grid item standardization
- Use CSS containment with `contain: layout size`
- Pre-allocate space for dynamic content

### Search Results
- Implement skeleton screens with realistic dimensions
- Use `useLayoutShiftPrevention()` hook for results container
- Apply hardware acceleration for mobile
- Handle empty states with fixed dimensions

## Creating CLS Improvement PRs

When creating a PR focused on CLS improvements, follow these steps:

1. **Measure baseline performance**
   ```bash
   npm run test:cls -- --report baseline
   ```

2. **Implement fixes using the appropriate techniques**
   - Follow the [component-specific guidance](#component-specific-guidance)
   - Use the hooks and patterns outlined in this guide

3. **Measure improvement**
   ```bash
   npm run test:cls -- --report improvement
   ```

4. **Generate a comparison report**
   ```bash
   npm run test:cls:compare baseline improvement
   ```

5. **Create a PR using the CLS template**
   - Include the comparison report
   - Provide specific details about techniques applied
   - Include before/after screenshots or videos when possible

## Resources

### Internal Documentation
- [CLS Prevention Guide](./CLS-PREVENTION-GUIDE.md)
- [CLS Optimization Summary](./CLS-OPTIMIZATION-SUMMARY.md)
- [CLS Quick Reference](./CLS-QUICK-REFERENCE.md)
- [CLS Style Guide](./CLS-STYLE-GUIDE.md)

### External Resources
- [Google Web Vitals: CLS](https://web.dev/cls/)
- [Debug Layout Shifts](https://web.dev/debug-layout-shifts/)
- [Optimize CLS](https://web.dev/optimize-cls/)
- [Layout Instability API](https://developer.mozilla.org/en-US/docs/Web/API/Layout_Instability_API)

### Tools
- [Chrome DevTools - Layout Shift Debugging](https://developers.google.com/web/tools/chrome-devtools/rendering/performance#layout-shift-regions)
- [Web Vitals Extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)