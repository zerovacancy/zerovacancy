
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthContext';

export const useAuthCheck = () => {
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, openAuthDialog } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      setAuthChecking(true);
      
      // Wait for auth state to be determined
      if (isLoading) {
        return;
      }
      
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
        
        // Open auth dialog
        openAuthDialog();
        
        // Redirect to home page
        navigate('/');
        return;
      }
      
      setAuthChecking(false);
    };
    
    checkAuth();
  }, [navigate, toast, isAuthenticated, isLoading, openAuthDialog]);

  return { authChecking };
};
