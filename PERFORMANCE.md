# Performance Optimization

This document outlines performance improvements made to the ZeroVacancy website and provides guidance for further optimizations.

## Current Improvements

### 1. Image Optimization

The largest performance issue identified was oversized images. We've implemented:

- **Image Optimization Script** (`npm run optimize-images`): Converts images to WebP format and resizes them to appropriate dimensions.
- **Image Reference Update Script** (`npm run update-image-refs`): Updates image references in components to use WebP images when available.
- **Combined Command** (`npm run perf-images`): Runs both scripts in sequence.

### 2. Render-Blocking Resources

To reduce the impact of render-blocking resources:

- Modified `index.html` to defer non-critical JavaScript
- Main application bundle loads with higher priority
- Third-party scripts load after page is interactive

## How to Use the Performance Tools

1. **Optimize all images**:
   ```
   npm run perf-images
   ```

2. **Build the optimized site**:
   ```
   npm run build
   ```

3. **Preview the optimized site**:
   ```
   npm run preview
   ```

## Further Recommended Optimizations

### High Priority

1. **Implement a proper Image Component**:
   - Create a dedicated Image component that handles:
     - Responsive sizing
     - WebP format with fallbacks
     - Lazy loading
     - Explicit width/height to prevent layout shifts

2. **Set Up a CDN for Images**:
   - Use a CDN with image optimization capabilities (e.g., Cloudinary, imgix)
   - Configure automatic WebP delivery based on browser support

3. **Reduce JavaScript Bundle Size**:
   - Enable code splitting in Vite configuration
   - Implement dynamic imports for less critical components
   - Add route-based code splitting

### Medium Priority

1. **Improve Caching Strategy**:
   - Set appropriate cache headers for static assets
   - Implement versioning for cache busting

2. **Optimize CSS**:
   - Remove unused CSS using PurgeCSS
   - Extract critical CSS and inline it
   - Defer non-critical CSS

3. **Implement Resource Hints**:
   - Add preload for critical assets
   - Use prefetch for likely navigation targets
   - Consider preconnect for third-party domains

### Low Priority

1. **Optimize Fonts**:
   - Use `font-display: swap` to improve perceived performance
   - Consider using variable fonts
   - Subset fonts to include only necessary characters

2. **Implement Service Worker**:
   - Cache static assets
   - Provide offline functionality
   - Enable background updates

## Tracking Performance

Run performance tests regularly using:
- Google PageSpeed Insights
- Lighthouse in Chrome DevTools
- WebPageTest.org

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [WebP Images](https://developers.google.com/speed/webp)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
- [JavaScript Optimization](https://web.dev/fast/#optimize-your-javascript)