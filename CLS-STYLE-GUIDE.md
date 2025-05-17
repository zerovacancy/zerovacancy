# ZeroVacancy CLS Prevention Style Guide

## Table of Contents
- [Introduction](#introduction)
- [Core Concepts](#core-concepts)
- [CSS Patterns](#css-patterns)
- [React Component Patterns](#react-component-patterns)
- [Hooks & Utilities](#hooks--utilities)
- [Testing & Verification](#testing--verification)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Introduction

This style guide provides patterns and best practices for preventing Cumulative Layout Shift (CLS) in the ZeroVacancy application. CLS is a Core Web Vital that measures visual stability and heavily impacts user experience and SEO ranking.

Following these patterns will ensure that new components and features maintain the performance improvements we've implemented across the site, with current CLS scores well below Google's "Good" threshold of 0.1.

## Core Concepts

### What Causes CLS?
1. **Images without dimensions**: Images loading without explicit width/height attributes
2. **Fixed positioning issues**: Especially elements with `bottom: 0` on mobile browsers
3. **Dynamic content**: Content that changes size after loading
4. **Web fonts**: Fonts that cause text to reflow after loading
5. **Animation**: Animations that change layout properties (height, width, margin, etc.)

### Key Prevention Strategies
1. **Pre-allocate space**: Always define explicit dimensions for containers
2. **Use CSS containment**: Apply appropriate containment properties to limit layout impact
3. **Hardware acceleration**: Use transform/opacity for animations, not layout properties
4. **Viewport stability**: Use viewport units with JavaScript fallbacks for mobile
5. **Fixed element safety**: Properly define fixed elements to prevent mobile browser issues

## CSS Patterns

### Fixed Header Pattern

```css
/* Safe fixed header */
header, [role="banner"] {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto !important; /* Critical - never use bottom: 0 for headers */
  width: 100%;
  height: var(--header-height, 60px); /* Explicit height */
  z-index: var(--z-index-header, 1000);
  transform: translateZ(0); /* Hardware acceleration */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Body padding to prevent content overlap */
body {
  padding-top: var(--header-height, 60px);
}
```

### Image Container Pattern

```css
/* Aspect ratio container */
.img-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* Creates 4:3 aspect ratio */
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

/* Modern aspect-ratio alternative */
.modern-img-container {
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
}
```

### Stable Viewport Height

```css
/* Use the --vh CSS variable set by JS */
.full-height {
  height: 100vh; /* Fallback */
  height: calc(var(--vh, 1vh) * 100); /* Stable height */
}

/* For iOS Safari safe area */
.ios-fixed-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* Mobile hero section height */
@media (max-width: 768px) {
  .hero-section {
    height: var(--hero-mobile-height) !important;
    min-height: var(--hero-mobile-height) !important;
    max-height: var(--hero-mobile-height) !important;
  }
}
```

### Animation Safety

```css
/* Safe animations (transform/opacity only) */
@keyframes safeAnimation {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Unsafe animations (changing layout properties) */
@keyframes unsafeAnimation {
  from { height: 0; margin-top: 20px; } /* Avoid these! */
  to { height: 100px; margin-top: 0; }
}
```

### CSS Containment

```css
/* Safe containment for non-dynamic content */
.contain-safe {
  contain: layout paint; /* Avoid size containment for CLS-sensitive elements */
}

/* Hardware acceleration */
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform;
}
```

### Pre-allocate Space for Dynamic Content

```css
/* Rotating text container with fixed height */
.rotating-text-container {
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  overflow: visible !important;
}

/* Loading content placeholder */
.loading-content {
  min-height: 200px;
  display: grid;
  place-items: center;
}
```

## React Component Patterns

### Image Component Pattern

```tsx
// CLS-safe image component
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}> = ({ src, alt, width, height, className }) => {
  const [loaded, setLoaded] = useState(false);
  const aspectRatio = (height / width) * 100;
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        paddingBottom: `${aspectRatio}%`,
        width: '100%'
      }}
    >
      {/* Placeholder to reserve space */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#f7f7f7'
        }}
      />
      
      <img 
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="eager" // Critical above-the-fold content
        decoding="async"
        fetchpriority="high"
        style={{
          transform: 'translateZ(0)', // Hardware acceleration
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
};
```

### Dynamic Content Pattern

```tsx
// CLS-safe dynamic content component
const DynamicContent: React.FC<{
  children: React.ReactNode;
  minHeight: number;
}> = ({ children, minHeight }) => {
  const [contentHeight, setContentHeight] = useState(minHeight);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Use ResizeObserver to track content height changes
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = Math.max(entry.contentRect.height, minHeight);
        setContentHeight(height);
      }
    });
    
    resizeObserver.observe(contentRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [minHeight]);
  
  return (
    <div style={{ height: contentHeight, transition: 'height 0.3s ease' }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};
```

### Fixed Bottom Nav Pattern

```tsx
// CLS-safe bottom navigation
const BottomNav: React.FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  
  // Apply stable height on mount
  useEffect(() => {
    if (!navRef.current) return;
    
    // Set explicit height variables for spacing
    const height = navRef.current.offsetHeight;
    document.documentElement.style.setProperty('--bottom-nav-height', `${height}px`);
    
    // Add body padding to prevent content from being hidden
    document.body.style.paddingBottom = `${height}px`;
    
    // Check for iOS and add safe area inset
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      navRef.current.style.paddingBottom = 'env(safe-area-inset-bottom, 0)';
    }
    
    return () => {
      document.body.style.paddingBottom = '';
    };
  }, []);
  
  return (
    <nav 
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 w-full bg-white border-t"
      style={{
        top: 'auto', // Critical for CLS prevention
        transform: 'translateZ(0)', // Hardware acceleration
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      {/* Navigation content */}
    </nav>
  );
};
```

### Font Loading Pattern

```tsx
// CLS-safe font loading
const FontLoader: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  useEffect(() => {
    // Use Font Loading API if available
    if ('fonts' in document) {
      Promise.all([
        (document as any).fonts.load('1em Inter'),
        (document as any).fonts.load('bold 1em Inter')
      ]).then(() => {
        setFontsLoaded(true);
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      // Fallback to timeout
      const timeoutId = setTimeout(() => {
        setFontsLoaded(true);
        document.documentElement.classList.add('fonts-loaded');
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);
  
  return null; // Component doesn't render anything
};

// Usage with fallback fonts
const Typography: React.FC = () => (
  <>
    <FontLoader />
    <style jsx global>{`
      html:not(.fonts-loaded) {
        /* System font stack as fallback */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      
      html.fonts-loaded {
        font-family: 'Inter', sans-serif;
      }
    `}</style>
  </>
);
```

## Hooks & Utilities

### Viewport Height Hook

```tsx
// useViewportHeight hook for stable viewport measurement
export function useViewportHeight() {
  const [vh, setVh] = useState(0);
  
  useEffect(() => {
    const updateVh = () => {
      // Set a CSS variable for 1vh unit
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setVh(vh);
    };
    
    // Initial calculation
    updateVh();
    
    // Update on resize and orientation change
    window.addEventListener('resize', updateVh, { passive: true });
    window.addEventListener('orientationchange', updateVh, { passive: true });
    
    return () => {
      window.removeEventListener('resize', updateVh);
      window.removeEventListener('orientationchange', updateVh);
    };
  }, []);
  
  return vh * 100; // Return full viewport height
}
```

### Stable Render Hook

```tsx
// useStableRender hook to prevent flicker during dimensions calculation
export function useStableRender(minHeight: number = 0) {
  const [isStable, setIsStable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Mark as stable after component has mounted and browser has painted
    const timeoutId = setTimeout(() => {
      setIsStable(true);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  return {
    containerRef,
    isStable,
    style: {
      minHeight: `${minHeight}px`,
      opacity: isStable ? 1 : 0,
      transition: 'opacity 0.2s ease-in-out',
      transform: 'translateZ(0)', // Hardware acceleration
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden'
    }
  };
}
```

### Hero Height Utility

```tsx
// Utility to set explicit hero section heights
export function setHeroHeights() {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Mobile hero heights (70% of viewport or fixed minimum)
    const mobileHeight = Math.max(window.innerHeight * 0.7, 450);
    document.documentElement.style.setProperty('--hero-mobile-height', `${mobileHeight}px`);
    document.documentElement.style.setProperty('--hero-min-mobile-height', `${mobileHeight}px`);
  } else {
    // Desktop hero heights (can be more flexible)
    document.documentElement.style.setProperty('--hero-desktop-height', 'auto');
    document.documentElement.style.setProperty('--hero-min-desktop-height', '70vh');
  }
}
```

### Layout Shift Detection Utility

```tsx
// Utility to detect and highlight layout shifts
export function detectLayoutShifts(debugMode = false) {
  if (!('PerformanceObserver' in window)) return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Skip if had recent input (user action caused the shift)
        if ((entry as any).hadRecentInput) continue;
        
        // Get the sources (elements that shifted)
        const sources = (entry as any).sources || [];
        
        if (debugMode && sources.length > 0) {
          // Highlight elements that caused the shift
          sources.forEach((source: any) => {
            if (!source.node) return;
            
            // Temporarily highlight the element
            const originalOutline = source.node.style.outline;
            source.node.style.outline = '3px solid red';
            
            // Reset after 2 seconds
            setTimeout(() => {
              source.node.style.outline = originalOutline;
            }, 2000);
            
            console.warn(
              `Layout shift detected (${(entry as any).value.toFixed(4)}):`,
              source.node
            );
          });
        }
      }
    });
    
    // Start observing layout-shift entries
    observer.observe({ type: 'layout-shift', buffered: true });
    
    return () => observer.disconnect();
  } catch (error) {
    console.error('Error setting up layout shift detection:', error);
  }
}
```

## Testing & Verification

### Visual Testing

1. **Chrome DevTools Layout Shifts**:
   - Open Chrome DevTools > More tools > Rendering
   - Check "Layout Shift Regions"
   - Observe any highlighted areas in red during page interaction

2. **Performance Panel**:
   - Open Chrome DevTools > Performance
   - Record page load and interaction
   - Look for "Layout Shift" entries in the summary

### Automated Testing

1. **CLS Testing Script**:
   ```bash
   # Run CLS test on a specific page
   npm run test:cls --url=https://example.com/page
   
   # Test across multiple devices (mobile and desktop)
   npm run test:cls:devices
   ```

2. **Testing In Your PR**:
   - Include before/after CLS measurements in PR descriptions
   - Run `npm run verify:cls` to ensure CLS meets thresholds
   - Add screenshots showing no layout shifts during critical interactions

### In-Page Verification
Add the CLS monitor script to detect issues during development:

```html
<!-- Add to your page during development -->
<script>
  fetch('/cls-monitor.js')
    .then(r => r.text())
    .then(t => eval(t))
</script>
```

## Troubleshooting Common Issues

### Fixed Elements Causing Shifts

**Symptoms**: Layout shifts when scrolling or when browser UI appears/disappears.

**Solution**:
1. Check the fixed element's CSS properties
2. Ensure `bottom: auto` is set for headers
3. Ensure `top: auto` is set for bottom navigation
4. Add hardware acceleration with `transform: translateZ(0)`

```css
/* Debugging fixed elements */
[style*="position:fixed"] {
  outline: 2px dashed blue;
}

[style*="position:fixed"][style*="bottom:0"]:not(.bottom-nav) {
  outline: 2px dashed red; /* Problematic fixed elements */
}
```

### Images Causing Shifts

**Symptoms**: Content jumps as images load.

**Solution**:
1. Always include width/height attributes on images
2. Use aspect ratio containers with predefined dimensions
3. Consider adding a placeholder or skeleton loader

```jsx
// Debugging image containers
document.querySelectorAll('img').forEach(img => {
  if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
    img.style.outline = '3px solid red';
    console.warn('Image missing dimensions:', img);
  }
});
```

### Animations Causing Shifts

**Symptoms**: Content jumps during animations.

**Solution**:
1. Only animate `transform` and `opacity` properties
2. Avoid animating size, position, or layout properties

```css
/* Safe animation properties */
.safe-animation {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Unsafe animation properties */
.unsafe-animation {
  transition: height 0.3s ease, margin 0.3s ease; /* Avoid these! */
}
```

### Dynamic Content Causing Shifts

**Symptoms**: Content jumps when new content is loaded or revealed.

**Solution**:
1. Pre-allocate space for dynamic content
2. Use min-height with transition for smooth height changes
3. Implement ResizeObserver to track content size changes

```jsx
// Find dynamic containers without minimum height
document.querySelectorAll('[data-dynamic="true"]').forEach(container => {
  const style = window.getComputedStyle(container);
  if (!style.minHeight || style.minHeight === '0px') {
    container.style.outline = '3px solid red';
    console.warn('Dynamic container missing min-height:', container);
  }
});
```

### Mobile-Specific Issues

**Symptoms**: Layout shifts on mobile but not desktop.

**Solution**:
1. Test with iOS Safari and Chrome for Android
2. Use CSS variables with JavaScript fallbacks: `--vh`, `--window-height`
3. Add iOS-specific handling for safe area insets
4. Implement proper viewport meta tags

```html
<!-- Proper viewport meta for mobile stability -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---

By following these patterns and best practices, we can maintain excellent CLS scores across the ZeroVacancy application. Remember to test your changes on multiple devices and browsers, and use the provided testing tools to verify performance.