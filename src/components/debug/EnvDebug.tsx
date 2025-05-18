import React, { useEffect, useState } from 'react';

/**
 * Component to debug environment variables
 * ONLY use this during development or troubleshooting
 * NEVER show actual variable values in production
 */
export default function EnvDebug() {
  const [variables, setVariables] = useState<Record<string, boolean>>({});
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    // Only run in development or when explicitly enabled
    const isDev = import.meta.env.DEV;
    const debugEnabled = window.location.search.includes('debug=env');
    
    if (!isDev && !debugEnabled) {
      return;
    }
    
    // Collect information about which env variables exist
    // NOTE: We ONLY store boolean values (exists/doesn't exist)
    // We NEVER store the actual values to avoid security issues
    const vars: Record<string, boolean> = {};
    
    // Check import.meta.env
    try {
      vars['import.meta.env.VITE_SUPABASE_URL'] = !!import.meta.env.VITE_SUPABASE_URL;
      vars['import.meta.env.VITE_SUPABASE_ANON_KEY'] = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      vars['import.meta.env.MODE'] = !!import.meta.env.MODE;
      vars['import.meta.env.DEV'] = !!import.meta.env.DEV;
      vars['import.meta.env.PROD'] = !!import.meta.env.PROD;
    } catch (err) {
      vars['import.meta.env.ERROR'] = true;
    }
    
    // Check window.RUNTIME_ENV
    try {
      vars['window.RUNTIME_ENV'] = !!window.RUNTIME_ENV;
      if (window.RUNTIME_ENV) {
        vars['window.RUNTIME_ENV.VITE_SUPABASE_URL'] = !!window.RUNTIME_ENV.VITE_SUPABASE_URL;
        vars['window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY'] = !!window.RUNTIME_ENV.VITE_SUPABASE_ANON_KEY;
      }
    } catch (err) {
      vars['window.RUNTIME_ENV.ERROR'] = true;
    }
    
    // Check window.env
    try {
      vars['window.env'] = !!window.env;
      if (window.env) {
        vars['window.env.VITE_SUPABASE_URL'] = !!window.env.VITE_SUPABASE_URL;
        vars['window.env.VITE_SUPABASE_ANON_KEY'] = !!window.env.VITE_SUPABASE_ANON_KEY;
      }
    } catch (err) {
      vars['window.env.ERROR'] = true;
    }
    
    // Store results and show debug panel
    setVariables(vars);
    setShowDebug(true);
  }, []);
  
  if (!showDebug) {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Environment Variables Debug</h4>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px' }}>Variable</th>
            <th style={{ textAlign: 'left', padding: '4px' }}>Exists</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(variables).map(([variable, exists]) => (
            <tr key={variable} style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <td style={{ padding: '4px' }}>{variable}</td>
              <td style={{ padding: '4px', color: exists ? '#4caf50' : '#f44336' }}>
                {exists ? '✓' : '✗'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
        Add ?debug=env to URL to show this panel in production
      </div>
    </div>
  );
}