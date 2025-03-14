
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ConnectRefresh = () => {
  const [loading, setLoading] = useState(true);
  const [refreshUrl, setRefreshUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getNewOnboardingLink = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Create or retrieve connect account with new onboarding link
        const { data, error } = await supabase.functions.invoke('create-connect-account', {
          body: {
            userId: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || ''
          },
        });
        
        if (error) throw new Error(error.message);
        
        setRefreshUrl(data.accountLink);
        
        if (data.isFullyOnboarded) {
          // If already onboarded, go to success page
          navigate('/connect/success');
        }
      } catch (error) {
        console.error('Error getting Connect onboarding link:', error);
        toast({
          title: "Error",
          description: "Failed to refresh the onboarding link. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getNewOnboardingLink();
  }, [navigate, toast]);

  const handleContinueOnboarding = () => {
    if (refreshUrl) {
      window.location.href = refreshUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Continue Setup
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Your Stripe Connect account setup was not completed. Please continue the onboarding process.
              </p>
              
              {refreshUrl ? (
                <div className="mt-6">
                  <Button 
                    onClick={handleContinueOnboarding} 
                    className="w-full"
                  >
                    Continue Account Setup
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-red-600">
                  Unable to generate a new onboarding link. Please try again later.
                </p>
              )}
              
              <div className="mt-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/account')} 
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConnectRefresh;
