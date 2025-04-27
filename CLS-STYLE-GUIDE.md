# CLS Style Guide

This document provides guidelines for maintaining layout stability when working with the ZeroVacancy codebase.

## Key Principles

1. **Always provide fixed dimensions for dynamic content containers**
   - Especially important for mobile hero sections and image containers
   - Use explicit height/width or aspect ratio when content may change dimensions

2. **Avoid fixed positioned elements with bottom values**
   - If using fixed positioning with bottom values, ensure they are handled through the rendering system
   - Use `position: fixed; top: 0; bottom: auto;` pattern for headers

3. **Use CSS modules for styling complex components**
   - Create dedicated CSS modules for layout-critical components
   - Follow the naming pattern `[component].module.css`

4. **Apply CSS containment strategically**
   - Use `contain: layout paint;` for non-fixed elements
   - Avoid applying containment to fixed/sticky elements
   - Consider impact on stacking contexts

5. **Prevent FOUC with proper styling**
   - Use the `FOUCPrevention` component on all pages
   - Ensure fonts have appropriate fallbacks
   - Pre-allocate space for text that will change

## Mobile-specific Guidelines

1. **Use stable height values for mobile hero sections**
   ```css
   @media (max-width: 768px) {
     .heroContainer {
       height: var(--hero-mobile-height) \!important;
       min-height: var(--hero-mobile-height) \!important;
       max-height: var(--hero-mobile-height) \!important;
     }
   }
   ```

2. **Pre-allocate space for text rotations/animations**
   ```css
   .rotatingTextContainer {
     height: 44px \!important;
     min-height: 44px \!important;
     max-height: 44px \!important;
   }
   ```

3. **Handle notched devices with safe area insets**
   ```css
   padding-left: max(16px, var(--safe-area-inset-left));
   padding-right: max(16px, var(--safe-area-inset-right));
   ```

## Header Navigation Pattern

1. **Fixed Header CSS**
   ```css
   header {
     position: fixed;
     top: 0;
     left: 0;
     right: 0;
     width: 100%;
     z-index: 1000;
     bottom: auto \!important; /* Critical - prevent bottom value layout shifts */
   }
   ```

2. **Add padding to body for fixed header**
   ```css
   body {
     padding-top: var(--header-height);
   }
   ```

3. **Ensure content doesn't overflow under header**
   ```css
   main {
     margin-top: var(--header-height);
     position: relative;
     z-index: 1;
   }
   ```

## Testing Layout Stability

1. Run the performance build:
   ```bash
   npm run perf-test
   ```

2. Check for layout shifts in Chrome DevTools:
   - Open Chrome DevTools > More Tools > Rendering
   - Enable "Layout Shift Regions" to visualize shifts

3. Test on multiple devices and ensure CLS values stay below 0.1

## Helpful CSS Rules

```css
/* Fixed header pattern */
header, [role="banner"] {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto \!important;
  z-index: 1000;
}

/* Image container with aspect ratio */
.img-container {
  aspect-ratio: 16/9;
  position: relative;
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

/* Prevent layout shift for loading content */
.loading-content {
  min-height: 200px;
  display: grid;
  place-items: center;
}
```

Remember: Layout stability is a key factor in user experience and Core Web Vitals scores. Always test changes on mobile devices before deployment.
