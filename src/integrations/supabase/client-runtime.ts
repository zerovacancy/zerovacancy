// Runtime-safe Supabase client that checks multiple sources for credentials
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with multiple fallbacks
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

// Priority 1: Check window.env (runtime injected values)
if (typeof window !== 'undefined' && window.env) {
  SUPABASE_URL = window.env.VITE_SUPABASE_URL || '';
  SUPABASE_ANON_KEY = window.env.VITE_SUPABASE_ANON_KEY || '';
  console.log('[SUPABASE] Using window.env for Supabase config');
}

// Priority 2: Check import.meta.env (build-time variables)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  try {
    SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
    SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    console.log('[SUPABASE] Using import.meta.env for Supabase config');
  } catch (err) {
    console.warn('[SUPABASE] Error accessing import.meta.env:', err);
  }
}

// Priority 3: Use hardcoded values as last resort
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[SUPABASE] Using hardcoded values for Supabase config - ONLY USE IN DEVELOPMENT');
  SUPABASE_URL = 'https://pozblfzhjqlsxkakhowp.supabase.co';
  SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM';
}

// Log the URL being used (but not the key for security)
console.log('[SUPABASE] Using URL:', SUPABASE_URL.substring(0, 30) + '...');

// Now create the client
export const supabaseRuntime = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection function
export async function testRuntimeConnection() {
  try {
    const { data, error } = await supabaseRuntime.auth.getSession();
    
    if (error) {
      console.error('[SUPABASE] Runtime connection test failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('[SUPABASE] Runtime connection test successful');
    return { success: true, data };
  } catch (err: any) {
    console.error('[SUPABASE] Runtime connection error:', err.message);
    return { success: false, error: err.message };
  }
}