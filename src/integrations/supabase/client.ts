// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Safely extract environment variables with multiple fallbacks
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

// First try with import.meta.env
try {
  SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
  SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  // Log debug info to help diagnose issues
  console.log('Supabase URL from import.meta.env:', SUPABASE_URL ? 'Found' : 'Not found');
  console.log('Supabase key from import.meta.env:', SUPABASE_ANON_KEY ? 'Found' : 'Not found');
} catch (err) {
  console.warn('Error accessing import.meta.env:', err);
}

// If still not set, try with process.env (for SSR contexts)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  try {
    if (typeof process !== 'undefined' && process.env) {
      SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
      SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
      console.log('Trying process.env fallback for Supabase config');
    }
  } catch (err) {
    console.warn('Error accessing process.env:', err);
  }
}

// Last resort - use hardcoded test values for development only
if ((!SUPABASE_URL || !SUPABASE_ANON_KEY) && 
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))) {
  console.warn('Using development fallback for Supabase config - ONLY FOR LOCAL TESTING');
  SUPABASE_URL = 'https://pozblfzhjqlsxkakhowp.supabase.co';
  SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM';
}

// Validate environment variables 
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const error = 'Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.';
  console.error(error);
  // In development, display a more helpful message
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    console.error('Solution: Add these to your .env file:');
    console.error('VITE_SUPABASE_URL=https://pozblfzhjqlsxkakhowp.supabase.co');
    console.error('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM');
  }
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);