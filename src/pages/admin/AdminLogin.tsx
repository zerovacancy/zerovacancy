import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Track if the user came here through our secret methods
  const [accessGranted, setAccessGranted] = useState(false);
  
  // If already authenticated, redirect to admin dashboard
  React.useEffect(() => {
    // Check if user came from a secret entry point
    const checkSecretAccess = () => {
      // Read the token directly from session storage
      const secretToken = sessionStorage.getItem('adminAccessToken');
      const referrer = document.referrer;
      
      console.log("Checking admin access credentials");
      console.log("Admin token:", secretToken);
      console.log("Referrer:", referrer);
      console.log("Is authenticated:", isAuthenticated);
      
      // If they have a valid token stored in session, grant access
      if (secretToken === 'granted') {
        console.log("Access granted via token");
        setAccessGranted(true);
        return;
      }
      
      // If they're already authenticated, allow access
      if (isAuthenticated) {
        console.log("Access granted via authentication");
        setAccessGranted(true);
        navigate('/admin/blog');
        return;
      }
      
      // Special case - always grant access in development environment
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log("Access granted via localhost");
        setAccessGranted(true);
        return;
      }
      
      // If they came from our site, might be using regular navigation
      if (referrer && referrer.includes(window.location.origin)) {
        console.log("Access granted via referrer");
        setAccessGranted(true);
        return;
      }
      
      // Otherwise they shouldn't be here - redirect immediately
      console.log("Unauthorized admin access attempt - redirecting");
      // Set a flag to show the unauthorized message briefly
      setAccessGranted(false);
      // Navigate directly without setTimeout
      navigate('/');
    };
    
    // Run the check
    checkSecretAccess();
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mark the session as an admin login
      sessionStorage.setItem('adminAccessToken', 'granted');
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // Redirect to admin dashboard on success
      navigate('/admin/blog');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Admin Login | ZeroVacancy"
        description="Admin access only"
        noindex={true}
      />
      {!accessGranted ? (
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Unauthorized Access</h2>
          <p className="text-gray-600">Redirecting to home page...</p>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-brand-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;