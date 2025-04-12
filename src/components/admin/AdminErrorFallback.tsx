import React, { useEffect, useState } from 'react';
import { AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { checkSupabaseConnection } from '@/integrations/supabase/client-enhanced';

interface AdminErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AdminErrorFallback: React.FC<AdminErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  
  // Check database connection
  const checkConnection = async () => {
    setChecking(true);
    try {
      const isConnected = await checkSupabaseConnection();
      setConnectionOk(isConnected);
      setCheckCount(prev => prev + 1);
    } catch (e) {
      setConnectionOk(false);
    } finally {
      setChecking(false);
    }
  };
  
  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);
  
  // Get helpful message based on error type
  const getHelpfulMessage = () => {
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('fetch')) {
      return "There's a network issue connecting to the database.";
    }
    
    if (errorMessage.includes('timeout')) {
      return "The connection to the database timed out.";
    }
    
    if (errorMessage.includes('cors')) {
      return "There's a cross-origin (CORS) issue accessing the database.";
    }
    
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
      return "There's an authentication issue. Try logging out and back in.";
    }
    
    return "There was a problem loading this page.";
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="mb-5">
          <AlertTriangle 
            size={50} 
            className="mx-auto text-amber-500" 
          />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Admin Dashboard Error
          </h1>
          <p className="mt-2 text-gray-600">
            {getHelpfulMessage()}
          </p>
        </div>
        
        <div className="rounded-md bg-amber-50 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Database className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-amber-800">
                Database Connection: {
                  connectionOk === null ? 'Checking...' :
                  connectionOk ? 'Connected' : 'Error'
                }
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                {connectionOk === false && (
                  <p>
                    Unable to connect to the database. This might be due to network issues
                    or server maintenance.
                  </p>
                )}
                {connectionOk === true && (
                  <p>
                    Database connection is working, but there was an error loading this page.
                    This could be due to missing data or permissions.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple"
          >
            Try Again
          </button>
          
          <button
            onClick={checkConnection}
            disabled={checking}
            className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium 
              ${checking 
                ? 'text-gray-400 bg-gray-50' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {checking ? (
              <span className="flex items-center justify-center">
                <RefreshCw size={16} className="animate-spin mr-2" />
                Checking Connection...
              </span>
            ) : (
              <span>Check Database Connection {checkCount > 0 ? `(${checkCount})` : ''}</span>
            )}
          </button>
          
          <a
            href="/admin/login"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Login
          </a>
        </div>
        
        {/* Technical details for developers */}
        <div className="mt-6 text-left">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer font-medium">Technical Details</summary>
            <pre className="mt-2 whitespace-pre-wrap bg-gray-50 p-2 rounded overflow-auto max-h-40">
              {error.stack || error.message || 'No error details available'}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default AdminErrorFallback;