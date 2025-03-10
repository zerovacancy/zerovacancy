
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from "../_shared/cors.ts"
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

        // Generate HTML email template directly
        const userName = email.split('@')[0];
        const emailHtml = generateEmailTemplate(userName);
        console.log('Email template generated successfully')

        // Updated "from" address to use the verified domain
        const from = 'Team Zero <zero@zerovacancy.ai>'
        console.log(`Sending email from: ${from}`)

        // Send email with enhanced tracking
        emailResult = await resend.emails.send({
          from,
          to: email,
          subject: 'Welcome to the ZeroVacancy Waitlist!',
          html: emailHtml,
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

// Function to generate email HTML template
function generateEmailTemplate(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>ZeroVacancy Waitlist Confirmation</title>
        <style>
          body {
            background-color: #f5f5f5;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            word-spacing: normal;
            margin: 0;
            padding: 0;
          }
          .container {
            margin: 0 auto;
            padding: 20px 0 48px;
            max-width: 600px;
          }
          .logo-container {
            padding: 0;
            text-align: center;
          }
          .img-style {
            border: 0;
            display: block;
            outline: none;
            text-decoration: none;
            height: auto;
            width: 100%;
          }
          .divider {
            border-color: #E5E7EB;
            margin: 20px 0;
            border-top: 1px solid #E5E7EB;
          }
          .section {
            padding: 0 24px;
          }
          .heading {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            letter-spacing: -0.025em;
            line-height: 1.25;
            padding: 0;
            margin: 24px 0;
          }
          .paragraph {
            font-size: 16px;
            line-height: 1.5;
            color: #4B5563;
            margin: 16px 0;
          }
          .cta-section {
            text-align: center;
            margin: 32px 0;
          }
          .button {
            background-color: #1d4ed8;
            border-radius: 4px;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            text-align: center;
            display: inline-block;
            padding: 12px 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-container">
            <img 
              src="https://zerovacancy.ai/emaillogo.png" 
              width="600" 
              height="auto" 
              alt="ZeroVacancy" 
              class="img-style"
            />
          </div>
          
          <hr class="divider" />
          
          <div class="section">
            <h1 class="heading">Access Confirmed</h1>
            
            <p class="paragraph">
              Hello ${userName || ''},
            </p>
            
            <p class="paragraph">
              Your place in ZeroVacancy is secured. We've added you to our priority access list for when we open our doors.
            </p>
            
            <p class="paragraph">
              We're building something different—a select network connecting exceptional spaces with the visual creators who know how to capture their true potential.
            </p>
            
            <div class="cta-section">
              <a 
                href="https://www.zerovacancy.ai" 
                class="button"
              >
                Discover More
              </a>
            </div>

            <p class="paragraph">
              We're putting the finishing touches on our platform and will notify you when it's time to join. Your early interest gives you priority access to our curated talent pool.
            </p>

            <p class="paragraph">
              If you have questions or thoughts in the meantime, reply directly to this email. We value your perspective.
            </p>

            <p class="paragraph">
              Regards,<br />
              ZeroVacancy
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
