// Rate limiting middleware for Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// Simple in-memory rate limiting (will reset on function restart)
// For production use, consider using Redis or another persistent store
const ipRequests: Record<string, { count: number; lastReset: number }> = {};

interface RateLimitOptions {
  maxRequests?: number;      // Maximum requests allowed in the time window
  windowMs?: number;         // Time window in milliseconds
  keyGenerator?: (req: Request) => string; // Function to generate the rate limit key
}

const defaultOptions: RateLimitOptions = {
  maxRequests: 50,           // 50 requests by default
  windowMs: 60 * 1000,       // 1 minute window
  keyGenerator: (req: Request) => {
    // Default to IP-based rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? 
      forwarded.split(',')[0].trim() : 
      '127.0.0.1';
    return ip;
  }
};

/**
 * Checks if a request exceeds the rate limit
 * 
 * @param req - The incoming request
 * @param options - Rate limiting options
 * @returns Object with limited boolean and reset time
 */
export function checkRateLimit(
  req: Request, 
  options: RateLimitOptions = {}
): { limited: boolean; resetTime: number; remaining: number } {
  // Merge options with defaults
  const opts = { ...defaultOptions, ...options };
  const { maxRequests, windowMs, keyGenerator } = opts;
  
  // Generate the rate limit key (usually IP-based)
  const key = keyGenerator!(req);
  
  // Get the current time
  const now = Date.now();
  
  // Initialize or update the request tracker for this key
  if (!ipRequests[key]) {
    ipRequests[key] = { count: 0, lastReset: now };
  }
  
  // Check if we need to reset the counter
  if (now - ipRequests[key].lastReset > windowMs!) {
    ipRequests[key] = { count: 0, lastReset: now };
  }
  
  // Increment the request count
  ipRequests[key].count++;
  
  // Calculate remaining requests and reset time
  const remaining = Math.max(0, maxRequests! - ipRequests[key].count);
  const resetTime = ipRequests[key].lastReset + windowMs!;
  
  // Check if the rate limit is exceeded
  return {
    limited: ipRequests[key].count > maxRequests!,
    resetTime,
    remaining
  };
}

/**
 * Handles rate limit response
 * 
 * @param check - The result from checkRateLimit
 * @param corsHeaders - CORS headers to include in the response
 * @returns Response object if rate limited, null if not limited
 */
export function handleRateLimitResponse(
  check: { limited: boolean; resetTime: number; remaining: number },
  corsHeaders: Record<string, string>
): Response | null {
  if (check.limited) {
    const resetDate = new Date(check.resetTime).toUTCString();
    
    return new Response(
      JSON.stringify({ 
        error: 'Too many requests', 
        message: 'Please try again later' 
      }),
      {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': defaultOptions.maxRequests!.toString(),
          'X-RateLimit-Remaining': check.remaining.toString(),
          'X-RateLimit-Reset': resetDate,
          'Retry-After': Math.ceil((check.resetTime - Date.now()) / 1000).toString()
        }
      }
    );
  }
  return null;
}