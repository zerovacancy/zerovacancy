// CSRF protection middleware for Supabase Edge Functions

/**
 * Validates CSRF protection for incoming requests
 * 
 * @param req - The incoming request
 * @returns Object with valid boolean and optional error message
 */
export function validateCsrf(req: Request): { valid: boolean; error?: string } {
  // Get request origin and referer
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  
  // CSRF token from custom header
  const csrfToken = req.headers.get('x-csrf-token');
  
  // Get allowed origins from environment variable or use defaults
  const allowedOriginsStr = Deno.env.get('ALLOWED_ORIGINS') || 'https://zerovacancy.ai,https://www.zerovacancy.ai';
  const allowedOrigins = allowedOriginsStr.split(',');
  
  // Allow local development
  if (Deno.env.get('ENVIRONMENT') === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:5173');
  }
  
  // In production, enforce CSRF protection
  if (Deno.env.get('ENVIRONMENT') === 'production') {
    // If no origin or referer is provided
    if (!origin && !referer) {
      return { valid: false, error: 'Missing origin and referer headers' };
    }
    
    // Check if origin is allowed
    if (origin && !allowedOrigins.includes(origin)) {
      return { valid: false, error: 'Invalid origin' };
    }
    
    // Check referer if present
    if (referer) {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      if (!allowedOrigins.includes(refererOrigin)) {
        return { valid: false, error: 'Invalid referer' };
      }
    }
    
    // If using token-based CSRF protection, validate the token
    if (Deno.env.get('USE_CSRF_TOKEN') === 'true' && !csrfToken) {
      return { valid: false, error: 'Missing CSRF token' };
    }
  }
  
  return { valid: true };
}

/**
 * Handles CSRF response based on validation result
 * 
 * @param validation - The validation result from validateCsrf
 * @param corsHeaders - CORS headers to include in the response
 * @returns Response object if validation failed, null if passed
 */
export function handleCsrfResponse(
  validation: { valid: boolean; error?: string },
  corsHeaders: Record<string, string>
): Response | null {
  if (!validation.valid) {
    console.error('CSRF validation failed:', validation.error);
    return new Response(
      JSON.stringify({ 
        error: 'CSRF validation failed', 
        message: validation.error 
      }),
      {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  return null;
}