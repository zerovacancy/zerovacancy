
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
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
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets to reduce HTTP requests
    rollupOptions: {
      output: {
        // Improved code splitting strategy
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'ui-core': ['framer-motion'],
          'ui-radix': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-toast',
            '@radix-ui/react-accordion', 
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-slot',
          ],
          'ui-components': [
            '@/components/ui/button.tsx',
            '@/components/ui/toast.tsx',
            '@/components/ui/dialog.tsx',
            '@/components/ui/tabs.tsx',
          ],
          'animations': [
            '@/components/ui/animated-grid.tsx',
            '@/components/ui/spotlight.tsx',
            '@/components/ui/optimized-spotlight.tsx',
            '@/components/ui/moving-border.tsx',
          ],
        },
        // Optimize chunk creation
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
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
