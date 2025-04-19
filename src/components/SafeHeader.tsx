import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Header from './Header';

// This wrapper component ensures the Header only renders when AuthContext is available
const SafeHeader: React.FC = () => {
  // This will throw the error if AuthContext is not available
  // But it will be caught by the error boundary in App.tsx
  try {
    // Just access the Auth context to verify it exists
    useAuth();
    // If no error is thrown, render the Header
    return <Header />;
  } catch (error) {
    console.error('AuthContext not available yet, not rendering Header:', error);
    // Return a minimal header if auth context is not ready
    return (
      <header className="fixed top-0 left-0 right-0 z-[1000] w-full bg-white border-b border-gray-100 h-16 shadow-sm">
        <div className="w-full px-4 md:container md:mx-auto md:px-6">
          <div className="flex justify-between items-center w-full h-16">
            <a href="/" className="flex items-center">
              <img src="/logo.png" alt="ZeroVacancy" className="h-7 w-auto" />
            </a>
          </div>
        </div>
      </header>
    );
  }
};

export default SafeHeader;
