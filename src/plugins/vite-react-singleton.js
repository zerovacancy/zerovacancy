/**
 * Vite Plugin: React Singleton
 * 
 * This plugin ensures that only one copy of React is used throughout the application
 * by properly handling React externalization in Vite.
 * 
 * Usage:
 * Add this plugin to your vite.config.ts
 */

export default function reactSingleton() {
  return {
    name: 'vite-plugin-react-singleton',
    
    config(config) {
      // Ensure optimizeDeps includes React packages
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = [
        ...(config.optimizeDeps.include || []),
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ];
      
      // Ensure build options correctly handle React
      if (!config.build) config.build = {};
      if (!config.build.rollupOptions) config.build.rollupOptions = {};
      if (!config.build.rollupOptions.output) config.build.rollupOptions.output = {};
      
      // Ensure React is bundled in the react-core chunk
      const output = config.build.rollupOptions.output;
      if (!output.manualChunks) {
        output.manualChunks = (id) => {
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          return null;
        };
      } else if (typeof output.manualChunks === 'object') {
        // Convert object-style manualChunks to function
        const originalChunks = { ...output.manualChunks };
        output.manualChunks = (id) => {
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          
          // Check original chunks
          for (const [name, modules] of Object.entries(originalChunks)) {
            if (Array.isArray(modules) && modules.some(m => id.includes(m))) {
              return name;
            }
          }
          
          return null;
        };
      }
      
      return config;
    }
  };
}