import React, { useEffect, useState } from 'react';
import { testConnection } from './integrations/supabase/client-direct';

// This component will check and display environment variables in the browser
export default function EnvChecker() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [connectionStatus, setConnectionStatus] = useState<{success?: boolean, error?: string}>({});
  
  useEffect(() => {
    // Collect all environment variables
    const importMetaEnv = import.meta.env;
    const env: Record<string, string> = {};
    
    // Loop through all import.meta.env keys
    Object.keys(importMetaEnv).forEach(key => {
      if (key.startsWith('VITE_')) {
        // Hide keys for security
        if (key.includes('KEY')) {
          env[key] = '[HIDDEN FOR SECURITY]';
        } else {
          env[key] = String(importMetaEnv[key]);
        }
      }
    });
    
    // Specifically check Supabase variables
    env['SUPABASE_URL_SET'] = importMetaEnv.VITE_SUPABASE_URL ? 'YES' : 'NO';
    env['SUPABASE_ANON_KEY_SET'] = importMetaEnv.VITE_SUPABASE_ANON_KEY ? 'YES' : 'NO';
    
    // Also check process.env
    try {
      if (typeof process !== 'undefined' && process.env) {
        env['PROCESS_ENV_AVAILABLE'] = 'YES';
        env['PROCESS_ENV_SUPABASE_URL'] = process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET';
        env['PROCESS_ENV_SUPABASE_KEY'] = process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET';
      } else {
        env['PROCESS_ENV_AVAILABLE'] = 'NO';
      }
    } catch (err) {
      env['PROCESS_ENV_AVAILABLE'] = 'ERROR';
    }
    
    setEnvVars(env);
    
    // Test direct Supabase connection
    testConnection().then(result => {
      setConnectionStatus(result);
    });
  }, []);
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      zIndex: 10000,
      padding: 20, 
      background: '#f0f0f0', 
      border: '1px solid #ccc',
      borderRadius: 8,
      maxWidth: 500,
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h2>Environment Variables Check</h2>
      <div>
        <strong>VITE_SUPABASE_URL set:</strong> {envVars.SUPABASE_URL_SET || 'Checking...'}
      </div>
      <div>
        <strong>VITE_SUPABASE_ANON_KEY set:</strong> {envVars.SUPABASE_ANON_KEY_SET || 'Checking...'}
      </div>
      
      <h3>Direct Supabase Connection Test:</h3>
      <div style={{
        padding: 10,
        background: connectionStatus.success ? '#d4edda' : '#f8d7da',
        border: `1px solid ${connectionStatus.success ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: 4,
        marginBottom: 10
      }}>
        {connectionStatus.success 
          ? 'Connection successful! The direct client is working.' 
          : connectionStatus.error 
            ? `Connection error: ${connectionStatus.error}` 
            : 'Testing connection...'}
      </div>
      
      <div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '8px 16px',
            background: '#6741d9',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginBottom: 10
          }}
        >
          Reload Page
        </button>
      </div>
      
      <h3>All VITE_ Environment Variables:</h3>
      <pre style={{ 
        background: '#333', 
        color: '#fff', 
        padding: 10, 
        borderRadius: 4,
        maxHeight: 300,
        overflow: 'auto'
      }}>
        {JSON.stringify(envVars, null, 2)}
      </pre>
    </div>
  );
}