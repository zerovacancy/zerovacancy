
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Home } from 'lucide-react';

const ConnectSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const updateAccountStatus = async () => {
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
        
        // Get the account data from the create-connect-account function
        const { data, error } = await supabase.functions.invoke('create-connect-account', {
          body: {
            userId: user.id,
            email: user.email,
          },
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setAccountData({
          stripe_account_id: data.accountId,
          onboarded: data.isFullyOnboarded
        });
        
        toast({
          title: "Stripe Connect Account Setup Complete",
          description: "Your account has been successfully set up to receive payments.",
        });
      } catch (error) {
        console.error('Error updating Connect account status:', error);
        toast({
          title: "Error",
          description: "There was a problem updating your Connect account status.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    updateAccountStatus();
  }, [navigate, toast]);

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
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Account Setup Complete
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Your Stripe Connect account has been successfully set up. You can now receive payments for your photography services.
              </p>
              
              {accountData && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500">Account Details</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    Account ID: {accountData.stripe_account_id}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    Status: <span className="text-green-600 font-medium">Active</span>
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/account')} 
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
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

export default ConnectSuccess;
