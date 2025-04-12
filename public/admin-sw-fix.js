/**
 * Service Worker Unregistration Script for Admin Pages
 * This script unregisters any active service workers when viewing admin pages
 * to prevent CORS and caching issues with the Supabase API.
 */

(function() {
  // Only run on admin pages
  if (window.location.pathname.includes('/admin/')) {
    console.log('[Admin Fix] Running service worker unregistration for admin page');
    
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // First, try to message any active service worker to unregister itself
      navigator.serviceWorker.ready
        .then(registration => {
          console.log('[Admin Fix] Sending unregister message to service worker');
          registration.active.postMessage({ type: 'UNREGISTER' });
          
          // Also directly unregister after sending the message
          return navigator.serviceWorker.getRegistrations();
        })
        .then(registrations => {
          console.log(`[Admin Fix] Found ${registrations.length} service worker registrations`);
          
          // Unregister all service workers
          const unregisterPromises = registrations.map(registration => {
            console.log('[Admin Fix] Unregistering service worker');
            return registration.unregister();
          });
          
          return Promise.all(unregisterPromises);
        })
        .then(results => {
          if (results && results.length > 0) {
            console.log(`[Admin Fix] Successfully unregistered ${results.filter(Boolean).length} service workers`);
            
            // Optional: Hard reload if we unregistered any workers
            if (results.some(Boolean) && sessionStorage.getItem('sw_unregistered') !== 'true') {
              console.log('[Admin Fix] Reloading page after service worker unregistration');
              sessionStorage.setItem('sw_unregistered', 'true');
              window.location.reload();
            }
          } else {
            console.log('[Admin Fix] No service workers needed to be unregistered');
          }
        })
        .catch(error => {
          console.error('[Admin Fix] Service worker unregistration failed:', error);
        });
    }
    
    // Also add CORS compatibility mode for Supabase requests
    if (window.supabaseCorsMode === undefined) {
      window.supabaseCorsMode = 'anonymous';
      console.log('[Admin Fix] Set Supabase CORS mode to anonymous');
    }
  }
})();