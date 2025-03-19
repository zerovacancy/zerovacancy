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
        
        // Get the URL hash (including the #)
        const hashParams = window.location.hash;
        
        if (hashParams) {
          // Process the hash params for email confirmation
          const { data, error } = await supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
              toast({
                title: "Email confirmed!",
                description: "Your email has been confirmed and you are now signed in.",
              });
              navigate('/');
            }
          });
          
          if (error) {
            throw error;
          }
        } else {
          // No hash params found, can't process the callback
          setError('No authentication parameters found.');
        }
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'An error occurred during authentication.');
        toast({
          title: "Authentication error",
          description: err.message || "An error occurred during authentication.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        // Navigate back to home page after a delay regardless of outcome
        setTimeout(() => {
          navigate('/');
        }, 3000);
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