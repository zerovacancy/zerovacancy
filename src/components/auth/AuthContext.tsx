import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { supabaseDirect } from '@/integrations/supabase/client-direct'; // Fallback client
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

// Get the appropriate Supabase client - handle environment variable issues
const getClient = () => {
  try {
    // First, try to access the standard client's auth property
    // If this throws an error, we know the client was not properly initialized
    if (supabase && typeof supabase.auth === 'object') {
      console.log('[AUTH] Using standard Supabase client');
      return supabase;
    }
  } catch (err) {
    console.warn('[AUTH] Error accessing standard Supabase client:', err);
  }

  // Fallback to the direct client that doesn't rely on environment variables
  console.log('[AUTH] Using direct Supabase client (fallback)');
  return supabaseDirect;
};

// Helper types for the auth context
type User = any; // Replace with your actual User type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, isAdminLogin?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  refreshSession: () => Promise<void>;
  showLoginForm: boolean;
  setShowLoginForm: (show: boolean) => void;
  showSignupForm: boolean;
  setShowSignupForm: (show: boolean) => void;
  showEmailConfirmation: boolean;
  confirmEmail: string;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the actual auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [sessionData, setSessionData] = useState<any>(null);
  const { toast } = useToast();
  
  // Function to get the current session and update user state
  const getSession = async () => {
    try {
      setIsLoading(true);
      const client = getClient();
      const { data, error } = await client.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        return;
      }
      
      setSessionData(data); // Store the session data for the effect hook
      
      if (data.session) {
        setUser(data.session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error('Unexpected error during getSession:', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get the session when the component mounts
  useEffect(() => {
    getSession();
  }, []);
  
  // Set up auth state listener when session changes
  useEffect(() => {
    // Don't set up the listener if we don't have session data yet
    if (!sessionData) {
      return;
    }
    
    try {
      const client = getClient();
      
      // Set up auth state change listener for future changes
      const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", !!session?.user);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
      });
      
      return () => {
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    } catch (error: any) {
      console.error('Error setting up auth listener:', error.message);
    }
  }, [sessionData]);
  
  // Sign in function
  const signIn = async (email: string, password: string, isAdminLogin: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);
      // Validate input only on empty values
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Trim email for consistency
      const cleanEmail = String(email).trim();
      
      console.log(`Attempting to sign in with email: ${cleanEmail.substring(0, 3)}...@... (partially hidden for privacy)`);
      
      const client = getClient();
      
      // Normal authentication flow with timeout for mobile browsers
      let authResponse;
      try {
        authResponse = await Promise.race([
          client.auth.signInWithPassword({ 
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
        authResponse = await client.auth.signInWithPassword({ 
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
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Close the login form
      setShowLoginForm(false);
      
      // Show success toast
      toast({
        title: "Login successful",
        description: "You are now signed in",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      
      // More user-friendly error message
      let errorMessage = "Failed to sign in. Please check your credentials and try again.";
      
      // Handle specific error messages
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email address before signing in.";
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const client = getClient();
      const { error } = await client.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear any admin access tokens
      sessionStorage.removeItem('adminAccessToken');
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Show success toast
      toast({
        title: "Logged out",
        description: "You have been signed out successfully",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, metadata: any = {}): Promise<void> => {
    try {
      setIsLoading(true);
      // Validate input
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Trim email for consistency
      const cleanEmail = String(email).trim();
      
      const client = getClient();
      const { error } = await client.auth.signUp({ 
        email: cleanEmail, 
        password,
        options: {
          data: metadata,
          emailRedirectTo: getRedirectUrl()
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Store email for confirmation message
      setConfirmEmail(cleanEmail);
      
      // Show confirmation message
      setShowEmailConfirmation(true);
      setShowSignupForm(false);
      
      // Show success toast
      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      
      // More user-friendly error message
      let errorMessage = "Failed to sign up. Please try again.";
      
      // Handle specific error messages
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("valid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password must be at least 6 characters.";
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh session function
  const refreshSession = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const client = getClient();
      const { data, error } = await client.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setUser(data.session.user);
        setIsAuthenticated(true);
      } else {
        // If no session, probably logged out
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error("Error refreshing session:", error.message);
      toast({
        title: "Session refresh failed",
        description: "Failed to refresh your session. Please sign in again.",
        variant: "destructive",
      });
      // Force sign out on session refresh failure
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      if (!email) {
        throw new Error("Email is required");
      }
      
      const cleanEmail = String(email).trim();
      const client = getClient();
      const { error } = await client.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: getRedirectUrl('/reset-password'),
      });
      
      if (error) {
        throw error;
      }
      
      // Show success toast
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions",
        variant: "default",
      });
      
      // Close the login form
      setShowLoginForm(false);
    } catch (error: any) {
      console.error("Error in forgot password:", error.message);
      toast({
        title: "Password reset failed",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password function
  const resetPassword = async (password: string): Promise<void> => {
    try {
      setIsLoading(true);
      if (!password) {
        throw new Error("Password is required");
      }
      
      const client = getClient();
      const { error } = await client.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      // Show success toast
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error resetting password:", error.message);
      toast({
        title: "Password reset failed",
        description: "Failed to reset your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update profile function
  const updateProfile = async (profile: any): Promise<void> => {
    try {
      setIsLoading(true);
      const client = getClient();
      const { error } = await client.auth.updateUser({ data: profile });
      
      if (error) {
        throw error;
      }
      
      // Update user state to reflect changes
      const { data } = await client.auth.getUser();
      setUser(data.user);
      
      // Show success toast
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        title: "Profile update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    signUp,
    refreshSession,
    showLoginForm,
    setShowLoginForm,
    showSignupForm,
    setShowSignupForm,
    showEmailConfirmation,
    confirmEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};