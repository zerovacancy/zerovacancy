import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  email?: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, isAdminLogin?: boolean) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  openAuthDialog: (formType?: 'login' | 'register') => void;
  closeAuthDialog: () => void;
  isAuthDialogOpen: boolean;
  authDialogFormType: 'login' | 'register';
  navigate: (path: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogFormType, setAuthDialogFormType] = useState<'login' | 'register'>('login');
  const { toast } = useToast();
  
  // Simple navigate function that doesn't depend on react-router
  const navigate = (path: string) => {
    window.location.href = path;
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, isAdminLogin: boolean = false): Promise<void> => {
    try {
      // Validate input only on empty values
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Trim email for consistency
      const cleanEmail = String(email).trim();

      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw error;
      }
      
      // For admin login, set a session flag to indicate admin access
      if (isAdminLogin && data.session) {
        // Store the admin access token in session storage
        sessionStorage.setItem('adminAccessToken', 'granted');
      }
      
      // Only show toast for regular user login, not admin
      if (!isAdminLogin) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
      
      setIsAuthDialogOpen(false);
    } catch (error: any) {
      console.error('SignIn error:', error);
      toast({
        title: "Error signing in",
        description: error.message || "Failed to sign in. Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        throw new Error("Please enter a valid email address");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Trim email for consistency
      const cleanEmail = String(email).trim();
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          // Ensure we have the full URL with protocol for proper redirect
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // To handle various Supabase redirect formats
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });
      
      // Close the auth dialog and redirect to onboarding
      setIsAuthDialogOpen(false);
      
      // Navigate to onboarding page if we have a user session already
      // This can happen if email verification is not required
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/onboarding');
      }
    } catch (error: any) {
      console.error('SignUp error:', error);
      toast({
        title: "Error registering",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // Close the auth dialog once OAuth flow is initiated
      setIsAuthDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Google Sign-in Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };


  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      // Use the navigate function
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const openAuthDialog = (formType: 'login' | 'register' = 'login') => {
    setAuthDialogFormType(formType);
    setIsAuthDialogOpen(true);
  };
  
  const closeAuthDialog = () => setIsAuthDialogOpen(false);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    openAuthDialog,
    closeAuthDialog,
    isAuthDialogOpen,
    authDialogFormType,
    navigate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};