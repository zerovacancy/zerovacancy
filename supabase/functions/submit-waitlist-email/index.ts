
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from "../_shared/cors.ts"
import { Resend } from "https://esm.sh/resend@1.1.0"
import React from 'npm:react@18.2.0'
import { renderAsync } from 'npm:@react-email/render@0.0.7'
import { WaitlistWelcomeEmail } from "./_templates/WaitlistWelcome.tsx"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    // Use the service role key instead of the anon key to bypass RLS
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    if (!resendApiKey) {
      console.error('Missing environment variable: RESEND_API_KEY')
      // We can still proceed with the waitlist signup even if email sending fails
      console.warn('Will continue with waitlist signup but email notification will not be sent')
    }
    
    // Create client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Safely parse request body with error handling
    let requestData = {}
    try {
      // Check if the request has a body before trying to parse it
      const contentType = req.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        // Clone the request before consuming it to avoid issues
        const clonedReq = req.clone()
        const text = await clonedReq.text()
        
        // Only attempt to parse if we have non-empty text
        if (text && text.trim()) {
          try {
            requestData = JSON.parse(text)
          } catch (jsonError) {
            console.error('JSON parse error:', jsonError, 'Text:', text)
            throw new Error('Invalid JSON format')
          }
        } else {
          console.warn('Empty request body received')
        }
      } else {
        console.warn(`Unsupported content type: ${contentType}`)
      }
    } catch (parseError) {
      console.error('Error processing request body:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid request format', details: parseError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { email, source = 'waitlist', marketingConsent = true, metadata = {} } = requestData as any

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Submitting waitlist email: ${email} from source: ${source}`)

    // Add email to waitlist_subscribers table using service role client
    const { data, error } = await supabase
      .from('waitlist_subscribers')
      .insert([
        { 
          email, 
          source, 
          marketing_consent: marketingConsent,
          metadata
        }
      ])
      .select()

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ 
            status: 'already_subscribed',
            message: 'This email is already on our waitlist!' 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      console.error('Error inserting subscriber:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to add to waitlist', details: error }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send confirmation email if we have the API key and it's not a duplicate subscription
    let emailResult = null
    if (resendApiKey) {
      try {
        console.log(`Sending confirmation email to ${email}`)
        const resend = new Resend(resendApiKey)
        
        // Render the React Email template to HTML
        const emailHtml = await renderAsync(
          React.createElement(WaitlistWelcomeEmail, { userEmail: email })
        )
        
        emailResult = await resend.emails.send({
          from: 'ZeroVacancy <onboarding@resend.dev>',
          to: email,
          subject: 'Welcome to the ZeroVacancy Waitlist!',
          html: emailHtml,
        })
        
        console.log('Email sent successfully:', emailResult)
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Continue with the success response even if email sending fails
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'Successfully added to waitlist',
        emailSent: !!emailResult,
        data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: err.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
