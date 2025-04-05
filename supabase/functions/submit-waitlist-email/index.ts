
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
    const { 
      email, 
      source = 'waitlist', 
      marketingConsent = true, 
      metadata = {},
      userType = 'property_owner' // Default user type
    } = requestData as any

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

    console.log(`Processing waitlist email: ${email} from source: ${source}, user type: ${userType}`)

    // Add email to waitlist_subscribers table using service role client
    const { data, error } = await supabase
      .from('waitlist_subscribers')
      .insert([
        {
          email,
          source,
          marketing_consent: marketingConsent,
          metadata,
          user_type: userType
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
        console.log(`Preparing to send confirmation email to ${email} (user type: ${userType})`)
        const resend = new Resend(resendApiKey)

        // Get username from email
        const userName = email.split('@')[0];
        
        // Generate both HTML and plain text email templates based on user type
        const emailHtml = userType === 'creator' 
          ? generateCreatorEmailTemplate(userName)
          : generateEmailTemplate(userName);
          
        const emailText = userType === 'creator'
          ? generateCreatorPlainTextEmailTemplate(userName)
          : generatePlainTextEmailTemplate(userName);
        
        console.log('Email templates generated successfully for user type:', userType)

        // Updated "from" address to use the verified domain
        const from = 'Team Zero <zero@zerovacancy.ai>'
        console.log(`Sending email from: ${from}`)

        // Send email with both HTML and plain text versions
        emailResult = await resend.emails.send({
          from,
          to: email,
          subject: userType === 'creator' 
            ? 'Welcome to the ZeroVacancy Creator Waitlist!' 
            : 'Welcome to the ZeroVacancy Waitlist!',
          html: emailHtml,
          text: emailText, // Add plain text version
          tags: [
            { name: 'source', value: source },
            { name: 'user_type', value: userType }
          ]
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
        userType,
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

// Function to generate plain text email template for property owners
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

© 2024 ZeroVacancy. All rights reserved.
Terms of Service: https://www.zerovacancy.ai/terms
Privacy Policy: https://www.zerovacancy.ai/privacy

If you'd like to unsubscribe, reply to this email with "unsubscribe" in the subject line.
  `.trim();
}

// Function to generate plain text email template for creators
function generateCreatorPlainTextEmailTemplate(userName: string) {
  return `
Join Our Creator Network at ZeroVacancy!

Thank you for your interest in joining ZeroVacancy as a content creator! We're building the premier marketplace for real estate content professionals.

What happens next:
- You'll be among the first content creators invited to join our platform
- Gain access to a steady stream of quality clients
- Keep more of your earnings with our creator-friendly commission structure

We're excited to showcase your talents to property owners who value high-quality content.

Visit our website: https://www.zerovacancy.ai

© 2024 ZeroVacancy. All rights reserved.
Terms of Service: https://www.zerovacancy.ai/terms
Privacy Policy: https://www.zerovacancy.ai/privacy

If you'd like to unsubscribe, reply to this email with "unsubscribe" in the subject line.
  `.trim();
}

// Function to generate email HTML template for property owners
function generateEmailTemplate(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to ZeroVacancy - Property Marketing Made Simple</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <style type="text/css">
        @media screen {
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            src: url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_0ew.woff) format('woff');
          }
          @font-face {
            font-family: 'Space Grotesk';
            font-style: normal;
            font-weight: 700;
            src: url(https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff) format('woff');
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: #f6f5ff;
        }
        
        .content {
          margin: 0;
          padding: 0;
        }
        
        img {
          border: 0;
          line-height: 100%;
          vertical-align: middle;
        }
        
        table {
          border-collapse: collapse;
        }
        
        h1, h2, h3 {
          font-family: 'Space Grotesk', Arial, sans-serif;
        }
        
        .mobile-hide {
          display: none !important;
        }
        
        @media screen and (min-width: 601px) {
          .container {
            width: 600px !important;
          }
          
          .mobile-hide {
            display: block !important;
          }
          
          .mobile-show {
            display: none !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; background-color: #f6f5ff;">
      <div style="display: none; line-height: 0; font-size: 0;">🏠 Welcome to ZeroVacancy! Your waitlist spot is confirmed. You're joining property teams connecting with top-tier content creators.</div>
      
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; width: 100%; background-color: #f6f5ff;">
        <tr>
          <td align="center" style="vertical-align: top; padding: 20px 0;">
            <!--[if mso]>
            <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td>
            <![endif]-->
            
            <!-- Email Container: 600px max-width -->
            <table class="container" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; padding: 0; max-width: 600px; background-color: #f6f5ff;">
              
              <!-- Logo Header -->
              <tr>
                <td style="padding: 0 15px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" style="padding: 25px 0 15px;">
                        <!-- Logo Container -->
                        <div style="position: relative; padding: 24px 0; border-radius: 16px; background-color: #F9F6FF;">
                          <!-- Logo -->
                          <img src="https://www.zerovacancy.ai/logo.png" width="180" alt="ZeroVacancy" style="display: block; height: auto; margin: 0 auto; border: 0;">
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Main Content Container -->
              <tr>
                <td style="padding: 0 15px;">
                  <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(103, 65, 217, 0.15);">
                    
                    <!-- Header section with background image -->
                    <a href="https://www.zerovacancy.ai" style="text-decoration: none; display: block;">
                      <div style="overflow: hidden; border-top-left-radius: 16px; border-top-right-radius: 16px;">
                        <img src="https://www.zerovacancy.ai/og-image-email.png" alt="ZeroVacancy" width="600" style="width: 100%; display: block; border: 0;">
                      </div>
                    </a>
                    
                    <!-- White content area -->
                    <div style="padding: 20px 30px;">
                      <h1 style="margin: 0 0 18px 0; color: #6741d9; text-align: center; font-size: 32px; line-height: 1.1; font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif; font-weight: 700;">YOU'RE ON THE WAITLIST!</h1>
                      
                      <p style="margin: 0 0 20px 0; font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 26px; color: #333333; text-align: center;">
                        Thank you for joining the ZeroVacancy waitlist! We're building the ultimate marketplace for property content that 
                        <span style="color: #6741d9; font-weight: 600;">converts</span>, 
                        <span style="color: #8a57de; font-weight: 600;">captivates</span>, and 
                        <span style="color: #8a57de; font-weight: 600;">closes</span>.
                      </p>
                      
                      <!-- Three benefits boxes -->
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 25px;">
                        <tr>
                          <!-- Box 1 -->
                          <td width="33.33%" style="padding: 0 5px;">
                            <div style="background-color: #f9f8ff; border-radius: 12px; padding: 20px 15px; text-align: center; border: 1px solid #eeeaf9;">
                              <div style="margin-bottom: 10px; display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #6741d9 0%, #8a57de 100%); border-radius: 50%; text-align: center; line-height: 48px; color: white; font-weight: bold; font-size: 20px;">1</div>
                              <h3 style="margin: 0 0 5px 0; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 16px; color: #6741d9; font-weight: 600;">Early Access</h3>
                              <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #666;">First to know when we launch</p>
                            </div>
                          </td>
                          
                          <!-- Box 2 -->
                          <td width="33.33%" style="padding: 0 5px;">
                            <div style="background-color: #f9f8ff; border-radius: 12px; padding: 20px 15px; text-align: center; border: 1px solid #eeeaf9;">
                              <div style="margin-bottom: 10px; display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #6741d9 0%, #8a57de 100%); border-radius: 50%; text-align: center; line-height: 48px; color: white; font-weight: bold; font-size: 20px;">2</div>
                              <h3 style="margin: 0 0 5px 0; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 16px; color: #6741d9; font-weight: 600;">Premium Content</h3>
                              <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #666;">Top-tier content creators</p>
                            </div>
                          </td>
                          
                          <!-- Box 3 -->
                          <td width="33.33%" style="padding: 0 5px;">
                            <div style="background-color: #f9f8ff; border-radius: 12px; padding: 20px 15px; text-align: center; border: 1px solid #eeeaf9;">
                              <div style="margin-bottom: 10px; display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #6741d9 0%, #8a57de 100%); border-radius: 50%; text-align: center; line-height: 48px; color: white; font-weight: bold; font-size: 20px;">3</div>
                              <h3 style="margin: 0 0 5px 0; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 16px; color: #6741d9; font-weight: 600;">Special Pricing</h3>
                              <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #666;">Exclusive waitlist discounts</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Testimonial box -->
                      <div style="margin: 0 auto 25px auto; background-color: #f9f8ff; border-radius: 12px; padding: 25px; border-left: 4px solid #6741d9; position: relative;">
                        <!-- Quote mark -->
                        <div style="position: absolute; top: 15px; left: 20px; font-size: 40px; color: #d4ccea; font-family: Georgia, serif; line-height: 1;">"</div>
                        
                        <p style="margin: 0 0 10px 0; font-family: 'Inter', Arial, sans-serif; font-size: 15px; line-height: 24px; color: #333; padding-left: 20px; font-style: italic;">
                          I'm excited to join ZeroVacancy because finding quality content creators for my properties has always been challenging. Looking forward to the launch!
                        </p>
                        <p style="margin: 0; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 14px; font-weight: 600; color: #6741d9; padding-left: 20px;">
                          — Sarah T., Property Manager
                        </p>
                      </div>
                      
                      <!-- CTA button -->
                      <div style="text-align: center; margin: 30px 0 20px 0;">
                        <a href="https://www.zerovacancy.ai" style="display: inline-block; background: linear-gradient(135deg, #6741d9 0%, #8a57de 100%); padding: 16px 32px; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 16px; font-weight: 600; color: white; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 10px rgba(138, 87, 222, 0.3);">
                          Visit Our Website →
                        </a>
                        <p style="margin: 15px 0 0 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; color: #666666; text-align: center;">
                          We'll notify you when we're ready to launch
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              
              <!-- Footer Section -->
              <tr>
                <td style="padding: 30px 15px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <!-- Company Info -->
                    <tr>
                      <td style="padding: 0 0 15px; text-align: center;">
                        <a href="https://www.zerovacancy.ai" style="display: inline-block; margin-bottom: 15px; text-decoration: none;">
                          <img src="https://www.zerovacancy.ai/logo.png" width="180" alt="ZeroVacancy" style="border: 0;">
                        </a>
                        <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #666; font-weight: 500;">
                          Connecting property teams with top-tier content creators
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Social Links -->
                    <tr>
                      <td style="padding: 0 0 15px; text-align: center;">
                        <a href="https://twitter.com/zerovacancy" style="display: inline-block; margin: 0 5px; text-decoration: none;">
                          <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png" width="24" height="24" alt="Twitter" style="border: 0;">
                        </a>
                        <a href="https://instagram.com/zerovacancy" style="display: inline-block; margin: 0 5px; text-decoration: none;">
                          <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/instagram_circle-512.png" width="24" height="24" alt="Instagram" style="border: 0;">
                        </a>
                        <a href="https://linkedin.com/company/zerovacancy" style="display: inline-block; margin: 0 5px; text-decoration: none;">
                          <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/linkedin_circle-512.png" width="24" height="24" alt="LinkedIn" style="border: 0;">
                        </a>
                      </td>
                    </tr>
                    
                    <!-- Copyright & Legal -->
                    <tr>
                      <td style="padding: 0; text-align: center;">
                        <p style="margin: 0 0 10px; font-family: 'Inter', Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #888888;">
                          &copy; 2025 ZeroVacancy. All rights reserved.
                        </p>
                        <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #888888;">
                          <a href="https://www.zerovacancy.ai/terms" target="_blank" style="color: #6741d9; text-decoration: none; font-weight: 500; margin: 0 5px;">Terms</a> • 
                          <a href="https://www.zerovacancy.ai/privacy" target="_blank" style="color: #6741d9; text-decoration: none; font-weight: 500; margin: 0 5px;">Privacy</a> • 
                          <a href="[Unsubscribe_Link]" target="_blank" style="color: #6741d9; text-decoration: none; font-weight: 500; margin: 0 5px;">Unsubscribe</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Function to generate email HTML template for creators
function generateCreatorEmailTemplate(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to ZeroVacancy - Join Our Creator Network</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <style type="text/css">
        @media screen {
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            src: url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_0ew.woff) format('woff');
          }
          @font-face {
            font-family: 'Space Grotesk';
            font-style: normal;
            font-weight: 700;
            src: url(https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff) format('woff');
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: #F5F0FF;
        }
        
        .content {
          margin: 0;
          padding: 0;
        }
        
        img {
          border: 0;
          line-height: 100%;
          vertical-align: middle;
        }
        
        table {
          border-collapse: collapse;
        }
        
        h1, h2, h3 {
          font-family: 'Space Grotesk', Arial, sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', Arial, sans-serif;
        }
        
        .font-space {
          font-family: 'Space Grotesk', Arial, sans-serif;
        }
        
        .mobile-hide {
          display: none !important;
        }
        
        @media screen and (min-width: 601px) {
          .container {
            width: 600px !important;
          }
          
          .mobile-hide {
            display: block !important;
          }
          
          .mobile-show {
            display: none !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; background-color: #F5F0FF;">
      <div style="display: none; line-height: 0; font-size: 0;">You're invited to join ZeroVacancy as a creator! Connect with property owners looking for your content creation talents.</div>
      
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; width: 100%; background-color: #F5F0FF;">
        <tr>
          <td align="center" style="vertical-align: top; padding: 20px 0;">
            <!--[if mso]>
            <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td>
            <![endif]-->
            
            <!-- Email Container: 600px max-width -->
            <table class="container" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; padding: 0; max-width: 600px; background-color: #F5F0FF;">
              
              <!-- Logo Header -->
              <tr>
                <td style="padding: 0 15px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" style="padding: 25px 0 15px;">
                        <!-- Logo Container -->
                        <div style="position: relative; padding: 24px 0; border-radius: 16px; background-color: #F9F6FF;">
                          <!-- Logo Container -->
                          <img src="https://www.zerovacancy.ai/logo.png" width="240" alt="ZeroVacancy" style="display: block; height: auto; margin: 0 auto; border: 0;">
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Main Content Container -->
              <tr>
                <td style="padding: 0 15px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(138, 87, 222, 0.08);">
                    
                    <!-- Hero Section -->
                    <tr>
                      <td>
                        <div style="position: relative; text-align: center; padding: 40px 30px 30px; background: linear-gradient(135deg, #F8F5FF 0%, #F0E9FF 100%);">
                          <!-- Headline with highlight effect -->
                          <h1 style="margin: 0 0 15px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 32px; line-height: 1.1; color: #2D1A66; font-weight: 800; letter-spacing: -0.02em;">
                            <span style="display: block;">JOIN OUR</span>
                            <span style="display: inline-block; position: relative; padding: 0 5px;">
                              <span style="position: relative; z-index: 1;">CREATOR NETWORK!</span>
                              <span style="position: absolute; bottom: 4px; left: 0; right: 0; height: 10px; background-color: rgba(138, 87, 222, 0.2); border-radius: 5px; z-index: 0;"></span>
                            </span>
                          </h1>
                          
                          <!-- Creator count badge -->
                          <div style="display: inline-block; padding: 8px 16px; background-color: rgba(138, 87, 222, 0.15); border-radius: 30px; margin-top: 5px;">
                            <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #5425B3; font-weight: 600;">
                              <span style="font-weight: 700;">500+</span> creators already on the waitlist
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Main Content Section -->
                    <tr>
                      <td style="padding: 30px 30px 25px;">
                        <!-- Welcome Message -->
                        <p style="margin: 0 0 20px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #45455A; text-align: center;">
                          Thank you for your interest in joining ZeroVacancy as a content creator! We're building the premier marketplace for property marketing professionals like you to 
                          <span style="color: #5425B3; font-weight: 600;">connect</span>, 
                          <span style="color: #7928CA; font-weight: 600;">grow</span>, and 
                          <span style="color: #3151D3; font-weight: 600;">thrive</span>.
                        </p>
                        
                        <!-- Feature Cards Section -->
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <!-- Card 1: More Clients -->
                            <td width="33.33%" style="padding: 5px;">
                              <div style="background-color: #F9F7FF; border-radius: 10px; padding: 15px 10px; text-align: center; height: 100%;">
                                <!-- Title -->
                                <p style="margin: 0 0 5px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #2D1A66;">Steady Clients</p>
                                <!-- Description -->
                                <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #5A5A72;">Access quality property clients</p>
                              </div>
                            </td>
                            
                            <!-- Card 2: Better Earnings -->
                            <td width="33.33%" style="padding: 5px;">
                              <div style="background-color: #F9F7FF; border-radius: 10px; padding: 15px 10px; text-align: center; height: 100%;">
                                <!-- Title -->
                                <p style="margin: 0 0 5px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #2D1A66;">Fair Earnings</p>
                                <!-- Description -->
                                <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #5A5A72;">Creator-friendly commission</p>
                              </div>
                            </td>
                            
                            <!-- Card 3: Platform Tools -->
                            <td width="33.33%" style="padding: 5px;">
                              <div style="background-color: #F9F7FF; border-radius: 10px; padding: 15px 10px; text-align: center; height: 100%;">
                                <!-- Title -->
                                <p style="margin: 0 0 5px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #2D1A66;">Business Tools</p>
                                <!-- Description -->
                                <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #5A5A72;">Simplified booking & payments</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Why Join Section -->
                    <tr>
                      <td style="padding: 0 30px 25px;">
                        <h2 style="margin: 0 0 15px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px; color: #2D1A66; font-weight: 700; text-align: center;">
                          Why Join ZeroVacancy?
                        </h2>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td style="padding: 10px;">
                              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #F9F7FF; border-radius: 10px; padding: 15px;">
                                <tr>
                                  <td style="width: 30px; vertical-align: top; padding-right: 12px;">
                                    <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #8A57DE; color: white; text-align: center; line-height: 24px; font-weight: bold;">1</div>
                                  </td>
                                  <td>
                                    <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #45455A;">
                                      <strong>Showcase Your Portfolio:</strong> Build a professional profile that highlights your best work to stand out to property owners.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 10px;">
                              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #F9F7FF; border-radius: 10px; padding: 15px;">
                                <tr>
                                  <td style="width: 30px; vertical-align: top; padding-right: 12px;">
                                    <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #8A57DE; color: white; text-align: center; line-height: 24px; font-weight: bold;">2</div>
                                  </td>
                                  <td>
                                    <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #45455A;">
                                      <strong>Grow Your Business:</strong> Get matched with clients seeking your specific skills - photography, videography, 3D tours, and more.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 10px;">
                              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #F9F7FF; border-radius: 10px; padding: 15px;">
                                <tr>
                                  <td style="width: 30px; vertical-align: top; padding-right: 12px;">
                                    <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #8A57DE; color: white; text-align: center; line-height: 24px; font-weight: bold;">3</div>
                                  </td>
                                  <td>
                                    <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #45455A;">
                                      <strong>Get Paid Promptly:</strong> Receive payments faster through our secure platform with transparent, creator-friendly fees.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Primary CTA Button -->
                    <tr>
                      <td style="padding: 0 30px 40px; text-align: center;">
                        <!-- Button Container -->
                        <div>
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.zerovacancy.ai" style="height:52px;v-text-anchor:middle;width:240px;" arcsize="25%" stroke="f" fillcolor="#8A57DE">
                            <w:anchorlock/>
                            <center>
                          <![endif]-->
                          <a href="https://www.zerovacancy.ai" target="_blank" style="display: inline-block; padding: 16px 35px; color: #FFFFFF; background: linear-gradient(to right, #8A57DE, #6366F1); border-radius: 8px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; text-decoration: none; text-align: center; min-width: 170px; box-shadow: 0 4px 11px rgba(138, 87, 222, 0.25);">
                            Visit Our Website
                            <span style="display: inline-block; margin-left: 5px;">&rarr;</span>
                          </a>
                          <!--[if mso]>
                            </center>
                          </v:roundrect>
                          <![endif]-->
                        </div>
                        
                        <!-- Secondary message -->
                        <p style="margin: 15px 0 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #6E6E87;">
                          We'll notify you when we're ready to onboard creators
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer Section -->
              <tr>
                <td style="padding: 30px 15px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <!-- Company Info -->
                    <tr>
                      <td style="padding: 0 0 15px; text-align: center;">
                        <img src="https://www.zerovacancy.ai/logo.png" width="150" alt="ZeroVacancy" style="display: block; height: auto; margin: 0 auto 10px; border: 0;">
                        <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #6E6E87;">
                          Connecting talented creators with property owners
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Copyright & Legal -->
                    <tr>
                      <td style="padding: 0; text-align: center;">
                        <p style="margin: 0 0 10px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #8894A8;">
                          &copy; 2024 ZeroVacancy. All rights reserved.
                        </p>
                        
                        <table align="center" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <!-- Terms -->
                            <td style="padding: 0 8px;">
                              <a href="https://www.zerovacancy.ai/terms" target="_blank" style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #5425B3; text-decoration: none;">
                                Terms
                              </a>
                            </td>
                            
                            <!-- Privacy -->
                            <td style="padding: 0 8px;">
                              <a href="https://www.zerovacancy.ai/privacy" target="_blank" style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #5425B3; text-decoration: none;">
                                Privacy
                              </a>
                            </td>
                            
                            <!-- Unsubscribe -->
                            <td style="padding: 0 8px;">
                              <a href="mailto:unsubscribe@zerovacancy.ai?subject=Unsubscribe%20from%20waitlist" target="_blank" style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #5425B3; text-decoration: none;">
                                Unsubscribe
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
