// Debug script to verify environment variables are correctly loaded
(function() {
  console.log('%c Environment Variables Checker ', 'background: #333; color: #00ff00; font-size: 16px; padding: 4px;');

  // Check all possible sources of environment variables
  const sources = [
    { name: 'window.env', value: typeof window !== 'undefined' ? window.env : undefined },
    { name: 'window.RUNTIME_ENV', value: typeof window !== 'undefined' ? window.RUNTIME_ENV : undefined },
    { name: 'import.meta.env (indirect check)', value: 'Cannot access directly in runtime script' }
  ];

  // Log each source
  sources.forEach(source => {
    console.group(`Source: ${source.name}`);
    if (!source.value) {
      console.log('%c NOT DEFINED', 'color: #ff0000; font-weight: bold;');
    } else {
      console.log('%c DEFINED', 'color: #00ff00; font-weight: bold;');
      
      // For defined sources, check for specific variables
      if (source.name !== 'import.meta.env (indirect check)') {
        const vars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
        vars.forEach(varName => {
          const value = source.value[varName];
          const hasValue = Boolean(value);
          console.log(
            `${varName}: ${hasValue ? '%c PRESENT' : '%c MISSING'}`,
            `color: ${hasValue ? '#00ff00' : '#ff0000'}; font-weight: bold;`
          );
          
          // For URL values, validate format
          if (varName === 'VITE_SUPABASE_URL' && value) {
            try {
              const isValidUrl = value.startsWith('http');
              console.log(
                `URL format: ${isValidUrl ? '%c VALID' : '%c INVALID'}`,
                `color: ${isValidUrl ? '#00ff00' : '#ff0000'}; font-weight: bold;`
              );
            } catch (e) {
              console.log('%c ERROR validating URL', 'color: #ff0000; font-weight: bold;');
            }
          }
          
          // For keys, check length
          if (varName === 'VITE_SUPABASE_ANON_KEY' && value) {
            const keyLength = value.length;
            const isReasonableLength = keyLength > 20;
            console.log(
              `Key length: ${keyLength} (${isReasonableLength ? '%c VALID' : '%c SUSPICIOUS'})`,
              `color: ${isReasonableLength ? '#00ff00' : '#ff9900'}; font-weight: bold;`
            );
          }
        });
      }
    }
    console.groupEnd();
  });

  // Show summary alert at top of page
  const allSources = sources.filter(s => s.name !== 'import.meta.env (indirect check)');
  const workingSources = allSources.filter(s => s.value && (s.value.VITE_SUPABASE_URL || s.value.VITE_SUPABASE_ANON_KEY));
  
  // Create floating debug panel
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #00ff00;
    padding: 15px;
    border-radius: 5px;
    font-family: monospace;
    z-index: 10000;
    max-width: 400px;
    font-size: 12px;
  `;
  
  if (workingSources.length > 0) {
    panel.innerHTML = `
      <div style="color: #00ff00; font-weight: bold; margin-bottom: 10px;">✅ Environment Variables Found</div>
      <div>Working source(s): ${workingSources.map(s => s.name).join(', ')}</div>
      <div style="margin-top: 10px; font-size: 10px; color: #aaa;">
        Click to dismiss or wait 30s for auto-dismiss
      </div>
    `;
  } else {
    panel.innerHTML = `
      <div style="color: #ff0000; font-weight: bold; margin-bottom: 10px;">❌ NO ENVIRONMENT VARIABLES FOUND</div>
      <div>All sources checked: ${allSources.map(s => s.name).join(', ')}</div>
      <div style="margin-top: 10px; color: #ff0000;">
        The application will fall back to hardcoded values
      </div>
      <div style="margin-top: 10px; font-size: 10px; color: #aaa;">
        Click to dismiss or wait 30s for auto-dismiss
      </div>
    `;
    panel.style.background = 'rgba(50, 0, 0, 0.9)';
  }
  
  // Add click to dismiss
  panel.addEventListener('click', function() {
    document.body.removeChild(panel);
  });
  
  // Auto-dismiss after 30 seconds
  setTimeout(function() {
    if (panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
  }, 30000);
  
  // Append to body when ready
  if (document.body) {
    document.body.appendChild(panel);
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(panel);
    });
  }
})();