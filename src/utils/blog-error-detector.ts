/**
 * Blog Error Detector - Utility to detect and log detailed React errors
 * Especially focused on hydration mismatches in blog posts
 */

interface PropertyAnalysis {
  exists: boolean;
  type: string;
  valuePreview: string;
}

// This function gets injected in development mode to provide detailed error logs
export function setupBlogErrorDetection() {
  if (typeof window === 'undefined') return;
  
  // Check if we're on a blog post page
  const isBlogPost = window.location.pathname.startsWith('/blog/') && 
                     !window.location.pathname.endsWith('/blog/');
                    
  if (!isBlogPost) return;
  
  console.log('🔍 Blog post error detection active on:', window.location.pathname);
  
  // Store original console.error to avoid infinite loops
  const originalConsoleError = console.error;
  
  // Override console.error to catch React errors
  console.error = function(...args: any[]) {
    // Call original first to ensure error is logged
    originalConsoleError.apply(console, args);
    
    // Look for React errors, especially minified errors like #310
    const errorText = args.join(' ');
    if (
      (typeof errorText === 'string' && errorText.includes('Minified React error #310')) ||
      (args[0] && args[0].message && args[0].message.includes('Minified React error #310'))
    ) {
      // This is likely a hydration mismatch - log more details
      console.group('🔬 Detailed Blog Post Error Analysis');
      console.warn('Detected a React hydration mismatch error in blog post');
      
      try {
        // Get the blog post slug from the URL
        const slug = window.location.pathname.split('/blog/')[1];
        console.log('Blog post slug:', slug);
        
        // Find the blog post article element
        const articleElement = document.querySelector('article');
        if (articleElement) {
          console.log('Found blog post article element');
          
          // Check for common issues with images
          const images = articleElement.querySelectorAll('img');
          if (images.length) {
            console.log(`Found ${images.length} images in blog post`);
            
            // Check the first image for common issues
            const firstImage = images[0];
            console.log('First image analysis:', {
              src: firstImage.src,
              hasAlt: !!firstImage.alt,
              width: firstImage.width,
              height: firstImage.height,
              loading: firstImage.loading,
              isLoaded: firstImage.complete
            });
          }
          
          // Look for React-related metadata in the DOM
          const reactAttrs = Array.from(articleElement.attributes)
            .filter(attr => attr.name.startsWith('data-reactroot') || 
                           attr.name.startsWith('data-react'));
            
          if (reactAttrs.length) {
            console.log('Found React-related attributes:', 
              reactAttrs.map(attr => `${attr.name}="${attr.value}"`).join(', ')
            );
          }
        }
        
        // Try to find any React component data in the window
        // This is somewhat of a best effort since we don't have direct access 
        // to React internals in production
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || (window as any).__REACT_DEVTOOLS_BRIDGE_FACADE) {
          console.log('React DevTools hook detected - data may be available in DevTools');
        }
        
        // Log global error handler
        console.log('Setting up global error handler for more detailed error logs');
        
        // Add a more detailed error handler
        window.addEventListener('error', function(event) {
          if (event.error && typeof event.error.message === 'string') {
            // Check if it's React-related
            if (event.error.message.includes('React') || 
                event.error.message.includes('hydrat') ||
                event.error.message.includes('render')) {
              
              console.group('📌 React Error Details');
              console.error('Error message:', event.error.message);
              
              // Try to extract component stack
              if ((event.error as any)._reactError || 
                  (event.error as any).componentStack || 
                  (event.error as any)._componentStack) {
                console.log('Component stack:', 
                  (event.error as any)._componentStack || 
                  (event.error as any).componentStack || 
                  'Not available'
                );
              }
              
              console.groupEnd();
            }
          }
        });
      } catch (e) {
        console.error('Error during blog post error analysis:', e);
      }
      
      console.groupEnd();
    }
  };
  
  // Inject HTML diagnostic helper
  const diagScript = document.createElement('script');
  diagScript.textContent = `
    // Helper for diagnostics - adds DOM inspection in browser
    (function() {
      // Wait for page to finish loading and blog post to be rendered
      setTimeout(function() {
        // Find blog post container
        const blogPost = document.querySelector('article');
        if (!blogPost) return;
        
        // Look for potential React hydration issues
        const possibleIssues = [];
        
        // Check for missing content
        if (!blogPost.textContent.trim()) {
          possibleIssues.push('Blog post content appears empty');
        }
        
        // Check for component root elements
        const rootElements = document.querySelectorAll('[data-reactroot]');
        if (rootElements.length > 1) {
          possibleIssues.push('Multiple React root elements detected, possible hydration issue');
        }
        
        // Check for server-client render differences
        const serverRenderedMarkers = document.querySelectorAll('[data-reactid]');
        if (serverRenderedMarkers.length > 0) {
          possibleIssues.push('Server-rendered React markers found, possible hydration mismatch');
        }
        
        // Looking for image issues - a common source of problems
        const images = blogPost.querySelectorAll('img');
        const brokenImages = Array.from(images).filter(img => 
          !img.complete || img.naturalHeight === 0 || img.naturalWidth === 0
        );
        
        if (brokenImages.length > 0) {
          possibleIssues.push('Broken or non-loading images detected: ' + brokenImages.length);
        }
        
        // Log results if we found issues
        if (possibleIssues.length > 0) {
          console.warn('⚠️ Potential blog post rendering issues detected:');
          possibleIssues.forEach(issue => console.warn(' - ' + issue));
        }
      }, 2000); // Wait 2 seconds for everything to settle
    })();
  `;
  
  // Add the diagnostic script
  document.head.appendChild(diagScript);
}