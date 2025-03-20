import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OnboardingFlow from '@/components/auth/OnboardingFlow';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthContext';

const Onboarding = () => {
  const { isAuthenticated, isLoading, openAuthDialog } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if the user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to be signed in to access the onboarding process.",
        variant: "destructive",
      });
      
      // Open auth dialog
      openAuthDialog();
      
      // Redirect to home
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate, toast, openAuthDialog]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If authenticated, show the onboarding flow
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Complete Your Profile</h1>
          <OnboardingFlow />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;