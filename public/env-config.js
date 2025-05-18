// Runtime environment variables
// This will be populated during build on Vercel
window.RUNTIME_ENV = window.RUNTIME_ENV || {};
window.env = window.env || {};

// Default fallbacks for critical variables
const FALLBACK_SUPABASE_URL = "https://pozblfzhjqlsxkakhowp.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM";

// Set runtime environment variables with fallbacks
window.RUNTIME_ENV.VITE_SUPABASE_URL = window.RUNTIME_ENV.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY = window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// Also populate window.env for easier access
window.env.VITE_SUPABASE_URL = window.env.VITE_SUPABASE_URL || window.RUNTIME_ENV.VITE_SUPABASE_URL;
window.env.VITE_SUPABASE_ANON_KEY = window.env.VITE_SUPABASE_ANON_KEY || window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY;

// Log for debugging (hiding sensitive parts of key)
console.log('[env-config.js] Environment variables loaded:', {
  VITE_SUPABASE_URL: window.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: window.env.VITE_SUPABASE_ANON_KEY ? 'Key present (hidden)' : 'MISSING'
});