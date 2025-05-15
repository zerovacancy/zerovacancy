
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import excludeArchivedAssets from "./vite-exclude-archived-plugin.js";
import viteTipTapPlugin from "./vite-tiptap-plugin.js";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
  plugins: [
    // Plugin to exclude archived assets from the build
    excludeArchivedAssets(),

    // Plugin to properly handle TipTap dependencies
    viteTipTapPlugin(),

    // Copy web-vitals.iife.js to assets/js directory during build
    {
      name: 'copy-web-vitals',
      apply: 'build',
      enforce: 'post',
      closeBundle() {
        // This plugin ensures that the web-vitals script from public/assets/js is properly included
        console.log('Ensuring web-vitals.iife.js is correctly included in build output');

        // The actual copy operation is handled by the npm script before vite build runs
        // This is just a confirmation hook that executes after the bundle is closed
      }
    },

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
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    sourcemap: mode === 'development', // Only generate sourcemaps in development
    minify: 'esbuild', // Use esbuild for minification
    chunkSizeWarningLimit: 1000, // Increase chunk size limit
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'], // Modern browsers only for smaller bundles
    cssMinify: true,
    cssCodeSplit: true, // Enable CSS code splitting for better caching and performance
    assetsInlineLimit: 4096, // Inline small assets to reduce HTTP requests
    rollupOptions: {
      output: {
        // Simplified manual chunks for key dependencies
        manualChunks: function(id) {
          // Core React and React DOM packages
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          
          // UI component libraries (Radix UI, Framer Motion)
          if (id.includes('node_modules/@radix-ui/') || 
              id.includes('node_modules/framer-motion')) {
            return 'vendor-ui';
          }
          
          // Route related packages
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          
          // Let Vite handle other chunks automatically
          return null;
        },
        // Optimize chunk creation with more reliable naming for mobile
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();
          if (extType === 'css') {
            // Use a hashed name for CSS files for better cache invalidation
            return 'assets/css/styles-[hash].[ext]';
          }
          
          // Skip archived assets from being included in the build
          if (assetInfo.name && assetInfo.name.includes('archived-assets')) {
            return `excluded/[name]-[hash].[ext]`; // This puts them in a directory that's easy to filter out
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
    // Plugin configuration handled by excludeArchivedAssets() in plugins section
  },
  // Improve file system case sensitivity handling and dependency optimization
  optimizeDeps: {
    force: true, // Re-bundle dependencies to ensure case sensitivity is correct
    esbuildOptions: {
      target: 'es2020', // Modern JavaScript features for smaller output
      treeShaking: true,
      legalComments: 'none',
    },
    timeout: 60000, // Increase timeout to 60 seconds for TipTap dependencies
      include: [
        // React and React DOM for consistent deduplication
        'react',
        'react-dom',
        // React 18 client entry must be pre-bundled separately
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        // Error boundary package
        'react-error-boundary',
      
      // Pre-bundle these TipTap dependencies to prevent optimization timeouts
      '@tiptap/react',
      '@tiptap/core',
      '@tiptap/starter-kit',
      '@tiptap/extension-image',
      '@tiptap/extension-link',
      '@tiptap/extension-placeholder',
      '@tiptap/extension-text-align',
      '@tiptap/extension-table',
      '@tiptap/extension-table-row',
      '@tiptap/extension-table-cell',
      '@tiptap/extension-table-header',
      '@tiptap/extension-code-block'
    ],
  },
  // Additional performance optimizations
  esbuild: {
    legalComments: 'none',
    target: 'es2020',
    treeShaking: true,
  },
  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true, // Handle CSS imports
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...configDefaults.coverage.exclude,
        '**/*.d.ts',
        '**/tests/**',
        '**/*.test.{ts,tsx}',
        '**/__mocks__/**',
        '**/node_modules/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      }
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**'
    ],
  },
}));
