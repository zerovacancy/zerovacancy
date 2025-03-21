
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { formatDate } from "@/lib/utils";

const PaymentConfirmation = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentIntent = queryParams.get('payment_intent');
    const paymentIntentClientSecret = queryParams.get('payment_intent_client_secret');
    const redirectStatus = queryParams.get('redirect_status');
    const setupIntent = queryParams.get('setup_intent');
    const setupIntentClientSecret = queryParams.get('setup_intent_client_secret');
    
    const checkPaymentStatus = async () => {
      // Initialize user session check
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setStatus('failed');
        toast({
          title: "Authentication Required",
          description: "You need to be logged in to complete this process.",
          variant: "destructive",
        });
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        if (paymentIntent && paymentIntentClientSecret && redirectStatus === 'succeeded') {
          // Handle successful payment intent (one-time payment)
          setStatus('success');
          toast({
            title: "Payment Successful",
            description: "Thank you for your payment!",
          });
          
          // Verify payment on server side and update subscription status
          try {
            const { data, error } = await supabase.functions.invoke('verify-payment', {
              body: { 
                paymentIntentId: paymentIntent,
                userId: user.id 
              }
            });
            
            if (error) throw new Error(error.message);
            
            if (data?.subscription) {
              setSubscriptionDetails(data.subscription);
            }
          } catch (verifyError) {
            console.error('Error verifying payment:', verifyError);
          }
        } 
        else if (setupIntent && setupIntentClientSecret && redirectStatus === 'succeeded') {
          // Handle successful setup intent (subscription setup)
          setStatus('success');
          toast({
            title: "Subscription Activated",
            description: "Your subscription has been successfully set up!",
          });
          
          // Get latest subscription details
          const { data: subscription } = await supabase
            .from('customer_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (subscription) {
            setSubscriptionDetails(subscription);
          }
        } 
        else {
          // Handle failure or unknown state
          setStatus('failed');
          toast({
            title: "Payment Failed",
            description: "Something went wrong with your payment. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('failed');
        toast({
          title: "Error",
          description: "Failed to verify payment status. Please contact support.",
          variant: "destructive",
        });
      }
    };

    checkPaymentStatus();
  }, [toast, navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Processing your payment...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {subscriptionDetails ? 'Subscription Activated!' : 'Payment Successful!'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {subscriptionDetails ? 'Your account has been successfully updated.' : 'Thank you for your payment.'}
            </p>

            {subscriptionDetails && (
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription Details</h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Plan</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                        {subscriptionDetails.plan_id.replace('price_', '')}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                        {subscriptionDetails.status}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Current Period</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formatDate(subscriptionDetails.current_period_start, { format: 'short' })} - {formatDate(subscriptionDetails.current_period_end, { format: 'short' })}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Return to Home
              </button>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Something went wrong with your payment. Please try again.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Return to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;
