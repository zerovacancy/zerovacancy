// Direct Supabase client import without relying on env variables
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Hardcoded values for development
const SUPABASE_URL = 'https://pozblfzhjqlsxkakhowp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM';

// Log connection details
console.log('[SUPABASE DIRECT] Creating Supabase client with:', 
  `URL: ${SUPABASE_URL}`,
  'Anon Key: [HIDDEN]'
);

// Create and export the client
export const supabaseDirect = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export a simple function to test the connection
export async function testConnection() {
  try {
    const { data, error } = await supabaseDirect.auth.getSession();
    
    if (error) {
      console.error('[SUPABASE DIRECT] Connection test failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('[SUPABASE DIRECT] Connection test successful');
    return { success: true, data };
  } catch (err: any) {
    console.error('[SUPABASE DIRECT] Connection test error:', err.message);
    return { success: false, error: err.message };
  }
}