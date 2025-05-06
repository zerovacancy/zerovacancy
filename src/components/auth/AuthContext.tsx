import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Utility function to get the appropriate redirect URL based on environment
const getRedirectUrl = (path: string = '/auth/callback'): string => {
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  // Get the production URL from environment variables
  const PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL || 'https://zerovacancy.app';
  
  // Choose the appropriate base URL
  const baseUrl = isDevelopment 
    ? window.location.origin // Use localhost URL in development
    : PRODUCTION_URL;       // Use production URL in production
    
  return `${baseUrl}${path}`;
};

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

  // Check Supabase connection on component mount
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        console.log("Checking Supabase connection...");
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
          toast({
            title: "Connection Issue",
            description: "There was a problem connecting to the authentication service.",
            variant: "destructive",
          });
        } else {
          console.log("Supabase connection successful");
        }
      } catch (e) {
        console.error("Supabase connection check failed:", e);
      }
    };
    
    checkSupabaseConnection();
  }, [toast]);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error);
          setUser(null);
        } else {
          console.log("User retrieved:", user ? "Authenticated" : "Not authenticated");
          setUser(user);
        }
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
      
      console.log(`Attempting to sign in with email: ${cleanEmail.substring(0, 3)}...@... (partially hidden for privacy)`);
      console.log("User agent:", navigator.userAgent);
      console.log("Is mobile:", /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

      // Add device specific logs for debugging
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobileDevice) {
        console.log("Authentication on mobile device");
      }

      // Normal authentication flow with timeout for mobile browsers
      let authResponse;
      try {
        authResponse = await Promise.race([
          supabase.auth.signInWithPassword({ 
            email: cleanEmail,
            password 
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Authentication request timed out")), 15000)
          )
        ]);
      } catch (timeoutError) {
        console.error("Auth request timed out, retrying:", timeoutError);
        // Retry once with increased timeout
        authResponse = await supabase.auth.signInWithPassword({ 
          email: cleanEmail,
          password 
        });
      }
      
      const { error, data } = authResponse;
      
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
      
      // Log additional information about the error
      console.log("Error type:", typeof error);
      console.log("Error properties:", Object.keys(error));
      
      // Provide more specific error messages based on the error code
      let errorMessage = "Failed to sign in. Please check your credentials and try again.";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and confirm your account before signing in.";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Too many login attempts. Please try again later.";
        } else if (error.message.includes("timed out")) {
          errorMessage = "The authentication service is taking longer than expected. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log(`Login error message: ${errorMessage}`);
      
      toast({
        title: "Error signing in",
        description: errorMessage,
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
      
      console.log(`Attempting to sign up with email: ${cleanEmail.substring(0, 3)}...@... (partially hidden for privacy)`);
      console.log("User agent:", navigator.userAgent);
      console.log("Is mobile:", /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
      
      // Add device specific logs for debugging
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobileDevice) {
        console.log("Registration on mobile device");
      }
      
      // Get the appropriate redirect URL
      const redirectUrl = getRedirectUrl();
      console.log(`Signup Redirect URL: ${redirectUrl}`);
      
      // Registration with timeout for mobile browsers
      let authResponse;
      try {
        authResponse = await Promise.race([
          supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              emailRedirectTo: redirectUrl,
              redirectTo: redirectUrl,
            },
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Registration request timed out")), 15000)
          )
        ]);
      } catch (timeoutError) {
        console.error("Registration request timed out, retrying:", timeoutError);
        // Retry once with increased timeout
        authResponse = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            redirectTo: redirectUrl,
          },
        });
      }
      
      const { error, data } = authResponse;
      
      console.log("Sign up response:", error ? "Error occurred" : "Success", 
                 data?.user ? "User created" : "No user data");
      
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
      
      // Log additional information about the error
      console.log("Error type:", typeof error);
      console.log("Error properties:", Object.keys(error));
      
      // Provide more specific error messages based on the error code
      let errorMessage = "Failed to register. Please try again.";
      
      if (error.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "This email is already registered. Please use the login form instead.";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Too many signup attempts. Please try again later.";
        } else if (error.message.includes("valid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message.includes("timed out")) {
          errorMessage = "The registration service is taking longer than expected. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log(`Signup error message: ${errorMessage}`);
      
      toast({
        title: "Error registering",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      // Get the appropriate redirect URL
      const redirectUrl = getRedirectUrl();
      console.log(`Google OAuth Redirect URL: ${redirectUrl}`);
      console.log("User agent:", navigator.userAgent);
      console.log("Is mobile:", /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
      
      // Add device specific logs for debugging
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobileDevice) {
        console.log("Google OAuth on mobile device");
      }
      
      // Google OAuth with timeout for mobile browsers
      let authResponse;
      try {
        authResponse = await Promise.race([
          supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl
            }
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Google auth request timed out")), 15000)
          )
        ]);
      } catch (timeoutError) {
        console.error("Google auth request timed out, retrying:", timeoutError);
        // Retry once with increased timeout
        authResponse = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl
          }
        });
      }
      
      const { error } = authResponse;
      
      if (error) throw error;
      
      // Close the auth dialog once OAuth flow is initiated
      setIsAuthDialogOpen(false);
    } catch (error: any) {
      console.error('Google SignIn error:', error);
      
      // Log additional information about the error
      console.log("Error type:", typeof error);
      console.log("Error properties:", Object.keys(error));
      
      let errorMessage = "Failed to sign in with Google. Please try again.";
      
      if (error.message) {
        if (error.message.includes("timed out")) {
          errorMessage = "The Google authentication service is taking longer than expected. Please try again.";
        } else if (error.message.includes("popup")) {
          errorMessage = "The Google authentication popup was blocked. Please allow popups for this site.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Google Sign-in Error",
        description: errorMessage,
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