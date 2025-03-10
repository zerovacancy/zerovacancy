
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from "../_shared/cors.ts"
import { Resend } from "https://esm.sh/resend@1.1.0"
import React from 'npm:react@18.2.0'
import { renderAsync } from 'npm:@react-email/render@0.0.7'
import { WaitlistWelcomeEmail } from "./_templates/WaitlistWelcome.tsx"

serve(async (req) => {
  // Enhanced CORS handling
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 204
    })
  }

  // Log incoming request details for debugging
  console.log(`Received ${req.method} request to submit-waitlist-email`)
  
  try {
    // Environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? ''

    // Validate environment variables are set
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      return new Response(
        JSON.stringify({ error: 'Server configuration error', details: 'Missing database credentials' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!resendApiKey) {
      console.warn('Missing RESEND_API_KEY - will continue with waitlist signup but email notification will not be sent')
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body with improved error handling
    let requestData
    try {
      const contentType = req.headers.get('content-type') || ''
      
      // Log content type for debugging
      console.log(`Request content type: ${contentType}`)
      
      if (contentType.includes('application/json')) {
        // Safely parse the request body
        const text = await req.text()
        console.log(`Request body: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`)
        
        if (!text || !text.trim()) {
          return new Response(
            JSON.stringify({ error: 'Empty request body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
        
        try {
          requestData = JSON.parse(text)
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError)
          return new Response(
            JSON.stringify({ error: 'Invalid JSON format', details: jsonError.message }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      } else {
        return new Response(
          JSON.stringify({ error: `Unsupported content type: ${contentType}` }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
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

    // Extract and validate email and other data
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

    console.log(`Processing waitlist email: ${email} from source: ${source}`)

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
        console.log(`Duplicate email detected: ${email}`)
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

    // Send confirmation email if we have the API key
    let emailResult = null
    if (resendApiKey) {
      try {
        console.log(`Preparing to send confirmation email to ${email}`)
        const resend = new Resend(resendApiKey)

        // Render the React Email template to HTML
        console.log('Rendering email template')
        const emailHtml = await renderAsync(
          React.createElement(WaitlistWelcomeEmail, { userEmail: email })
        )
        console.log('Email template rendered successfully')

        // Send email with enhanced tracking
        emailResult = await resend.emails.send({
          from: 'ZeroVacancy <onboarding@resend.dev>',
          to: email,
          subject: 'Welcome to the ZeroVacancy Waitlist!',
          html: emailHtml,
          tags: [{ name: 'source', value: source }]
        })

        console.log('Email sent successfully:', JSON.stringify(emailResult))
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Continue with success response even if email sending fails
        // but include the error information in the response
        return new Response(
          JSON.stringify({
            status: 'success_with_email_error',
            message: 'Added to waitlist, but failed to send confirmation email',
            data,
            emailError: emailError.message
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    } else {
      console.warn('Skipping email sending: RESEND_API_KEY is not set')
    }

    // Return success response
    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Successfully added to waitlist',
        emailSent: !!emailResult,
        data,
        emailDetails: emailResult ? { id: emailResult.id } : null
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: err.message, stack: err.stack }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
