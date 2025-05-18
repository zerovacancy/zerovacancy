// EMERGENCY FIX: Hardcoded Supabase credentials
// This is a last resort fallback to ensure Supabase always works

// Direct Supabase URL and key - these are already public in your app
window.HARDCODED_SUPABASE_URL = "https://pozblfzhjqlsxkakhowp.supabase.co";
window.HARDCODED_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM";

// Make sure window.env is available
window.env = window.env || {};
window.env.VITE_SUPABASE_URL = window.HARDCODED_SUPABASE_URL;
window.env.VITE_SUPABASE_ANON_KEY = window.HARDCODED_SUPABASE_ANON_KEY;

// For modules that might try to access import.meta.env
window.__vite_env_vars = window.__vite_env_vars || {};
window.__vite_env_vars.VITE_SUPABASE_URL = window.HARDCODED_SUPABASE_URL;
window.__vite_env_vars.VITE_SUPABASE_ANON_KEY = window.HARDCODED_SUPABASE_ANON_KEY;

console.log('[EMERGENCY FIX] Hardcoded Supabase credentials activated');

// Expose a direct createClient function for emergency use
window.createSupabaseClient = function() {
  // This is just for reference - the actual connection will be created elsewhere
  console.log('[EMERGENCY] Direct Supabase client createSupabaseClient function called');
  return {
    auth: {
      getSession: async function() {
        return { data: { session: null }, error: null };
      }
    }
  };
};