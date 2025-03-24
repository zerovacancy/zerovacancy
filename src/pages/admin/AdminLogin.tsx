import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

/**
 * Simple AdminLogin component with no conditional hooks
 */
const AdminLogin = () => {
  // ===== ALL HOOKS MUST BE DECLARED HERE, AT THE TOP LEVEL =====
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // UI state - but never conditionally rendered
  const [accessMessage, setAccessMessage] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(true);
  
  // Use a ref to prevent duplicate redirects
  const redirectedRef = React.useRef(false);

  // Check access permissions
  useEffect(() => {
    const checkAccess = () => {
      // Already authenticated - go directly to admin
      if (isAuthenticated) {
        navigate('/admin/blog');
        return;
      }
      
      // Has admin token - show login form
      const adminToken = sessionStorage.getItem('adminAccessToken');
      if (adminToken === 'granted') {
        setShowLoginForm(true);
        return;
      }
      
      // Development environment - always allow
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setShowLoginForm(true);
        return;
      }
      
      // Coming from our site - might be legitimate
      const referrer = document.referrer;
      if (referrer && referrer.includes(window.location.origin)) {
        setShowLoginForm(true);
        return;
      }
      
      // Otherwise - unauthorized, redirect to home
      setShowLoginForm(false);
      setAccessMessage('Unauthorized access. Redirecting to home page...');
      
      // Use a delayed redirect without useState changes
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        const redirectTimer = window.setTimeout(() => {
          navigate('/');
        }, 1500);
        
        // Cleanup the timer if component unmounts
        return () => window.clearTimeout(redirectTimer);
      }
    };
    
    checkAccess();
  }, [isAuthenticated, navigate]);

  // Handle the login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Set the admin token
      sessionStorage.setItem('adminAccessToken', 'granted');
      
      // Try to log in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Success - go to admin panel
      navigate('/admin/blog');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };
  
  // ===== ALWAYS RENDER BOTH VIEWS, USE CSS TO SHOW/HIDE =====
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Admin Login | ZeroVacancy"
        description="Admin access only"
        noindex={true}
      />
      
      {/* IMPORTANT: We always render both components, but hide one with CSS */}
      {/* This prevents hook ordering issues in React */}
      
      {/* Unauthorized Message */}
      <div className={`max-w-md w-full space-y-8 text-center ${showLoginForm ? 'hidden' : 'block'}`}>
        <h2 className="text-3xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-gray-600">{accessMessage}</p>
      </div>
      
      {/* Login Form - Always rendered but might be hidden */}
      <div className={`max-w-md w-full space-y-8 ${showLoginForm ? 'block' : 'hidden'}`}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
    </div>
  );
};

export default AdminLogin;