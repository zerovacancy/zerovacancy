import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from "../_shared/cors.ts"
import { validateCsrf, handleCsrfResponse } from "../_shared/csrf.ts"
import { checkRateLimit, handleRateLimitResponse } from "../_shared/rate-limit.ts"
import { Resend } from "https://esm.sh/resend@1.1.0"

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
  
  // CSRF validation
  const csrfValidation = validateCsrf(req);
  const csrfResponse = handleCsrfResponse(csrfValidation, corsHeaders);
  if (csrfResponse) {
    return csrfResponse;
  }
  
  // Rate limiting - more restrictive for public endpoints
  const rateLimitCheck = checkRateLimit(req, {
    maxRequests: 20,        // 20 requests per minute
    windowMs: 60 * 1000     // 1 minute window
  });
  const rateLimitResponse = handleRateLimitResponse(rateLimitCheck, corsHeaders);
  if (rateLimitResponse) {
    return rateLimitResponse;
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

        // Get username from email
        const userName = email.split('@')[0];
        
        // Generate both HTML and plain text email templates
        const emailHtml = generateEmailTemplate(userName);
        const emailText = generatePlainTextEmailTemplate(userName);
        
        console.log('Email templates generated successfully')

        // Updated "from" address to use the verified domain
        const from = 'Team Zero <zero@zerovacancy.ai>'
        console.log(`Sending email from: ${from}`)

        // Send email with both HTML and plain text versions
        emailResult = await resend.emails.send({
          from,
          to: email,
          subject: 'Welcome to the ZeroVacancy Waitlist!',
          html: emailHtml,
          text: emailText, // Add plain text version
          tags: [{ name: 'source', value: source }]
        })

        // Log detailed response from Resend API
        console.log('Email send response:', JSON.stringify(emailResult))

        if (emailResult.error) {
          console.error('Resend API returned an error:', emailResult.error)
          
          // Check for domain verification issues
          if (emailResult.error.message?.includes('domain') || 
              emailResult.error.message?.includes('verify')) {
            console.error('Possible domain verification issue detected')
          }
          
          // Continue with success response for waitlist subscription, but include email error
          return new Response(
            JSON.stringify({
              status: 'success_with_email_error',
              message: 'Added to waitlist, but email could not be sent',
              data,
              emailError: emailResult.error
            }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        console.log('Email sent successfully with ID:', emailResult.id)
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

// Function to generate plain text email template
function generatePlainTextEmailTemplate(userName: string) {
  return `
Welcome to ZeroVacancy!

Thank you for joining the ZeroVacancy waitlist! We're excited to have you with us.

What happens next:
- You'll be among the first to know when we launch
- Exclusive early access to our platform
- Special launch pricing for waitlist members

We can't wait to connect you with top-tier content creators for your property marketing needs.

Visit our website: https://www.zerovacancy.ai

© 2025 ZeroVacancy. All rights reserved.
Terms of Service: https://www.zerovacancy.ai/terms
Privacy Policy: https://www.zerovacancy.ai/privacy
  `.trim();
}

// Function to generate email HTML template
function generateEmailTemplate(userName: string) {
  return `
    <center style="width: 100%; background-color: #f5f5f5; text-align: left;">
      <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
        Thank you for joining ZeroVacancy's waitlist! We're excited to have you with us.
      </div>
      <div class="email-container" style="max-width: 600px; margin: 0 auto;">
        <table style="margin: 0 auto;" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
          <tr>
            <td style="padding: 40px 0 30px 0; text-align: center; background-color: #f5f5f5;">
              <a href="https://www.zerovacancy.ai">
                <img style="height: auto; display: block; margin: 0 auto; border: 0; max-width: 300px;" width="300" alt="ZeroVacancy" src="https://www.zerovacancy.ai/logo.png">
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="mobile-padding" style="padding: 40px 30px 20px 30px; text-align: center;">
                    <h1 style="margin: 0; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 28px; line-height: 36px; color: #000000; font-weight: bold;">You're on the waitlist!</h1>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 0 30px 20px 30px;">
                    <p class="mobile-font" style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; text-align: center;">
                      Thank you for joining the ZeroVacancy waitlist! We're building the ultimate marketplace for property content that converts, captivates, and closes.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 0 30px 20px 30px;">
                    <p class="mobile-font" style="margin: 0 0 15px 0; font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; text-align: center; font-weight: bold;">
                      What happens next:
                    </p>
                    <table style="max-width: 400px; margin: 0 auto;" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="text-align: left; padding: 5px 0;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td style="vertical-align: top;" width="30">
                                <div style="background-color: #8A57DE; width: 8px; height: 8px; border-radius: 50%; margin-top: 8px;"></div>
                              </td>
                              <td class="mobile-font" style="font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                                You'll be among the first to know when we launch
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="text-align: left; padding: 5px 0;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td style="vertical-align: top;" width="30">
                                <div style="background-color: #8A57DE; width: 8px; height: 8px; border-radius: 50%; margin-top: 8px;"></div>
                              </td>
                              <td class="mobile-font" style="font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                                Exclusive early access to our platform
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="text-align: left; padding: 5px 0;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td style="vertical-align: top;" width="30">
                                <div style="background-color: #8A57DE; width: 8px; height: 8px; border-radius: 50%; margin-top: 8px;"></div>
                              </td>
                              <td class="mobile-font" style="font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                                Special launch pricing for waitlist members
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 0 30px 30px 30px;">
                    <p class="mobile-font" style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; text-align: center;">
                      We can't wait to connect you with top-tier content creators for your property marketing needs.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-padding" style="padding: 0 30px 40px 30px; text-align: center;">
                    <a style="background-color: #8A57DE; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 30px; color: #ffffff; border-radius: 4px; display: inline-block; mso-padding-alt: 0; text-underline-color: #8A57DE;" href="https://www.zerovacancy.ai">
                      <span style="mso-text-raise: 10pt;">Visit Our Website</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 0; text-align: center; background-color: #f5f5f5;">
              <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666666;">
                © 2025 ZeroVacancy. All rights reserved.
              </p>
              <p style="margin: 10px 0 0 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666666;">
                <a style="color: #666666; text-decoration: underline;" href="https://www.zerovacancy.ai/terms">Terms of Service</a> &nbsp;|&nbsp;
                <a style="color: #666666; text-decoration: underline;" href="https://www.zerovacancy.ai/privacy">Privacy Policy</a> &nbsp;|&nbsp;
                <a style="color: #666666; text-decoration: underline;" href="[Unsubscribe_Link]">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
    </center>
  `;
}

