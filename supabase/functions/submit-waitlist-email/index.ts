
// Import from a URL instead of a package name for Deno compatibility
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../_shared/cors.ts';

// Handle CORS preflight requests
export const corsOptionsHandler = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a Supabase client with the Admin key
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

Deno.serve(async (req) => {
  console.log("Hello from Functions!");
  
  // Handle CORS preflight requests
  const corsResponse = corsOptionsHandler(req);
  if (corsResponse) return corsResponse;
  
  // Get the request method and ensure it's POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }
  
  try {
    // Get the request body
    const { email, source, marketingConsent, metadata } = await req.json();
    
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Check if the email is already subscribed
    const { data: existingSubscriber, error: queryError } = await supabaseAdmin
      .from('waitlist_subscribers')
      .select('id, email, created_at')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (queryError) {
      console.error('Error checking existing subscriber:', queryError);
      throw queryError;
    }
    
    // If already subscribed, return success but indicate already subscribed
    if (existingSubscriber) {
      return new Response(
        JSON.stringify({
          status: 'already_subscribed',
          message: 'You\'re already on our waitlist!'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert the new subscriber
    const { data, error } = await supabaseAdmin
      .from('waitlist_subscribers')
      .insert([
        {
          email: email.toLowerCase(),
          source: source || 'website',
          marketing_consent: !!marketingConsent,
          metadata: metadata || {}
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting subscriber:', error);
      throw error;
    }
    
    // Return success
    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Successfully joined the waitlist',
        subscriber: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in waitlist submission:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Server error processing waitlist submission',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
