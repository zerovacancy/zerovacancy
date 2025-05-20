# FOUC Prevention Strategy

This document explains how we addressed the Flash of Unstyled Content (FOUC) issue where outdated heroparallax images were appearing briefly during page load, particularly on mobile devices.

## Problem Summary

- On page refresh (especially on mobile), outdated heroparallax images would appear for approximately 3 seconds
- These images were from an old design but were still being preloaded
- The issue was primarily a Flash of Unstyled Content (FOUC) problem

## Complete Solution

Our solution consists of several complementary approaches to permanently fix the issue:

### 1. FOUCPrevention Component

A dedicated React component (`src/components/FOUCPrevention.tsx`) that:

- Adds a loading class to the HTML element during initial page load
- Injects CSS that hides all images during the loading phase
- Contains specific rules to block any elements with "heroparallax" in the src or style
- Monitors the DOM for any dynamically added heroparallax images
- Sets proper transitions for smooth image appearance once the page is loaded

### 2. Asset Management

- Moved all heroparallax images to an `archived-assets` directory
- Created a script (`clean-heroparallax-references.sh`) to ensure these assets stay properly archived
- Updated build configuration to exclude archived assets from production builds
- Removed empty heroparallax directory from main public folder

### 3. Preload Optimization

- Removed heroparallax preload directives from `index.html`
- Updated `CriticalPreload.tsx` to remove references to heroparallax images
- Added only essential images to the critical preload list

### 4. Global CSS Rules

Added defensive CSS rules in `index.css` to:

- Hide elements with "heroparallax" in their src or style properties
- Control image visibility during the loading phase
- Ensure smooth transitions when images become visible

### 5. Build Process Improvement

- Created a Vite plugin (`vite-exclude-archived-plugin.js`) to exclude archived assets from builds
- Added checks during build to prevent archived assets from being copied to the output directory

## Usage Guidelines

To maintain the FOUC prevention strategy:

1. **DO NOT** move heroparallax images back to the main public directory
2. **DO NOT** add new preload directives for these images
3. Keep the FOUCPrevention component in the application component tree
4. Run the `clean-heroparallax-references.sh` script as needed to clean up any stray references

## Additional Notes

- The FOUCPrevention strategy is generic enough to handle other types of FOUC issues
- The component includes debugging information in development mode
- Mobile devices have specific optimizations to handle their unique rendering challenges
- The solution has minimal performance impact while providing maximum visual stability

By implementing this comprehensive approach, we've eliminated the 3-second flash of outdated images during page load while also optimizing the application's overall loading performance.