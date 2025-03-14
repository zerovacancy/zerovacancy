
import React, { useEffect, useState } from 'react';
import { Header, Footer } from '@/components/navigation';
import { Button } from '@/components/ui/buttons/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, LogOut, User } from 'lucide-react';

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate('/');
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
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
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Account;
