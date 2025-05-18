import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        console.log("Auth callback page loaded");
        
        // Get the URL parameters (with validation)
        let url;
        let hashParams = '';
        let queryParams = '';
        
        try {
          // Ensure we have a valid URL string
          if (window.location.href && typeof window.location.href === 'string') {
            url = new URL(window.location.href);
            hashParams = url.hash;
            queryParams = url.search;
          } else {
            console.warn("Invalid location href:", window.location.href);
          }
        } catch (urlError) {
          console.error("Error parsing URL:", urlError);
          // Continue without URL parameters
        }
        
        console.log("URL params:", { 
          url: window.location.href, 
          hash: hashParams, 
          query: queryParams 
        });
        
        // Process the callback - this will handle both hash fragments and query params
        const { data, error } = await supabase.auth.getSession();
        
        console.log("Current session data:", data);
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          console.log("User is authenticated:", data.session.user);
          
          toast({
            title: "Email confirmed!",
            description: "Your email has been confirmed and you are now signed in.",
          });
          
          // Navigate to the onboarding page after successful verification
          setTimeout(() => {
            navigate('/onboarding');
          }, 1500);
        } else {
          // Try to explicitly exchange the token in the URL
          // This handles the case where we have a token in the URL but no session yet
          if (hashParams || queryParams) {
            console.log("Attempting to set auth session from URL");
            
            // Set up auth state change listener
            const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
              console.log("Auth state changed:", event, session);
              
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Email confirmed!",
                  description: "Your email has been confirmed and you are now signed in.",
                });
                
                // Navigate to the onboarding page after successful verification
                setTimeout(() => {
                  navigate('/onboarding');
                }, 1500);
              }
            });
            
            // Cleanup listener
            setTimeout(() => {
              authData.subscription.unsubscribe();
            }, 5000);
          } else {
            // No hash params found, can't process the callback
            setError('No authentication parameters found.');
          }
        }
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'An error occurred during authentication.');
        toast({
          title: "Authentication error",
          description: err.message || "An error occurred during authentication.",
          variant: "destructive",
        });
        
        // Navigate back to home page after a delay on error
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      {loading ? (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Verifying your account...</h1>
          <p className="text-gray-600">Please wait while we complete the authentication process.</p>
          <div className="w-12 h-12 border-4 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin mx-auto"></div>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
          <p className="text-red-600">{error}</p>
          <p className="text-gray-600">Redirecting you to the home page...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-brand-purple">Success!</h1>
          <p className="text-gray-600">Authentication complete. Redirecting you to the home page...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;