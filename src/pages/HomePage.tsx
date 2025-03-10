
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to the Application</h1>
      <div className="flex justify-center">
        <Link 
          to="/resend-test" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
        >
          Test Resend Integration
        </Link>
      </div>
    </div>
  );
}
