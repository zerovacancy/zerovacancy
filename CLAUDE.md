# CLAUDE.md - ZeroVacancy Project Guide

## Table of Contents
- [Project Overview](#project-overview)
- [Commands Reference](#commands-reference)
- [File Organization](#file-organization)
- [Best Practices](#best-practices-for-this-project)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Code Snippets](#code-snippets)
- [Browser DevTools Guide](#browser-devtools-guide)
- [Deployment](#deployment)
- [Maintenance Schedule](#maintenance-schedule)
- [Performance Budgets](#performance-budgets)
- [Version History](#version-history)
- [Team Collaboration](#team-collaboration)
- [Resources](#resources)
- [Claude Prompt Templates](#claude-prompt-templates)

## Project Overview
This project is a React-based web application using Vite, TypeScript, shadcn-ui, and Tailwind CSS. It focuses on performance optimization, particularly for Core Web Vitals.

## Commands Reference

### Development & Build
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build with performance optimizations
npm run build:perf

# Build with detailed development mode
npm run build:dev

# Preview the build
npm run preview
```

### Performance Testing & Optimization
```bash
# Run full performance optimization
npm run perf-full

# Test performance build with Web Vitals monitoring
npm run perf-test

# Mobile-specific performance build
npm run mobile-perf

# Extract critical CSS
npm run extract-critical-css

# Analyze Web Vitals in browser
npm run analyze-web-vitals
```

### Image Optimization
```bash
# Quick image optimization
npm run quick-optimize

# Full image optimization
npm run optimize-images

# Optimize creator-specific images
npm run optimize-creator-images

# Update image references after optimization
npm run update-image-refs

# Run all image performance tasks
npm run perf-images
```

### Asset Management
```bash
# Audit unused assets
npm run audit-assets

# Archive unused assets
npm run archive-unused

# Complete asset cleanup
npm run asset-cleanup
```

### SEO Tools
```bash
# Generate sitemap
npm run generate-sitemap

# Audit SEO components
npm run seo-audit

# Complete SEO check
npm run seo-check
```

### Linting & Type Checking
```bash
# Run ESLint
npm run lint

# Type checking (add this to package.json)
npm run typecheck: "tsc --noEmit"
```

## File Organization

### Key Directories
- `/src/components` - UI components organized by feature
- `/src/pages` - Page components with routing
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions including performance optimizations
- `/src/types` - TypeScript type definitions
- `/src/styles` - CSS and style-related files
- `/public` - Static assets including optimized images

### Performance-related Files
- `/src/utils/layout-shift-prevention.ts` - CLS prevention
- `/src/utils/font-loading.js` - Font optimization
- `/src/utils/image-optimization.ts` - Image loading strategies
- `/src/utils/web-vitals.ts` - Performance monitoring
- `/src/components/FOUCPrevention.tsx` - Prevents flash of unstyled content
- `/scripts/critical-css.js` - Extracts critical CSS

## Best Practices for This Project

### Performance Optimization
- Check for layout shift with every UI change
- Use optimized image components for all images
- Test on mobile devices regularly - run `npm run mobile-perf`
- Monitor Web Vitals with each significant change
- Review performance summary before major commits

> ⚠️ **Warning**: Never remove the FOUC prevention system, even if it seems to cause initial delays. It prevents much worse user experience issues during page load.

> 💡 **Tip**: When testing performance on mobile, always test on actual devices with CPU/network throttling enabled for realistic results.

### CSS & Styling
- Follow the component styling patterns established
- Use Tailwind utility classes where appropriate
- Check for any fixed elements with non-auto bottom values
- Maintain containment properties for dynamic content
- Review CSS modules for performance impact
- Check the new hero component styles before modifications

> ⚠️ **Warning**: Fixed positioning with bottom:0 can cause severe layout shifts on mobile devices, especially when the viewport height changes.

### React Best Practices
- Follow established component patterns
- Use the proper performance hooks from `/src/hooks`
- Check for React hooks rule compliance: `npm run lint`
- Use ErrorBoundary components for graceful failures
- Maintain React singleton instances to prevent duplicate React DOM

> 💡 **Tip**: Always wrap dynamic content areas with layout shift prevention hooks to ensure stability.

### Testing Tasks
- Test on mobile regularly, especially the hero section
- Verify FOUC prevention is working with rapid page refreshes
- Test navigation without layout shifts
- Check font loading and appearance across devices
- Run full performance tests before major releases

### Claude Code Agent Tasks
- Search for fixed positioning: `GrepTool "position:\\s*fixed" --include="*.css" --include="*.tsx"`
- Find z-index values: `GrepTool "z-index:" --include="*.css" --include="*.tsx"`
- Check hero-related components: `GlobTool "**/hero/**"`
- Find layout shift prevention code: `GrepTool "layout.*shift" --include="*.ts" --include="*.tsx"`
- Analyze CSS containment: `GrepTool "contain:" --include="*.css" --include="*.tsx"`
- Check file sizes: `bash "find public -type f -name '*.jpg' -o -name '*.png' | xargs ls -lh | sort -k5nr"`

## Troubleshooting Common Issues

### Performance Issues
- **High CLS Values**: Check recent changes to fixed positioning elements or hero components
  ```bash
  # Find recent changes to positioning
  git diff HEAD~5 --name-only | xargs grep -l "position:"
  
  # Look for newly added elements with position fixed
  git diff HEAD~5 | grep -A2 -B2 "position:\\s*fixed"
  ```

- **Slow Initial Load**: Verify critical CSS extraction and font loading
  ```bash
  # Check if critical CSS is being properly inlined
  grep -r "criticalCSS" public/index.html
  
  # Verify font preloading
  grep -r "preload.*font" public/index.html
  ```

- **Mobile Performance Issues**: Run mobile-specific optimizations
  ```bash
  # Run mobile optimization build
  npm run mobile-perf
  
  # Check mobile image sizes
  find public -path "*/mobile/*" -type f | xargs ls -lh | sort -k5nr
  ```

### Build Errors
- **React Hook Violations**: Use the fixes script
  ```bash
  # Fix React hook dependency issues
  ./fix-react-hooks.sh
  
  # Run simple hook fixes
  ./fix-react-hooks-simple.sh
  ```

- **Vite Build Failures**: Check for plugin conflicts
  ```bash
  # Verify Vite configuration
  npm run build:dev -- --debug
  
  # Run diagnostic on problematic imports
  ./dev-scripts/debug-blog-errors.js
  ```

- **Asset Reference Issues**: Update references after optimizations
  ```bash
  # Update image references
  npm run update-image-refs
  
  # Clean up heroparallax references
  ./clean-heroparallax-references.sh
  ```

### React Issues
- **Multiple React Instances**: Check for duplicate React installations
  ```bash
  # Fix React dependencies
  node fix-react-deps.js
  
  # Verify React singleton
  grep -r "React=" src/
  ```

- **FOUC During Navigation**: Ensure FOUC prevention is working
  ```bash
  # Verify FOUC prevention is enabled
  node verify-fouc-prevention.js
  
  # Check text-specific FOUC prevention
  grep -r "preventTextFOUC" src/
  ```

- **Hook Errors**: Run the hook error diagnostic
  ```bash
  # Find hook errors
  eslint src/ --rule "react-hooks/exhaustive-deps: error"
  
  # Apply hook error fixes
  cat HOOK-ERRORS-FIX.md | bash
  ```

## Code Snippets

### Using the OptimizedImage Component
```tsx
// Basic usage
import { OptimizedImage } from 'src/components/ui/optimized-image';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description of image"
  width={800}
  height={600}
  priority={true} // For above-the-fold images
/>

// With mobile-specific optimization
<OptimizedImage
  src="/path/to/image.jpg"
  mobileSrc="/path/to/mobile/image.jpg"
  alt="Description of image"
  width={800}
  height={600}
  mobileWidth={400}
  mobileHeight={300}
/>

// With placeholder and blur-up
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description of image"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Using Layout Shift Prevention Hooks
```tsx
// Prevent layout shift for dynamic height elements
import { useLayoutShiftPrevention } from 'src/hooks/use-optimized-render';

function DynamicHeightComponent() {
  const { containerRef, isStabilized } = useLayoutShiftPrevention();
  
  return (
    <div 
      ref={containerRef}
      className={`transition-opacity duration-300 ${isStabilized ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Your dynamic content */}
    </div>
  );
}

// For mobile viewport stabilization
import { useMobileViewportStabilization } from 'src/hooks/use-mobile';

function MobileComponent() {
  useMobileViewportStabilization();
  
  return (
    // Your mobile-optimized component
  );
}
```

### Font Loading Optimization
```tsx
// Implement proper font loading with FOUT prevention
import { useFontLoadingEffect } from 'src/utils/font-optimization';

function App() {
  const fontsReady = useFontLoadingEffect();
  
  return (
    <div className={fontsReady ? 'fonts-loaded' : 'fonts-loading'}>
      {/* Application content */}
    </div>
  );
}
```

### Critical Rendering Path Optimization
```tsx
// Prioritize critical rendering in component
import { useCriticalRender } from 'src/hooks/use-optimized-render';

function CriticalComponent() {
  const { isReady, containerRef } = useCriticalRender();
  
  return (
    <div ref={containerRef}>
      {isReady ? (
        // Full component render
      ) : (
        // Minimal placeholder with same dimensions
      )}
    </div>
  );
}
```

## Browser DevTools Guide

### Performance Profiling
1. Open Chrome DevTools (F12) > Performance tab
2. Enable CPU/Network throttling (4x CPU slowdown for mobile testing)
3. Click Record and interact with the page
4. Check for long tasks and layout shifts in the recording
5. Identify render-blocking resources

```javascript
// Add this to any page to enable detailed performance marks
if (process.env.NODE_ENV === 'development') {
  import('/public/quick-perf.js');
}
```

### Layout Shift Debugging
1. Open Chrome DevTools > Rendering tab (Ctrl+Shift+P > Show Rendering)
2. Enable "Layout Shift Regions" 
3. Watch for red flashes indicating CLS events
4. Use Screenshots panel to capture before/after

> 💡 **Tip**: For persistent layout shift detection, add `?debug=cls` to any URL on your site

### Memory Leak Detection
1. Open Chrome DevTools > Memory tab
2. Take heap snapshot before and after suspected leak
3. Compare snapshots looking for retained objects
4. Focus on React component retention

### Network Analysis
1. Open Chrome DevTools > Network tab
2. Enable "Disable cache" during testing
3. Use "Slow 3G" preset to test mobile performance
4. Check for render-blocking resources
5. Verify image serving optimization:
   - WebP/AVIF format usage
   - Proper image dimensions
   - Compression level

## Deployment

### Pre-Deployment Checklist
- [ ] Run full performance optimization: `npm run perf-full`
- [ ] Run linting and type checking: `npm run lint && npm run typecheck`
- [ ] Verify SEO components: `npm run seo-check`
- [ ] Check for unused assets: `npm run audit-assets`
- [ ] Run final WebVitals analysis: `npm run perf-test`
- [ ] Verify FOUC prevention: `node verify-fouc-prevention.js`
- [ ] Check creator images are optimized: `npm run optimize-creator-images`
- [ ] Validate critical CSS extraction: `grep -r "criticalCSS" public/index.html`
- [ ] Check mobile optimization: `npm run mobile-perf`
- [ ] Verify no console errors on key pages

### Deployment Commands
```bash
# Standard production build and deploy
npm run build
npm run preview # Verify locally before deploying

# Performance-optimized build for deployment
npm run perf-build

# Full optimization pipeline for production
npm run perf-full

# Post-deployment verification
curl -s https://yourdomain.com | grep -i "criticalCSS"
curl -s https://yourdomain.com | grep -i "FOUCPrevention"
```

### Deployment Environments
- **Development**: Use `npm run build:dev` for debugging information
- **Staging**: Use `npm run perf-build` for performance testing
- **Production**: Use `npm run perf-full` for full optimization

## Performance Budgets

### Bundle Size Targets
| Resource Type | Target Size | Warning Threshold | Error Threshold |
|---------------|-------------|-------------------|-----------------|
| Initial JS    | < 150 KB    | 170 KB            | 200 KB          |
| Initial CSS   | < 30 KB     | 40 KB             | 50 KB           |
| Image (Hero)  | < 200 KB    | 250 KB            | 300 KB          |
| Image (Other) | < 100 KB    | 150 KB            | 200 KB          |
| Fonts (Total) | < 100 KB    | 120 KB            | 150 KB          |

### Core Web Vitals Targets
| Metric | Target   | Warning  | Poor     | Measurement Tool                |
|--------|----------|----------|----------|--------------------------------|
| LCP    | < 2.5s   | 2.5-4.0s | > 4.0s   | `npm run analyze-web-vitals`    |
| CLS    | < 0.1    | 0.1-0.25 | > 0.25   | Chrome DevTools > Performance   |
| FID    | < 100ms  | 100-300ms| > 300ms  | Chrome DevTools > Performance   |
| INP    | < 200ms  | 200-500ms| > 500ms  | `?debug=vitals` query parameter |
| TTI    | < 3.8s   | 3.8-7.3s | > 7.3s   | Lighthouse                      |

> ⚠️ **Warning**: Exceeding these budgets requires team review and optimization before deployment.

## Maintenance Schedule

### Weekly Tasks
- Run performance monitoring: `npm run analyze-web-vitals`
- Check for new image optimizations: `npm run optimize-images`
- Review console for any new errors or warnings
- Verify mobile experience and performance
- Check creator image loading times

### Monthly Tasks
- Full asset audit: `npm run audit-assets`
- Archive unused assets: `npm run archive-unused`
- Comprehensive SEO check: `npm run seo-check`
- Update image references: `npm run update-image-refs`
- Verify all critical CSS is still relevant

### Quarterly Tasks
- Complete performance optimization review
- Update Core Web Vitals benchmarking
- Clean up deprecated components
- Upgrade performance-related dependencies
- Review font loading strategies
- Run full mobile optimization pass
- Check heroparallax references and clean up if needed

## Version History

| Date       | Version | Changes                                               | Performance Impact |
|------------|---------|-------------------------------------------------------|-------------------|
| 2025-04-01 | 1.0.0   | Initial performance optimization framework            | LCP -1.2s, CLS -0.15 |
| 2025-04-10 | 1.1.0   | Added FOUC prevention system                          | CLS -0.08        |
| 2025-04-15 | 1.2.0   | Implemented layout shift prevention for hero section  | CLS -0.12        |
| 2025-04-18 | 1.3.0   | Fixed CSS containment issues with fixed elements      | CLS -0.05        |
| 2025-04-19 | 1.4.0   | Added detailed performance documentation and guide    | N/A              |

## Team Collaboration

### Performance Documentation Guidelines
1. Document all performance-related changes in commit messages
2. Always mention affected Web Vitals when modifying performance-critical code
3. Include before/after metrics when making significant performance changes
4. Tag performance-critical PRs with `performance` label
5. Add WebVitals measurements to PR descriptions

### Code Review Process
For performance-related changes, follow this review process:
1. Verify CLS impact with Chrome DevTools
2. Test on at least one mobile device
3. Compare bundle size before/after
4. Check image optimization for any media changes
5. Verify font loading for any typography changes

> 💡 **Tip**: Use the comment template in PR descriptions:
> ```
> ## Performance Impact
> - LCP: [before] → [after]
> - CLS: [before] → [after]
> - Bundle: [before] → [after]
> ```

## Resources

### Documentation
- [Core Web Vitals Overview](https://web.dev/vitals/) - Google's official Web Vitals documentation
- [PERFORMANCE-SUMMARY.md](./PERFORMANCE-SUMMARY.md) - Project-specific performance documentation
- [FOUC-PREVENTION.md](./FOUC-PREVENTION.md) - Flash of unstyled content prevention strategy
- [CORE-PERFORMANCE-IMPROVEMENTS.md](./CORE-PERFORMANCE-IMPROVEMENTS.md) - Technical implementation details
- [FONT-OPTIMIZATION-README.md](./FONT-OPTIMIZATION-README.md) - Font loading strategy documentation

### Tools
- [PageSpeed Insights](https://pagespeed.web.dev/) - Performance testing tool
- [WebPageTest](https://www.webpagetest.org/) - Detailed performance analysis
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Integrated in Chrome DevTools
- [Bundle Size Analyzer](https://www.npmjs.com/package/source-map-explorer) - JS bundle size visualization 

### Project-Specific
- [Event Listener Diagnostic Guide](./EVENT-LISTENER-DIAGNOSTIC-GUIDE.md) - Troubleshooting event listeners
- [React Hook Errors Fix](./HOOK-ERRORS-FIX.md) - Common hook error solutions
- [verify-fouc-prevention.js](./verify-fouc-prevention.js) - Testing FOUC prevention

## Claude Prompt Templates

### Performance Analysis
```
Analyze the performance of my ZeroVacancy project. I'm particularly concerned about [specific issue or area]. 

Please review the following files:
1. src/utils/layout-shift-prevention.ts
2. src/components/FOUCPrevention.tsx
3. src/utils/web-vitals.ts

Suggest optimizations that would improve [Core Web Vital] without sacrificing user experience.
```

### Code Review for Performance
```
Review this [component/file] for performance issues:

[paste code here]

Specifically check for:
1. Potential layout shifts
2. Proper image optimization
3. Font loading issues
4. React rendering optimization opportunities
5. CSS containment problems

How could I make this code more performant while maintaining the same functionality?
```

### Component Enhancement Request
```
I need to enhance the [component name] in our ZeroVacancy project to be more performant.

Current issues:
- [list issues]

Requirements:
1. Must maintain current visual design
2. Should reduce layout shift
3. Must optimize for mobile
4. Should use our OptimizedImage component for any images
5. Must follow our CSS containment patterns

Please suggest the implementation with a focus on Core Web Vitals optimization.
```

### Bug Fix Request
```
I'm experiencing a performance bug in the ZeroVacancy project related to [describe issue].

Relevant files:
- [file paths]

Symptoms:
- [list symptoms]

Web Vitals affected:
- [list affected metrics]

Please help diagnose the issue and suggest fixes that align with our performance optimization patterns.
```

### Feature Implementation Request
```
I need to implement a new feature in the ZeroVacancy project:

Feature: [describe feature]

Performance requirements:
1. Must not increase bundle size significantly
2. Should maintain current CLS scores
3. Should optimize images automatically
4. Must prevent FOUC
5. Should be mobile-optimized

Please suggest an implementation approach that follows our existing patterns for performance optimization.
```