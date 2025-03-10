
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
      // Force specific React version for all components
      jsxImportSource: 'react',
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force specific module resolution for react-email components
      "@react-email/components": path.resolve(__dirname, "node_modules/@react-email/components"),
      "@react-email/render": path.resolve(__dirname, "node_modules/@react-email/render"),
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom")
    },
    // Dedupe React to prevent version conflicts
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@react-email/components', '@react-email/render'],
    // Force React Email components to use the main project's React version
    force: true,
    esbuildOptions: {
      // Fix for nested dependencies that use different React versions
      preserveSymlinks: false,
      define: {
        // Ensure consistent React environment
        'process.env.NODE_ENV': JSON.stringify(mode)
      }
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      // Add these options to help with React version conflicts
      strictRequires: false,
      esmExternals: true,
    },
    rollupOptions: {
      // External packages that should not be bundled
      external: [],
      output: {
        // Ensure proper chunks for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@react-email')) {
            return 'react-email-vendor';
          }
        },
      },
    },
  }
}));
