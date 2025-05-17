# CLS Prevention Guide

This guide documents the implementation of Cumulative Layout Shift (CLS) prevention techniques in the ZeroVacancy project.

## Overview

Cumulative Layout Shift (CLS) is a Core Web Vital that measures visual stability. A low CLS score ensures that page elements don't unexpectedly shift during page load, providing a better user experience. This project implements several techniques to minimize CLS, particularly focusing on mobile devices where browser UI changes and orientation shifts can cause significant layout issues.

## Implemented Solutions

### 1. Stable Viewport Height System

The primary CLS issues in mobile browsers stem from unreliable viewport height (`vh`) units due to:
- Address bar showing/hiding
- Browser chrome appearing/disappearing
- Virtual keyboard appearing/disappearing
- Orientation changes

Our solution uses CSS custom properties that represent the real viewport height:

```css
/* Usage in CSS */
height: calc(var(--vh, 1vh) * 100);
/* Or */
height: var(--window-height, 100vh);
```

These variables are set and maintained by `viewport-height-fix.js` and the React hook `useStableViewportHeight`.

### 2. CLS Prevention CSS

We've implemented a dedicated CSS file (`cls-prevention.css`) that is loaded early in the document head to provide immediate stability. Key features:

- CSS variables for critical dimensions
- Pre-stabilization containment
- Fixed header and footer positioning
- Hero section stability
- Aspect ratio preservation for images
- iOS-specific fixes
- Landscape mode optimizations

### 3. Layout Shift Monitoring

Built-in real-time monitoring for layout shifts using the PerformanceObserver API, available through:

- Debug mode with `?debug=cls` URL parameter
- Console logging of significant shifts
- Visual highlighting of problematic elements
- API for programmatic access via `window.__clsMonitoring`

### 4. Bottom Navigation CLS Prevention

The `ConditionalBottomNav` component uses several techniques to prevent layout shifts:

- Early initialization of spacers
- ResizeObserver for accurate dimensions
- Hardware acceleration
- Opacity transitions for smooth appearance
- iOS safe area inset handling

## How to Use

### CSS Variables

```css
/* Element with stable height */
.my-element {
  height: calc(var(--vh, 1vh) * 100);
  /* Other properties */
}

/* Fixed headers with reliable positioning */
.my-header {
  position: fixed;
  top: 0;
  height: var(--header-height);
  /* Other properties */
}

/* Fixed bottom elements with reliable positioning */
.my-footer {
  position: fixed;
  bottom: 0;
  height: var(--mobile-bottom-nav-height);
  padding-bottom: var(--safe-area-inset-bottom, 0px);
  /* Other properties */
}

/* Mobile hero sections */
.my-hero {
  height: var(--hero-mobile-height);
  /* Other properties */
}

/* Aspect ratio container */
.img-container {
  position: relative;
  padding-bottom: var(--aspect-ratio-16-9); /* 56.25% */
  overflow: hidden;
}

.img-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### React Hook

```tsx
import { useStableViewportHeight } from '@/utils/web-vitals';

function MyComponent() {
  const { vh, windowHeight, isStabilized, fixBottomNav } = useStableViewportHeight();
  
  return (
    <div 
      style={{ 
        height: `${vh * 100}px`,
        opacity: isStabilized ? 1 : 0.99,
        transition: 'opacity 0.15s ease-in-out',
      }}
    >
      Content with stable height
    </div>
  );
}
```

### Debugging CLS Issues

1. Add `?debug=cls` to any page URL to enable visual debugging
2. Open browser DevTools console to see CLS reports
3. Use Chrome's Performance panel to record CLS events
4. Check for highlighted elements (red outlines) causing shifts
5. Use the API to get detailed information:
   ```js
   window.__clsMonitoring.getTotalCLS();
   window.__clsMonitoring.getRecentEntries();
   ```

## Best Practices

1. **Always use stable height variables** instead of direct `vh` units
2. **Apply hardware acceleration** to fixed elements:
   ```css
   transform: translateZ(0);
   backface-visibility: hidden;
   will-change: transform;
   ```
3. **Pre-allocate space** for dynamic content, especially images
4. **Use explicit dimensions** for critical above-the-fold elements
5. **Handle orientation changes** properly with the stabilization system
6. **Add safe area insets** for iOS devices:
   ```css
   padding-bottom: var(--safe-area-inset-bottom, 0px);
   ```
7. **Test on real mobile devices** under various conditions (scrolling, rotating, keyboard, etc.)

## Implementation Details

The CLS prevention system is implemented across several files:

- `/public/viewport-height-fix.js` - Early-loading script for viewport stabilization
- `/public/cls-prevention.css` - Critical CSS for layout stability
- `/public/text-fouc-fix.js` - Prevents flash of unstyled content and fixes headers
- `/src/utils/web-vitals.ts` - Contains monitoring tools and React hooks
- `/src/components/ConditionalBottomNav.tsx` - CLS-optimized mobile navigation

## Testing

When testing CLS improvements:

1. Use Chrome's Performance tab with "Layout Shift Regions" enabled
2. Test on real mobile devices (iOS and Android)
3. Test with slow network and CPU throttling
4. Verify during orientation changes
5. Check during navigation between pages
6. Monitor with `?debug=cls` URL parameter

Remember that even small improvements in CLS can significantly enhance user experience, especially on mobile devices.