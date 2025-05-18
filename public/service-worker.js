// Service Worker with improved CSS handling - using build-time assets only
const CACHE_NAME = 'zerovacancy-cache-v4';

// Assets that need special handling - only include files that exist at build time
const CRITICAL_ASSETS = [
  '/fallback-index.html',
  '/logo.png',
  '/logo.webp',
  '/env-config.js',
  '/cls-prevention.css',
  '/favicon.ico'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service worker pre-caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .catch(err => {
        console.error('Pre-caching failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service worker removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Special handling for CSS files to prevent caching issues
const handleCssRequest = async (request) => {
  // Validate request scheme before proceeding
  const url = new URL(request.url);
  const protocol = url.protocol;
  if (!['http:', 'https:'].includes(protocol)) {
    // Skip any non-HTTP(S) requests
    console.log('Skipping CSS handling for non-HTTP request:', protocol);
    return fetch(request);
  }
  
  // Try network first for CSS files
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful, complete responses
    if (networkResponse.status === 200 && networkResponse.ok) {
      // Clone the response to save in cache
      const responseToCache = networkResponse.clone();
      
      // Update the cache with fresh CSS
      caches.open(CACHE_NAME).then(cache => {
        try {
          cache.put(request, responseToCache);
        } catch (cacheError) {
          console.warn('Failed to cache CSS response:', cacheError);
        }
      });
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If cache fails too, return a simple CSS file
    return new Response('/* Emergency CSS fallback */', {
      headers: { 'Content-Type': 'text/css' }
    });
  }
};

// Fetch event - network first for CSS, cache first for other assets
self.addEventListener('fetch', (event) => {
  // Don't handle event if there's no respondWith method (Firefox private browsing, etc.)
  if (!event.respondWith) {
    return;
  }
  
  // Safety check to prevent errors if the fetch event is already handled
  if (event.handled === true) {
    return;
  }
  
  // Mark event as handled to prevent duplicate processing
  event.handled = true;
  
  try {
    // Safely parse URL - if this fails, we'll skip SW processing
    let url;
    try {
      url = new URL(event.request.url);
    } catch (urlError) {
      console.warn('Invalid URL in fetch handler:', event.request.url);
      return; // Skip service worker handling for invalid URLs
    }
    
    const protocol = url.protocol;

    // Skip non-HTTP requests entirely
    if (!['http:', 'https:'].includes(protocol)) {
      // Just pass through without service worker handling
      return;
    }
    
    // For admin pages or Supabase URLs, skip service worker handling completely
    if (url.pathname.includes('/admin/') || 
        url.hostname.includes('supabase.co') ||
        url.hostname.includes('supabase.in')) {
      return; // Let browser handle admin and API requests directly
    }
    
    // Handle CSS files specially (with generalized patterns)
    if (url.pathname.endsWith('.css') || url.pathname.includes('/assets/')) {
      event.respondWith(handleCssRequest(event.request));
      return;
    }
    
    // For other requests, use cache first, then network
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return the cached response if we have it
          if (response) {
            return response;
          }
          
          // Otherwise try to fetch from network
          return fetch(event.request)
            .then(networkResponse => {
              // Don't cache if not a GET request
              if (event.request.method !== 'GET') {
                return networkResponse;
              }
              
              // Only cache successful complete responses
              if (!networkResponse || networkResponse.status !== 200 || !networkResponse.ok) {
                return networkResponse;
              }
              
              // Clone the response to save in cache and return the original
              const responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  try {
                    cache.put(event.request, responseToCache);
                  } catch (cacheError) {
                    console.warn('Failed to cache response:', cacheError);
                  }
                })
                .catch(err => {
                  console.warn('Cache open failed:', err);
                });
              
              return networkResponse;
            })
            .catch(fetchError => {
              console.warn('Network fetch failed:', fetchError);
              
              // Check if this is an image and return a placeholder if so
              if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
                return new Response('', {
                  status: 200,
                  headers: { 'Content-Type': 'image/svg+xml' }
                });
              }
              
              // For API or other failures, let browser handle the error
              throw fetchError;
            });
        })
        .catch((error) => {
          console.warn('Cache match error:', error);
          // Let the browser handle other failed requests by passing through
          return fetch(event.request).catch(() => {
            // Last resort fallback for critical resources
            if (url.pathname === '/' || url.pathname === '/index.html') {
              return caches.match('/index.html');
            }
            // Let browser handle the error for other resources
            throw error;
          });
        })
    );
  } catch (parseError) {
    // Handle any exceptions in the fetch handler
    console.error('Service worker fetch handler error:', parseError);
    // Allow the browser to handle the request normally
    return;
  }
});

// Listen for messages from the main page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // This allows the service worker to become active immediately
    self.skipWaiting();
  }
  
  // Handle unregister request
  if (event.data && event.data.type === 'UNREGISTER') {
    self.registration.unregister()
      .then(() => console.log('Service worker unregistered successfully'))
      .catch(err => console.error('Service worker unregister failed:', err));
  }
  
  // Handle prefetch request
  if (event.data && event.data.type === 'PREFETCH_RESOURCES' && event.data.resources) {
    // Prefetch resources in the background
    event.data.resources.forEach(urlString => {
      try {
        // Validate URL before fetching
        const url = new URL(urlString);
        const protocol = url.protocol;
        
        // Only prefetch HTTP/HTTPS resources
        if (['http:', 'https:'].includes(protocol)) {
          fetch(urlString, { mode: 'no-cors' })
            .then(response => {
              // Only cache successful responses
              if (response.status === 200 && response.ok) {
                // We could cache these responses, but for now just warm up the browser cache
                console.log('Prefetched resource: ' + urlString);
              }
            })
            .catch(() => {
              // Silently fail prefetch attempts
            });
        }
      } catch (error) {
        // Silently handle invalid URLs
        console.warn('Invalid prefetch URL: ' + urlString);
      }
    });
  }
});
