
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe('pk_live_51QtulpAIAL4hcfkS0KfdqCUoUQtz3eDphv2xibo0oIyQGTmtFnSWgTMGghDsj4J5Ff6htMYmGi2iWZmKDDvgJQM700gD6Qtd7Z');

/**
 * Service to handle all subscription-related API calls and logic
 */
export class PricingService {
  /**
   * Fetch the current user's subscription
   * @returns The user's subscription or null if not found
   */
  public static async fetchSubscription() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: subs, error } = await supabase
          .from('customer_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        if (subs && subs.length > 0) {
          return subs[0];
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  /**
   * Create or update a subscription
   * @param packageName The name of the package to subscribe to
   * @param isUpgrade Whether this is an upgrade of an existing subscription
   * @param currentSubscriptionId The ID of the current subscription (if upgrading)
   * @returns The client secret and subscription ID for payment confirmation
   */
  public static async createOrUpdateSubscription(packageName: string, isUpgrade = false, currentSubscriptionId?: string) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Authentication required to continue with subscription");
      }

      const response = await supabase.functions.invoke('create-subscription', {
        body: {
          packageName,
          userId: user.id,
          isUpgrade,
          currentSubscriptionId
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to create subscription');
      }
      
      return response.data;
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  }

  /**
   * Process a subscription payment using Stripe
   * @param clientSecret The client secret from the create subscription response
   * @returns The result of the payment confirmation
   */
  public static async processPayment(clientSecret: string) {
    try {
      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');
      
      console.log('Redirecting to Stripe Checkout with clientSecret:', clientSecret);

      // Create a payment element first
      const elements = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'stripe',
        }
      });

      // Use redirectToCheckout instead of confirmPayment for a more reliable redirect
      window.location.href = `https://checkout.stripe.com/pay/${clientSecret}`;
      
      // If the redirect doesn't happen immediately, return a resolved promise
      // This won't be reached if the redirect works
      return Promise.resolve({ success: true });
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  /**
   * Cancel an existing subscription
   * @param subscriptionId The ID of the subscription to cancel
   * @returns The result of the cancellation operation
   */
  public static async cancelSubscription(subscriptionId: string) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Authentication required to cancel subscription");
      }

      const response = await supabase.functions.invoke('cancel-subscription', {
        body: {
          subscriptionId,
          userId: user.id
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to cancel subscription');
      }
      
      return response.data;
    } catch (error) {
      console.error('Cancellation error:', error);
      throw error;
    }
  }

  /**
   * Create a billing portal session for updating payment methods
   * @param subscriptionId The ID of the subscription
   * @returns The URL to the billing portal
   */
  public static async createPaymentUpdateSession(subscriptionId: string) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Authentication required to update payment methods");
      }

      const response = await supabase.functions.invoke('create-payment-update-session', {
        body: {
          subscriptionId,
          userId: user.id
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to create payment update session');
      }
      
      return response.data;
    } catch (error) {
      console.error('Payment update session error:', error);
      throw error;
    }
  }
}
