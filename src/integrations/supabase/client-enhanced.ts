// Enhanced Supabase client with better error handling and connection management
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase connection constants
const SUPABASE_URL = "https://pozblfzhjqlsxkakhowp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM";

// Configuration options with enhanced timeouts and retries
const supabaseOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    timeout: 30000, // 30 seconds
    params: {
      eventsPerSecond: 5
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'zerovacancy-web'
    },
    fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
      // Set longer timeout for fetch operations
      const controller = new AbortController();
      const { signal } = controller;
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout
      
      return fetch(url, {
        ...options,
        signal,
        keepalive: true,
        // Don't use credentials:'include' as it requires specific CORS setup
        // Let Supabase handle auth credentials in its own way
      }).then(response => {
        clearTimeout(timeoutId);
        return response;
      }).catch(error => {
        clearTimeout(timeoutId);
        // Provide more helpful error message
        console.error('Fetch error in Supabase client:', error);
        
        // Rethrow with additional context
        throw new Error(`Supabase request failed: ${error.message || 'Unknown error'}`);
      });
    }
  }
};

// Create the client with options
export const supabaseEnhanced = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  supabaseOptions
);

// Export the standard client for backward compatibility
export const supabase = supabaseEnhanced;

// Helper function to check connection status
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabaseEnhanced.from('blog_categories').select('count').limit(1);
    return !error;
  } catch (e) {
    console.error('Supabase connection check failed:', e);
    return false;
  }
};

// Export additional utilities
export const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error';
  
  // Handle Supabase error object
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  if (error.details) return error.details;
  
  // Handle network errors
  if (error.code === 'ECONNREFUSED') return 'Database connection refused';
  if (error.code === 'ETIMEDOUT') return 'Database connection timed out';
  
  return 'Database error';
};