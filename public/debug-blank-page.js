// Debug script to help diagnose blank page issues
(function() {
  console.log('Running blank page debug script');
  
  // Log the document structure
  console.log('Document state:', document.readyState);
  console.log('HTML classes:', document.documentElement.className);
  console.log('Root element:', document.getElementById('root'));
  
  // Log any errors
  const loggedErrors = [];
  const originalError = console.error;
  console.error = function() {
    loggedErrors.push(Array.from(arguments).join(' '));
    originalError.apply(console, arguments);
  };
  
  // Check images
  const allImages = document.querySelectorAll('img');
  console.log('Total images:', allImages.length);
  console.log('Visible images:', Array.from(allImages).filter(img => {
    const style = window.getComputedStyle(img);
    return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden';
  }).length);
  
  // Force show everything after 5 seconds for debugging
  setTimeout(function() {
    console.log('Applying emergency visibility fixes');
    
    // Make all images visible
    document.querySelectorAll('img').forEach(img => {
      img.style.opacity = '1';
      img.style.display = 'inline-block';
    });
    
    // Remove loading class that might be hiding content
    document.documentElement.classList.remove('loading');
    document.documentElement.classList.add('content-loaded');
    
    // Force everything to be visible
    const forceShowStyles = document.createElement('style');
    forceShowStyles.textContent = `
      * {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      }
      
      style, script, link, meta {
        display: none !important;
      }
      
      img, button, a {
        display: inline-block !important;
      }
    `;
    document.head.appendChild(forceShowStyles);
    
    // Report all errors found
    console.log('Logged errors:', loggedErrors);
  }, 5000);
})();