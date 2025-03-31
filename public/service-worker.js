// Service Worker with improved CSS handling
const CACHE_NAME = 'zerovacancy-cache-v1';

// Assets that need special handling
const CRITICAL_ASSETS = [
  '/index.html',
  '/logo.png',
  '/src/main.tsx',
  '/assets/css/styles.css'
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
  // Try network first for CSS files
  try {
    const networkResponse = await fetch(request);
    // Clone the response to save in cache
    const responseToCache = networkResponse.clone();
    
    // Update the cache with fresh CSS
    caches.open(CACHE_NAME).then(cache => {
      cache.put(request, responseToCache);
    });
    
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
  const url = new URL(event.request.url);
  
  // Handle CSS files specially
  if (url.pathname.endsWith('.css') || url.pathname.includes('/assets/css/')) {
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
        return fetch(event.request).then(
          (networkResponse) => {
            // Don't cache if not a GET request
            if (event.request.method !== 'GET') {
              return networkResponse;
            }
            
            // Clone the response to save in cache and return the original
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          }
        );
      })
      .catch(() => {
        // If both cache and network fail for resources like images, 
        // return an empty response with appropriate content type
        const url = new URL(event.request.url);
        if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
          return new Response('', {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        }
        
        // Let the browser handle other failed requests
        return;
      })
  );
});

// Listen for messages from the main page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // This allows the service worker to become active immediately
    self.skipWaiting();
  }
  
  // Handle prefetch request
  if (event.data && event.data.type === 'PREFETCH_RESOURCES' && event.data.resources) {
    // Prefetch resources in the background
    event.data.resources.forEach(url => {
      fetch(url, { mode: 'no-cors' }).catch(() => {
        // Silently fail prefetch attempts
      });
    });
  }
});
