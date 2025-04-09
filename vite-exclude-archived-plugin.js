// Custom Vite plugin to exclude archived assets from being copied to the build output
// This is a more direct approach than trying to filter during the bundle phase

import * as fs from 'fs';
import * as path from 'path';

/**
 * A Vite plugin that prevents copying archived assets to the build output
 */
export default function excludeArchivedAssets() {
  return {
    name: 'vite-plugin-exclude-archived-assets',
    
    // Hook into the build process to filter files before they're copied to the output directory
    buildStart() {
      console.log('🔍 Initializing archive exclusion plugin');
    },
    
    // This hook runs when Vite is about to copy assets from the public directory
    load(id) {
      // Only process files from the public directory
      if (id.includes('/public/')) {
        // Check if the file is in the archived-assets directory
        if (id.includes('/archived-assets/')) {
          console.log(`🗄️ Excluding archived asset: ${id}`);
          // Return an empty string instead of the file content
          // This effectively prevents the file from being included in the build
          return '';
        }
      }
      // For all other files, let Vite handle them normally
      return null;
    },
    
    // This hook runs at the beginning of the build
    configResolved(config) {
      // Modify the file copy patterns to exclude archived assets
      const publicDir = path.resolve(config.root, 'public');
      const archivedAssetsDir = path.join(publicDir, 'archived-assets');
      
      console.log(`📂 Public directory: ${publicDir}`);
      console.log(`🗄️ Archived assets directory: ${archivedAssetsDir}`);
      
      // Add a custom hook to the Vite plugin chain
      config.plugins.push({
        name: 'vite-plugin-exclude-archived-assets-copy',
        enforce: 'post',
        
        // This hook runs just before files are written to disk
        writeBundle(options, bundle) {
          console.log('🧹 Cleaning up archived assets from build output...');
          let excludedCount = 0;
          
          // Get the output directory from Vite's config
          const outDir = options.dir || config.build.outDir || 'dist';
          const archivedOutDir = path.join(outDir, 'archived-assets');
          
          // Check if the archived-assets directory exists in the output
          if (fs.existsSync(archivedOutDir)) {
            console.log(`🗑️ Removing archived assets directory: ${archivedOutDir}`);
            try {
              // Recursively remove the directory
              fs.rmSync(archivedOutDir, { recursive: true, force: true });
              console.log(`✅ Successfully removed archived assets directory`);
              excludedCount++;
            } catch (err) {
              console.error(`❌ Error removing archived assets directory: ${err.message}`);
            }
          }
          
          console.log(`✅ Excluded ${excludedCount} archive directories from build output`);
        }
      });
    }
  };
}