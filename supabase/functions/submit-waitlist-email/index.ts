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

© 2025 ZeroVacancy. All rights reserved.
Terms of Service: https://www.zerovacancy.ai/terms
Privacy Policy: https://www.zerovacancy.ai/privacy
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

© 2025 ZeroVacancy. All rights reserved.
Terms of Service: https://www.zerovacancy.ai/terms
Privacy Policy: https://www.zerovacancy.ai/privacy
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
    </head>
    <body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; background-color: #F5F0FF;">
      <div style="display: none; line-height: 0; font-size: 0;">You're on the ZeroVacancy waitlist! Connect with talented property content creators to boost your listings.</div>
      
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
              
              <!-- Logo Header with Platform Pattern -->
              <tr>
                <td style="padding: 0 15px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" style="padding: 25px 0 15px;">
                        <!-- Pattern Background -->
                        <div style="position: relative; padding: 24px 0; border-radius: 16px; background-color: #F9F6FF; background-image: url('https://www.zerovacancy.ai/email-assets/pattern-bg.png'); background-size: cover; background-position: center;">
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
                    
                    <!-- Hero Section with Property Illustration -->
                    <tr>
                      <td>
                        <div style="position: relative; text-align: center; padding: 40px 30px 30px; background: linear-gradient(135deg, #F8F5FF 0%, #F0E9FF 100%);">
                          <!-- Decorative building icons -->
                          <div style="position: absolute; top: 20px; left: 20px; width: 32px; height: 32px; opacity: 0.7;">
                            <img src="https://www.zerovacancy.ai/email-assets/building-icon-1.png" width="32" alt="" style="display: block; max-width: 100%; height: auto;">
                          </div>
                          <div style="position: absolute; bottom: 20px; right: 20px; width: 32px; height: 32px; opacity: 0.7;">
                            <img src="https://www.zerovacancy.ai/email-assets/building-icon-2.png" width="32" alt="" style="display: block; max-width: 100%; height: auto;">
                          </div>
                          
                          <!-- Headline with animated highlight effect -->
                          <h1 style="margin: 0 0 15px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 32px; line-height: 1.1; color: #2D1A66; font-weight: 800; letter-spacing: -0.02em;">
                            <span style="display: block;">YOU'RE ON THE</span>
                            <span style="display: inline-block; position: relative; padding: 0 5px;">
                              <span style="position: relative; z-index: 1;">WAITLIST!</span>
                              <span style="position: absolute; bottom: 4px; left: 0; right: 0; height: 10px; background-color: rgba(138, 87, 222, 0.2); border-radius: 5px; z-index: 0;"></span>
                            </span>
                          </h1>
                          
                          <!-- Property marketing illustration -->
                          <div style="margin: 20px 0; text-align: center;">
                            <img src="https://www.zerovacancy.ai/email-assets/property-marketing-illustration.png" width="260" alt="Property Marketing" style="display: inline-block; max-width: 260px; height: auto; margin: 0 auto; border: 0;">
                          </div>
                          
                          <!-- Waitlist count badge -->
                          <div style="display: inline-block; padding: 8px 16px; background-color: rgba(138, 87, 222, 0.15); border-radius: 30px; margin-top: 5px;">
                            <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #5425B3; font-weight: 600;">
                              <span style="font-weight: 700;">2,100+</span> property teams already joined
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
                          Thank you for joining the ZeroVacancy waitlist! We're building the ultimate marketplace for property content that 
                          <span style="color: #5425B3; font-weight: 600;">converts</span>, 
                          <span style="color: #7928CA; font-weight: 600;">captivates</span>, and 
                          <span style="color: #3151D3; font-weight: 600;">closes</span>.
                        </p>
                        
                        <!-- Feature Cards Section -->
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <!-- Card 1: Early Access -->
                            <td width="33.33%" style="padding: 5px;">
                              <div style="background-color: #F9F7FF; border-radius: 10px; padding: 15px 10px; text-align: center; height: 100%;">
                                <!-- Icon -->
                                <div style="margin-bottom: 10px;">
                                  <img src="https://www.zerovacancy.ai/email-assets/calendar-icon.png" width="36" alt="Early Access" style="display: inline-block; height: auto; border: 0;">
                                </div>
                                <!-- Title -->
                                <p style="margin: 0 0 5px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #2D1A66;">Early Access</p>
                                <!-- Description -->
                                <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #5A5A72;">First to know when we launch</p>
                              </div>
                            </td>
                            
                            <!-- Card 2: Premium Content -->
                            <td width="33.33%" style="padding: 5px;">
                              <div style="background-color: #F9F7FF; border-radius: 10px; padding: 15px 10px; text-align: center; height: 100%;">
                                <!-- Icon -->
                                <div style="margin-bottom: 10px;">
                                  <img src="https://www.zerovacancy.ai/email-assets/camera-icon.png" width="36" alt="Premium Content" style="display: inline-block; height: auto; border: 0;">
                                </div>
                                <!-- Title -->
                                <p style="margin: 0 0 5px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #2D1A66;">Premium Content</p>
                                <!-- Description -->
                                <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #5A5A72;">Top-tier content creators</p>
                              </div>
                            </td>
                            
                            <!-- Card 3: Special Pricing -->
                            <td width="33.33%" style="padding: 5px;">
                              <div style="background-color: #F9F7FF; border-radius: 10px; padding: 15px 10px; text-align: center; height: 100%;">
                                <!-- Icon -->
                                <div style="margin-bottom: 10px;">
                                  <img src="https://www.zerovacancy.ai/email-assets/price-icon.png" width="36" alt="Special Pricing" style="display: inline-block; height: auto; border: 0;">
                                </div>
                                <!-- Title -->
                                <p style="margin: 0 0 5px; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #2D1A66;">Special Pricing</p>
                                <!-- Description -->
                                <p style="margin: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #5A5A72;">Exclusive waitlist discounts</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Featured Creators Preview -->
                    <tr>
                      <td style="padding: 0 30px 30px;">
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius: 10px; overflow: hidden; border: 1px solid #F0E9FF;">
                          <!-- Section Header -->
                          <tr>
                            <td style="background-color: #F5F0FF; padding: 12px 15px;">
                              <h3 style="margin: 0; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #2D1A66; font-weight: 700;">Featured Creators on ZeroVacancy</h3>
                            </td>
                          </tr>
                          
                          <!-- Creator Gallery -->
                          <tr>
                            <td style="padding: 15px; background-color: #FFFFFF;">
                              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                  <!-- Creator 1 -->
                                  <td width="33.33%" style="padding: 5px; vertical-align: top;">
                                    <div style="border-radius: 8px; overflow: hidden;">
                                      <img src="https://www.zerovacancy.ai/creatorcontent/emily-johnson/work-1.webp" width="100%" alt="Property Photo" style="display: block; width: 100%; height: auto; border: 0;">
                                    </div>
                                  </td>
                                  
                                  <!-- Creator 2 -->
                                  <td width="33.33%" style="padding: 5px; vertical-align: top;">
                                    <div style="border-radius: 8px; overflow: hidden;">
                                      <img src="https://www.zerovacancy.ai/creatorcontent/jane-cooper/work-1.jpg" width="100%" alt="Property Photo" style="display: block; width: 100%; height: auto; border: 0;">
                                    </div>
                                  </td>
                                  
                                  <!-- Creator 3 -->
                                  <td width="33.33%" style="padding: 5px; vertical-align: top;">
                                    <div style="border-radius: 8px; overflow: hidden;">
                                      <img src="https://www.zerovacancy.ai/creatorcontent/michael-brown/work-1.jpg" width="100%" alt="Property Photo" style="display: block; width: 100%; height: auto; border: 0;">
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              
                              <!-- Creator Caption -->
                              <p style="margin: 12px 0 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #45455A; text-align: center; font-style: italic;">
                                Connect with talented photographers, videographers, and property marketing specialists
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Testimonial Section -->
                    <tr>
                      <td style="padding: 0 30px 25px;">
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: linear-gradient(135deg, #F5F0FF 0%, #F0E9FF 100%); border-radius: 10px; padding: 10px;">
                          <tr>
                            <td style="padding: 5px 10px;">
                              <!-- Quote mark -->
                              <div style="text-align: center; margin-bottom: 5px;">
                                <span style="font-family: 'Georgia', serif; font-size: 28px; color: #8A57DE; font-weight: bold;">&ldquo;</span>
                              </div>
                              
                              <!-- Testimonial text -->
                              <p style="margin: 0 0 8px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #45455A; text-align: center; font-style: italic;">
                                The quality of content creators on ZeroVacancy has transformed how we market our properties. Professional photos increased our inquiries by 37%.
                              </p>
                              
                              <!-- Attribution -->
                              <p style="margin: 0; font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #5425B3; font-weight: 600; text-align: center;">
                                — Sarah T., Property Manager
                              </p>
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
                          We'll notify you when we're ready to launch
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
                          Connecting property teams with top-tier content creators
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Social Links -->
                    <tr>
                      <td style="padding: 0 0 15px; text-align: center;">
                        <table align="center" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <!-- Twitter -->
                            <td style="padding: 0 8px;">
                              <a href="https://twitter.com/zerovacancy" target="_blank" style="display: inline-block; text-decoration: none;">
                                <img src="https://www.zerovacancy.ai/email-assets/twitter-icon.png" width="28" height="28" alt="Twitter" style="display: block; border: 0;">
                              </a>
                            </td>
                            
                            <!-- Instagram -->
                            <td style="padding: 0 8px;">
                              <a href="https://instagram.com/zerovacancy" target="_blank" style="display: inline-block; text-decoration: none;">
                                <img src="https://www.zerovacancy.ai/email-assets/instagram-icon.png" width="28" height="28" alt="Instagram" style="display: block; border: 0;">
                              </a>
                            </td>
                            
                            <!-- LinkedIn -->
                            <td style="padding: 0 8px;">
                              <a href="https://linkedin.com/company/zerovacancy" target="_blank" style="display: inline-block; text-decoration: none;">
                                <img src="https://www.zerovacancy.ai/email-assets/linkedin-icon.png" width="28" height="28" alt="LinkedIn" style="display: block; border: 0;">
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Copyright & Legal -->
                    <tr>
                      <td style="padding: 0; text-align: center;">
                        <p style="margin: 0 0 10px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #8894A8;">
                          &copy; 2025 ZeroVacancy. All rights reserved.
                        </p>
                        
                        <table align="center" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <!-- Terms -->
                            <td style="padding: 0 8px;">
                              <a href="https://www.zerovacancy.ai/terms" target="_blank" style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #5425B3; text-decoration: none;">
