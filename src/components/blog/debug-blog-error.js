// Debug utility for blog post errors
// Load this script early in your app for detailed React error messages

window.addEventListener('error', function(event) {
  console.group('🚨 React Error Details');
  console.error('Original error:', event.error);
  
  // Check if this is a React error
  if (event.error && event.error.message && 
     (event.error.message.includes('React') || event.error.message.includes('Minified React error #'))) {
    console.warn('This appears to be a React error. Adding additional debug info...');
    
    // Log component stack if available
    if (event.error._componentStack) {
      console.error('Component stack:', event.error._componentStack);
    }
    
    // Check for common React error patterns
    const errorMsg = event.error.message;
    
    if (errorMsg.includes('Minified React error #310')) {
      console.warn('Error #310 often indicates an issue with hydration or undefined props');
      console.warn('This happens when server-rendered markup doesn\'t match client-side render');
      console.warn('Check for:');
      console.warn('1. Missing or undefined props');
      console.warn('2. Data type mismatches');
      console.warn('3. Conditional rendering differences between server/client');
    }
    
    // Log current URL and route info
    console.info('Current URL:', window.location.href);
    console.info('Pathname:', window.location.pathname);
    
    // If this is a blog post, gather blog-specific debug info
    if (window.location.pathname.startsWith('/blog/')) {
      const slug = window.location.pathname.replace('/blog/', '');
      console.info('Blog post slug:', slug);
      
      // Add placeholder to inspect the blog post data when it's loaded
      // We need to add this after React has loaded, so let's schedule it
      setTimeout(() => {
        // Wait for React to attach, then try to find the blog post component
        const blogPostElement = document.querySelector('article');
        if (blogPostElement) {
          console.info('Blog post element found:', blogPostElement);
          console.info('Blog post props might be accessible in React DevTools');
        }
      }, 1000);
    }
  }
  
  console.groupEnd();
});

// Add detailed React error overlay in development
if (process.env.NODE_ENV !== 'production') {
  window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ || {};
  window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.dismissRuntimeErrors = () => {};
}

// Log when the script has loaded
console.info('📝 React error debug utilities loaded');