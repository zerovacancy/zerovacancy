
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { CreditCard, LogOut, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

const Account = () => {
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : isAuthenticated ? (
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-6">My Account</h1>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-medium text-lg mb-2">Profile Information</h2>
                <p>Email: {user?.email}</p>
                <p>User ID: {user?.id}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-medium text-lg mb-2">Photographer Options</h2>
                <p className="mb-4">Set up your Stripe Connect account to receive payments for photography services.</p>
                <Button 
                  onClick={() => navigate('/connect/onboarding')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Stripe Connect Setup
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="mb-6">You need to be signed in to access this page.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Account;
