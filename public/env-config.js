// Runtime environment variables
// This will be populated during build on Vercel
window.RUNTIME_ENV = window.RUNTIME_ENV || {};
window.env = window.env || {};

// Default fallbacks for critical variables
const FALLBACK_SUPABASE_URL = "https://pozblfzhjqlsxkakhowp.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM";

// Early check and alert for missing environment variables
if (!window.RUNTIME_ENV.VITE_SUPABASE_URL && !window.env.VITE_SUPABASE_URL) {
  console.error('🔴 CRITICAL ERROR: VITE_SUPABASE_URL environment variable is missing!');
  // Create visible error element if the page has loaded enough
  if (document.body) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f8d7da;color:#721c24;padding:20px;text-align:center;font-family:sans-serif;z-index:9999;';
    errorDiv.innerHTML = '<strong>Error:</strong> Missing required environment variables. Please check Vercel environment configuration.';
    document.body.appendChild(errorDiv);
  }
  // Still continue with fallback to at least try loading the app
}

if (!window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY && !window.env.VITE_SUPABASE_ANON_KEY) {
  console.error('🔴 CRITICAL ERROR: VITE_SUPABASE_ANON_KEY environment variable is missing!');
}

// Set runtime environment variables with fallbacks
window.RUNTIME_ENV.VITE_SUPABASE_URL = window.RUNTIME_ENV.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY = window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// Also populate window.env for easier access - this is what most code checks
window.env.VITE_SUPABASE_URL = window.env.VITE_SUPABASE_URL || window.RUNTIME_ENV.VITE_SUPABASE_URL;
window.env.VITE_SUPABASE_ANON_KEY = window.env.VITE_SUPABASE_ANON_KEY || window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY;

// Log for debugging (hiding sensitive parts of key)
console.log('[env-config.js] Environment variables loaded:', {
  VITE_SUPABASE_URL: window.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: window.env.VITE_SUPABASE_ANON_KEY ? 'Key present (hidden)' : 'MISSING'
});