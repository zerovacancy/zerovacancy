
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import reactSingleton from "./src/plugins/vite-react-singleton";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    // This is critical for SPA routing - redirects all requests to index.html
    historyApiFallback: true,
  },
  plugins: [
    // Handle React properly
    reactSingleton(),
    
    react({
      // More aggressive optimizations in production
      transformOptions: {
        newDecorators: true, 
        typescript: true,
        development: mode === 'development',
      },
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: mode === 'development', // Only generate sourcemaps in development
    minify: 'esbuild', // Use esbuild for minification
    chunkSizeWarningLimit: 1000, // Increase chunk size limit
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'], // Modern browsers only for smaller bundles
    cssMinify: true,
    cssCodeSplit: false, // Disable CSS code splitting to prevent loading issues on mobile
    assetsInlineLimit: 4096, // Inline small assets to reduce HTTP requests
    rollupOptions: {
      output: {
        // Function-based manual chunks for better React deduplication
        manualChunks: function(id) {
          // Always put React in its own chunk
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          
          // React Router
          if (id.includes('node_modules/react-router') || 
              id.includes('node_modules/@remix-run/router')) {
            return 'react-router';
          }
          
          // UI Core libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'ui-core';
          }
          
          // Radix UI components
          if (id.includes('node_modules/@radix-ui/react-')) {
            return 'ui-radix';
          }
          
          // Our UI components
          if (id.includes('/components/ui/')) {
            // Animations
            if (id.includes('animated-grid') || 
                id.includes('spotlight') || 
                id.includes('moving-border')) {
              return 'animations';
            }
            
            // Basic UI components
            if (id.includes('button.tsx') || 
                id.includes('toast.tsx') || 
                id.includes('dialog.tsx') || 
                id.includes('tabs.tsx')) {
              return 'ui-components';
            }
          }
          
          // Let other modules use default chunking
          return null;
        },
        // Optimize chunk creation with more reliable naming for mobile
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();
          if (extType === 'css') {
            // Use a stable name for CSS files to avoid mobile preloading issues
            return 'assets/css/styles.[ext]';
          }
          return `assets/${extType}/[name]-[hash].[ext]`;
        },
      },
    },
    // Use esbuild for compression/minification
    esbuildOptions: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
      pure: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
    },
  },
  // Improve file system case sensitivity handling and dependency optimization
  optimizeDeps: {
    force: true, // Re-bundle dependencies to ensure case sensitivity is correct
    esbuildOptions: {
      target: 'es2020', // Modern JavaScript features for smaller output
      treeShaking: true,
      legalComments: 'none',
    },
  },
  // Additional performance optimizations
  esbuild: {
    legalComments: 'none',
    target: 'es2020',
    treeShaking: true,
  },
}));
