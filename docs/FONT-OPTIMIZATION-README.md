# Font Loading Optimization Strategy

This document outlines the comprehensive font loading optimization strategy implemented for ZeroVacancy. These optimizations are designed to improve Core Web Vitals, particularly Cumulative Layout Shift (CLS) and Largest Contentful Paint (LCP), while ensuring the best possible user experience across different devices and network conditions.

## Table of Contents

1. [Features](#features)
2. [Implementation Overview](#implementation-overview)
3. [Font Loading Strategies](#font-loading-strategies)
4. [Font Subsetting](#font-subsetting)
5. [Font Fallback Strategy](#font-fallback-strategy)
6. [Usage Guide](#usage-guide)
7. [Performance Metrics](#performance-metrics)

## Features

- **Prioritized Font Loading**: Critical fonts load first, with non-essential fonts deferred
- **Dynamic Subsetting**: Reduces font file sizes by including only the needed character sets
- **Font Metrics Matching**: Prevents layout shifts by matching fallback font metrics with web fonts
- **Connection-Aware Loading**: Adapts font loading based on network conditions and device capabilities
- **Progressive Font Enrichment**: Ensures text is visible immediately using system fonts before custom fonts load
- **Performance Monitoring**: Built-in monitoring of font loading performance and impact on metrics

## Implementation Overview

The font optimization strategy is split into three main modules:

1. **Font Loading Strategy** (`font-loading-strategy.ts`): Controls when and how fonts are loaded
2. **Font Subsetting** (`font-subsetting.ts`): Reduces font file size by limiting character sets
3. **Font Fallback Strategy** (`font-fallback-strategy.ts`): Prevents layout shifts with optimized fallbacks

These modules are integrated in the main `font-optimization.ts` file, which provides a simple API for the application to use.

## Font Loading Strategies

Five distinct loading strategies are available, each optimized for different use cases:

1. **Critical**: For essential fonts used in above-the-fold content
   - Preloaded with high priority
   - Loaded synchronously or with minimal blocking
   - Example: Primary UI font for headings and navigation

2. **Early**: For important fonts that should load soon but aren't critical
   - Loaded early but not blocking
   - Example: Secondary heading font

3. **Interactive**: For fonts loaded when the page becomes interactive
   - Loaded after critical content is visible
   - Example: Content body font

4. **Lazy**: For fonts that can be deferred until needed
   - Loaded when idle or when scrolled into view
   - Example: Fonts used in the footer or for uncommon languages

5. **On-Demand**: For specialized fonts only needed for specific features
   - Loaded only when a specific user action occurs
   - Example: Font for a code editor or special feature

### Font Display Strategies

Each font can use different `font-display` values:

- **Swap**: Immediately shows fallback font, then swaps when custom font loads (default)
- **Optional**: Shows fallback font, only swaps to custom font if already cached
- **Fallback**: Brief invisible text period, then fallback font, limited swap period
- **Block**: Very short blocking period, then fallback until font loads

## Font Subsetting

Font subsetting significantly reduces file sizes by including only the characters needed:

- **Latin**: Basic Latin alphabet (English, etc.)
- **Latin-Extended**: Latin with accented characters (Western European languages)
- **Alphanumeric**: Only letters and numbers
- **Numeric**: Only numbers and symbols
- **Custom**: User-defined character set

For Latin subset alone, file size reductions of 60-80% are common compared to full font files.

Dynamic subsetting is implemented for Google Fonts using the `text=` parameter, which allows specifying exactly which characters to include.

## Font Fallback Strategy

To prevent layout shifts when custom fonts load, we implement:

1. **Optimized Font Stacks**: Carefully selected fallback fonts that closely match the custom fonts
2. **Metric Adjustments**: CSS properties to match the metrics of fallback fonts to web fonts:
   - `size-adjust`: Adjusts the size to match x-height
   - `ascent-override`: Matches the ascent of the custom font
   - `descent-override`: Matches the descent of the custom font
   - `line-gap-override`: Matches the line gap of the custom font

3. **System Font Categories**: Organized fallbacks based on font categories:
   - Sans-serif: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen...`
   - Serif: `Georgia, "New York", "Times New Roman", Times, serif`
   - Monospace: `"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace`

4. **Platform-Specific Optimizations**: Different fallbacks for different operating systems

## Usage Guide

### Basic Usage

The simplest way to use the font optimization is through the `FontLoader` component:

```jsx
// In your root layout or App component
import FontLoader from '@/components/FontLoader';

function App() {
  return (
    <>
      <FontLoader />
      {/* rest of your app */}
    </>
  );
}
```

### Custom Configuration

For more control, you can directly use the `initOptimizedFonts` function:

```jsx
import { useEffect } from 'react';
import { initOptimizedFonts, ZEROVACANCY_FONTS } from '@/utils/font-optimization';

function CustomFontLoader() {
  useEffect(() => {
    // Initialize with custom settings
    initOptimizedFonts({
      useSwap: true,
      preloadCritical: true,
      useSubsetting: true,
      useFallbackStrategy: true
    });
  }, []);
  
  return null;
}
```

### Defining Custom Fonts

You can define custom fonts with all optimization settings:

```typescript
import { 
  FontDefinition, 
  FontLoadStrategy, 
  FontDisplay, 
  SubsetStrategy 
} from '@/utils/font-optimization';

const CUSTOM_FONTS: FontDefinition[] = [
  {
    family: 'MyCustomFont',
    url: 'https://fonts.googleapis.com/css2?family=MyCustomFont:wght@400;700&display=swap',
    strategy: FontLoadStrategy.CRITICAL,
    display: FontDisplay.SWAP,
    subset: SubsetStrategy.LATIN,
    fallbacks: ['system-ui', 'Arial', 'sans-serif'],
    variants: [
      { weight: 400 },
      { weight: 700 }
    ]
  }
];

// Then use in your component:
initOptimizedFonts({ fonts: CUSTOM_FONTS });
```

## Performance Metrics

The font optimization strategy includes built-in performance monitoring that can be enabled in development or production environments.

### Key Metrics Tracked

- **Font Load Time**: How long it takes for each font to load
- **Total Font Size**: Combined size of all font resources
- **Layout Shift**: Impact on Cumulative Layout Shift (CLS)
- **Format Support**: Browser support for different font formats (WOFF2, WOFF, etc.)

### Viewing Metrics

When `monitorPerformance` is enabled, metrics are logged to the console after fonts are loaded:

```typescript
initOptimizedFonts({
  monitorPerformance: true,
  // other options...
});
```

Output example:
```
Font Performance Report: {
  fontsLoaded: true,
  formatSupport: { woff2: true, woff: true, ttf: true, variableFonts: true },
  fontEntries: [
    { name: "https://fonts.googleapis.com/css2?family=Inter...", duration: 87, size: 2480 },
    { name: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans...", duration: 102, size: 3260 }
  ],
  totalFontSize: 5740,
  fontLoadTime: 102
}
```

---

## Implementation Files

- `/src/utils/font-optimization.ts` - Main integration module
- `/src/utils/font-optimization/font-loading-strategy.ts` - Font loading strategies
- `/src/utils/font-optimization/font-subsetting.ts` - Font subsetting techniques
- `/src/utils/font-optimization/font-fallback-strategy.ts` - Fallback font strategies
- `/src/components/FontLoader.tsx` - React component for font loading

---

## Future Improvements

- Server-side font subsetting for self-hosted fonts
- Variable font optimization
- Integration with build process for static site generation
- Font preloading based on user navigation patterns
- Automatic font metrics calculation