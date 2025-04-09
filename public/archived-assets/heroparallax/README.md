# Archived Heroparallax Images

These images were used in a previous version of the site but have been archived to prevent:

1. Flash of Unstyled Content (FOUC) issues on page load
2. Unnecessary bandwidth usage for assets no longer in use
3. Inclusion in production builds

## Important Notes

- DO NOT move these files back to the main public directory
- DO NOT reference these images in any component or CSS
- These files are excluded from production builds via the vite-exclude-archived-plugin.js

If you need to restore these images for any reason, please update the FOUCPrevention component
to prevent them from causing visual issues during page load.
