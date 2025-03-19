import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@13.10.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { planName, userId } = await req.json();
    
    if (!planName || !userId) {
      throw new Error("Plan name and user ID are required");
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });
    
    // Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the user from Supabase
    const { data: userData, error: userError } = await supabase
      .from("auth.users")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (userError || !userData) {
      throw new Error(`User not found: ${userError?.message || "Unknown error"}`);
    }
    
    // Check if user already has a customer ID
    const { data: existingCustomers } = await supabase
      .from("customer_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
    
    let customerId: string;
    
    if (existingCustomers && existingCustomers.length > 0 && existingCustomers[0].stripe_customer_id) {
      // Use existing customer
      customerId = existingCustomers[0].stripe_customer_id;
      console.log("Using existing customer:", customerId);
    } else {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          user_id: userId,
        },
      });
      
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }
    
    // Determine price based on plan name
    let priceId: string;
    switch (planName.toLowerCase()) {
      case "basic":
        priceId = "price_basic";
        break;
      case "pro":
      case "professional":
        priceId = "price_pro";
        break;
      case "premium":
        priceId = "price_premium";
        break;
      default:
        throw new Error(`Invalid plan name: ${planName}`);
    }
    
    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}#pricing`,
      metadata: {
        user_id: userId,
        plan_name: planName,
      },
    });
    
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create checkout session",
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400,
      }
    );
  }
});