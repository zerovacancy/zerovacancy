// Simple Supabase client with clear fallback handling
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with straightforward fallbacks
function getSupabaseConfig() {
  // Priority 1: Check build-time injected variables
  let supabaseUrl = '';
  let supabaseKey = '';
  
  try {
    // First try build-time injected variables (import.meta.env)
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      console.log('[SUPABASE] Using build-time environment variables');
      return { supabaseUrl, supabaseKey };
    }
  } catch (err) {
    console.warn('[SUPABASE] Error accessing import.meta.env:', err);
  }
  
  // Priority 2: Check window.RUNTIME_ENV
  try {
    if (typeof window !== 'undefined' && window.RUNTIME_ENV) {
      supabaseUrl = window.RUNTIME_ENV.VITE_SUPABASE_URL;
      supabaseKey = window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log('[SUPABASE] Using window.RUNTIME_ENV variables');
        return { supabaseUrl, supabaseKey };
      }
    }
  } catch (err) {
    console.warn('[SUPABASE] Error accessing window.RUNTIME_ENV:', err);
  }
  
  // Priority 3: Use fallback values (only for development)
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[SUPABASE] Using fallback values (DEVELOPMENT ONLY)');
    return {
      supabaseUrl: 'https://pozblfzhjqlsxkakhowp.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM'
    };
  }
  
  // In production, if we get here, we have a problem
  console.error('[SUPABASE] No Supabase credentials available');
  return { supabaseUrl: '', supabaseKey: '' };
}

// Get the configuration
const { supabaseUrl, supabaseKey } = getSupabaseConfig();

// Create and export the client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Log initialization (but not credentials)
console.log(`[SUPABASE] Client initialized with URL: ${supabaseUrl ? (supabaseUrl.substring(0, 10) + '...') : 'MISSING'}`);