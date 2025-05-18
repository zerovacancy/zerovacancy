import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Apply fallbacks for critical variables if they're not set
  if (!env.VITE_SUPABASE_URL) {
    env.VITE_SUPABASE_URL = 'https://pozblfzhjqlsxkakhowp.supabase.co';
    console.log('[VITE CONFIG] Applied fallback for VITE_SUPABASE_URL');
  }
  
  if (!env.VITE_SUPABASE_ANON_KEY) {
    env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM';
    console.log('[VITE CONFIG] Applied fallback for VITE_SUPABASE_ANON_KEY');
  }
  
  // Log environment variable loading
  console.log(`\n[VITE CONFIG] Mode: ${mode}`);
  console.log('[VITE CONFIG] Environment Variables:');
  Object.keys(env).filter(key => key.startsWith('VITE_')).forEach(key => {
    console.log(`  ${key}: ${key.includes('KEY') ? '[HIDDEN]' : env[key]}`);
  });
  
  return {
    server: {
      host: "::",
      port: 8080,
      strictPort: true,
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
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
    // Expose env variables to the client
    define: {
      // Make sure we expose Supabase env variables
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      // Expose other env variables
      ...Object.keys(env).reduce((acc, key) => {
        if (key.startsWith('VITE_')) {
          acc[`process.env.${key}`] = JSON.stringify(env[key]);
        }
        return acc;
      }, {}),
    },
    optimizeDeps: {
      include: [
        // React and React DOM for consistent deduplication
        'react',
        'react-dom',
        // React 18 client entry must be pre-bundled separately
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
  };
});