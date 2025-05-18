import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react({
      // React plugin configuration
      transformOptions: {
        newDecorators: true,
        typescript: true,
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  // Build configuration
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    // Sensible chunk size configuration
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['@supabase/supabase-js'],
        }
      }
    }
  },
  // Server configuration
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
  }
});