// Enhanced Supabase client with explicit error handling
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Declare the supabase client at the module level (will be assigned later)
// Use proper type from Supabase client
let supabase: ReturnType<typeof createClient<Database>>;

// Export the supabase client
export { supabase };

// HARDCODED FALLBACKS - will be used if env vars are missing
const FALLBACK_SUPABASE_URL = 'https://pozblfzhjqlsxkakhowp.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM';

// Get environment variables with straightforward fallbacks
function getSupabaseConfig() {
  // Priority 1: Check window.env (populated by env-config.js)
  let supabaseUrl = '';
  let supabaseKey = '';
  let source = '';
  
  try {
    if (typeof window !== 'undefined' && window.env) {
      supabaseUrl = window.env.VITE_SUPABASE_URL;
      supabaseKey = window.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log('[SUPABASE] Using window.env variables');
        source = 'window.env';
        return { supabaseUrl, supabaseKey, source };
      }
    }
  } catch (err) {
    console.error('[SUPABASE] 🔴 Error accessing window.env:', err);
  }
  
  // Priority 2: Check build-time injected variables
  try {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      console.log('[SUPABASE] Using build-time environment variables (import.meta.env)');
      source = 'import.meta.env';
      return { supabaseUrl, supabaseKey, source };
    }
  } catch (err) {
    console.error('[SUPABASE] 🔴 Error accessing import.meta.env:', err);
  }
  
  // Priority 3: Check window.RUNTIME_ENV
  try {
    if (typeof window !== 'undefined' && window.RUNTIME_ENV) {
      supabaseUrl = window.RUNTIME_ENV.VITE_SUPABASE_URL;
      supabaseKey = window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log('[SUPABASE] Using window.RUNTIME_ENV variables');
        source = 'window.RUNTIME_ENV';
        return { supabaseUrl, supabaseKey, source };
      }
    }
  } catch (err) {
    console.error('[SUPABASE] 🔴 Error accessing window.RUNTIME_ENV:', err);
  }
  
  // Priority 4: Use fallback values for all environments (this is critical for production)
  console.warn('[SUPABASE] ⚠️ USING HARDCODED FALLBACK VALUES - NO ENVIRONMENT VARIABLES FOUND');
  source = 'hardcoded';
  return {
    supabaseUrl: FALLBACK_SUPABASE_URL,
    supabaseKey: FALLBACK_SUPABASE_ANON_KEY,
    source
  };
}

// Get the configuration with more detailed logging
const { supabaseUrl, supabaseKey, source } = getSupabaseConfig();

// Add visible error to DOM if we're in a browser and missing variables
if (typeof document !== 'undefined' && (!supabaseUrl || !supabaseKey)) {
  console.error('[SUPABASE] 🔴 CRITICAL ERROR: Missing Supabase credentials:', { 
    hasUrl: Boolean(supabaseUrl), 
    hasKey: Boolean(supabaseKey),
    source
  });
  
  // Add an error message to the DOM
  setTimeout(() => {
    try {
      if (document.body) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f8d7da;color:#721c24;padding:20px;text-align:center;font-family:sans-serif;z-index:9999;';
        errorDiv.innerHTML = '<strong>Supabase Connection Error:</strong> Missing environment variables. Using fallback credentials.';
        document.body.appendChild(errorDiv);
      }
    } catch (e) {
      console.error('[SUPABASE] Failed to add error message to DOM:', e);
    }
  }, 1000);
}

// Check for valid URL format before creating client
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  console.error('[SUPABASE] 🔴 INVALID URL FORMAT:', supabaseUrl);
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Must start with http:// or https://`);
}

// Validate key has reasonable length
if (supabaseKey && supabaseKey.length < 20) {
  console.error('[SUPABASE] 🔴 INVALID KEY FORMAT - too short:', supabaseKey.length, 'chars');
  throw new Error(`Invalid Supabase key format: Too short (${supabaseKey.length} chars)`);
}

// Create and export the client with robust error handling
try {
  console.log(`[SUPABASE] Creating client with URL: ${supabaseUrl ? (supabaseUrl.substring(0, 15) + '...') : 'MISSING'} (source: ${source})`);
  const client = createClient<Database>(supabaseUrl, supabaseKey);
  
  // Try minimal validation that client was created 
  if (!client || !client.auth) {
    throw new Error('Supabase client creation failed - client or client.auth is undefined');
  }
  
  // Assign to the module-level supabase variable
  supabase = client;
  
  // Log success
  console.log('[SUPABASE] ✅ Client initialized successfully');
} catch (error) {
  console.error('[SUPABASE] 🔴 CRITICAL ERROR creating Supabase client:', error);
  
  // Create a dummy client with methods that throw errors to prevent undefined errors
  supabase = {
    auth: {
      getSession: () => Promise.reject(new Error('Supabase client initialization failed')),
      getUser: () => Promise.reject(new Error('Supabase client initialization failed')),
      // Add other methods as needed to prevent undefined errors
    }
  } as any; // Type cast to Database to satisfy TypeScript
  
  // Try to show error message in DOM
  if (typeof document !== 'undefined') {
    setTimeout(() => {
      try {
        if (document.body) {
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f8d7da;color:#721c24;padding:20px;text-align:center;font-family:sans-serif;z-index:9999;';
          errorDiv.innerHTML = '<strong>Fatal Error:</strong> Failed to initialize Supabase client. Please check console for details.';
          document.body.appendChild(errorDiv);
        }
      } catch (e) {
        // Last resort - can't even add error to DOM
      }
    }, 1000);
  }
}