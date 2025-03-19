
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
    const { packageName, userId, isUpgrade = false, currentSubscriptionId = null } = await req.json();

    if (!packageName || !userId) {
      throw new Error("Package name and user ID are required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase client
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

    let clientSecret: string;
    let subscriptionId: string;

    // Get plan price ID based on the package name
    const planId = `price_${packageName.toLowerCase()}`;
    
    // Determine price amount based on package name
    let priceAmount = 0;
    // Determine product ID based on package name
    let productId = '';
    
    switch (packageName.toLowerCase()) {
      case "basic":
        priceAmount = 13900; // $139.00
        productId = 'prod_basic';
        break;
      case "pro":
      case "professional":
        priceAmount = 49900; // $499.00
        productId = 'prod_pro';
        break;
      case "premium":
        priceAmount = 79900; // $799.00
        productId = 'prod_premium';
        break;
      default:
        throw new Error(`Invalid package name: ${packageName}`);
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

    if (isUpgrade && currentSubscriptionId) {
      // Handle subscription upgrade/change
      // First, retrieve the current subscription
      const currentSubscription = await stripe.subscriptions.retrieve(currentSubscriptionId);
      
      // Then update the subscription with the new price
      const updatedSubscription = await stripe.subscriptions.update(currentSubscriptionId, {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            price_data: {
              currency: "usd",
              product: productId,
              unit_amount: priceAmount,
              recurring: {
                interval: "month",
              },
            },
          },
        ],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      // Get the payment intent from the latest invoice
      const latestInvoice: any = updatedSubscription.latest_invoice;
      const paymentIntent: any = latestInvoice.payment_intent;
      
      clientSecret = paymentIntent.client_secret;
      subscriptionId = updatedSubscription.id;

      // Update subscription in Supabase
      await supabase
        .from("customer_subscriptions")
        .update({
          plan_id: planId,
          status: updatedSubscription.status,
          current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
          metadata: updatedSubscription,
        })
        .eq("stripe_subscription_id", updatedSubscription.id);

    } else {
      // Create a new subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price_data: {
              currency: "usd",
              product: productId,
              unit_amount: priceAmount,
              recurring: {
                interval: "month",
              },
            },
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      });

      // Get the client secret for the payment intent
      const latestInvoice: any = subscription.latest_invoice;
      const paymentIntent: any = latestInvoice.payment_intent;
      
      clientSecret = paymentIntent.client_secret;
      subscriptionId = subscription.id;

      // Save subscription to Supabase
      await supabase
        .from("customer_subscriptions")
        .insert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          plan_id: planId,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          metadata: subscription,
        });
    }

    return new Response(JSON.stringify({ subscriptionId, clientSecret }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create subscription",
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400,
      }
    );
  }
});
