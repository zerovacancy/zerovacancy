
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { Resend } from "https://esm.sh/resend@1.1.0"
import React from 'npm:react@18.2.0'
import { renderAsync } from 'npm:@react-email/render@0.0.7'

// Create a simple React email template for testing
const TestEmail = () => {
  return React.createElement('div', null, [
    React.createElement('h1', { key: 'header' }, 'Resend Test Email'),
    React.createElement('p', { key: 'paragraph1' }, 'This is a test email to verify the Resend integration.'),
    React.createElement('p', { key: 'paragraph2' }, 'If you received this email, the integration is working properly!'),
    React.createElement('p', { key: 'timestamp' }, `Sent at: ${new Date().toISOString()}`)
  ]);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      console.error('Missing environment variable: RESEND_API_KEY')
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing RESEND_API_KEY' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const requestData = await req.json()
    const { email } = requestData

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Testing Resend integration by sending email to: ${email}`)
    
    // Initialize Resend
    const resend = new Resend(resendApiKey)
    
    // Render the React Email template to HTML
    const emailHtml = await renderAsync(React.createElement(TestEmail))
    
    // Send the test email
    const emailResult = await resend.emails.send({
      from: 'ZeroVacancy <onboarding@resend.dev>',
      to: email,
      subject: 'Resend Integration Test',
      html: emailHtml,
    })
    
    console.log('Email test result:', emailResult)

    // Return success response
    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'Test email sent successfully',
        details: emailResult
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (err) {
    console.error('Error in test-resend function:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to send test email', details: err.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
