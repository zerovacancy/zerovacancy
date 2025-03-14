
import React from 'react';
import { Header, Footer } from '@/components/navigation';

const AuthCheckingState = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Checking authentication...</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthCheckingState;
