// ZeroVacancy Service Worker - Enhanced for Desktop Performance
const CACHE_NAME = 'zerovacancy-cache-v1';
const STATIC_CACHE_NAME = 'zerovacancy-static-v1';
const IMAGE_CACHE_NAME = 'zerovacancy-images-v1';
const JS_CACHE_NAME = 'zerovacancy-js-v1';
const CSS_CACHE_NAME = 'zerovacancy-css-v1';
const API_CACHE_NAME = 'zerovacancy-api-v1';

// Critical assets to precache for immediate access
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/favicon.png',
  '/manifest.json',
  '/quick-perf.js',
  '/heroparallax/heroparallax1.jpg',
  '/heroparallax/heroparallax2.jpg',
];

// Additional static assets to cache on desktop
const DESKTOP_ASSETS = [
  '/heroparallax/heroparallax3.jpg',
  '/heroparallax/heroparallax4.jpg',
  '/heroparallax/heroparallax5.jpg',
];

// Check if request is coming from desktop
const isDesktop = (request) => {
  // Check user agent if available
  const userAgent = request.headers ? request.headers.get('User-Agent') : null;
  if (userAgent && userAgent.match(/Mobile|Android|iPhone|iPad|iPod/i)) {
    return false;
  }
  
  // Default to desktop cachng strategy 
  return true;
};

// Get the appropriate cache based on request type
const getCacheForRequest = (request) => {
  const url = new URL(request.url);
  
  // For desktop, use specific cache types
  if (request.destination === 'image') {
    return IMAGE_CACHE_NAME;
  } else if (request.destination === 'script') {
    return JS_CACHE_NAME;
  } else if (request.destination === 'style') {
    return CSS_CACHE_NAME;
  } else if (url.pathname.startsWith('/api/')) {
    return API_CACHE_NAME;
  }
  
  // Default static assets
  return STATIC_CACHE_NAME;
};

// Install event - precache essential assets with desktop enhancement
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache essential assets for all devices
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      }),
      
      // Set up specialized caches
      caches.open(IMAGE_CACHE_NAME),
      caches.open(JS_CACHE_NAME),
      caches.open(CSS_CACHE_NAME),
      caches.open(API_CACHE_NAME),
      
      // Cache desktop-specific assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        // Check if running on desktop-like device
        if (self.registration.scope.includes('localhost') || 
            !navigator.userAgent.match(/Mobile|Android|iPhone|iPad|iPod/i)) {
          return cache.addAll(DESKTOP_ASSETS);
        }
        return Promise.resolve();
      })
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [
    STATIC_CACHE_NAME, 
    IMAGE_CACHE_NAME, 
    JS_CACHE_NAME, 
    CSS_CACHE_NAME,
    API_CACHE_NAME
  ];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - enhanced with desktop strategy
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip certain paths or external resources
  const url = new URL(event.request.url);
  if (url.hostname !== self.location.hostname) {
    return;
  }
  
  // Skip admin routes
  if (url.pathname.startsWith('/admin/')) {
    return;
  }
  
  // Determine the appropriate strategy based on desktop/mobile and resource type
  const isClientDesktop = isDesktop(event.request);
  const destination = event.request.destination;
  
  // Choose appropriate cache for this request
  const cacheName = getCacheForRequest(event.request);
  
  // Desktop gets enhanced caching strategy with stale-while-revalidate
  if (isClientDesktop) {
    // Special handling for API routes on desktop
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        caches.open(API_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
              // Cache fresh response, even for short time
              const clonedResponse = response.clone();
              cache.put(event.request, clonedResponse);
              return response;
            })
            .catch(() => {
              // Return cached API responses if offline
              return cache.match(event.request);
            });
        })
      );
      return;
    }
    
    // Images use cache-first strategy on desktop
    if (destination === 'image') {
      event.respondWith(
        caches.open(IMAGE_CACHE_NAME)
          .then(cache => {
            return cache.match(event.request)
              .then(cachedResponse => {
                // Return cached response immediately if available
                if (cachedResponse) {
                  // Revalidate the cache in the background
                  const fetchPromise = fetch(event.request)
                    .then(networkResponse => {
                      cache.put(event.request, networkResponse.clone());
                      return networkResponse;
                    })
                    .catch(() => cachedResponse);
                  
                  // Return the cached response immediately
                  return cachedResponse;
                }
                
                // If not in cache, fetch and cache
                return fetch(event.request)
                  .then(networkResponse => {
                    const clonedResponse = networkResponse.clone();
                    if (networkResponse.ok) {
                      cache.put(event.request, clonedResponse);
                    }
                    return networkResponse;
                  });
              });
          })
      );
      return;
    }
    
    // Desktop uses stale-while-revalidate for CSS and JS
    if (destination === 'script' || destination === 'style') {
      event.respondWith(
        caches.open(destination === 'script' ? JS_CACHE_NAME : CSS_CACHE_NAME)
          .then(cache => {
            return cache.match(event.request)
              .then(cachedResponse => {
                // Clone the fetch request so we can use it twice
                const fetchPromise = fetch(event.request)
                  .then(networkResponse => {
                    // Don't cache error responses
                    if (networkResponse.ok) {
                      cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                  })
                  .catch(error => {
                    // If the network is unreachable, we should still return
                    // the cached version if available
                    if (cachedResponse) return cachedResponse;
                    throw error;
                  });
                
                // Return the cached version first (stale) or wait for network
                return cachedResponse || fetchPromise;
              });
          })
      );
      return;
    }
    
    // Default stale-while-revalidate strategy for other resources on desktop
    event.respondWith(
      caches.open(STATIC_CACHE_NAME)
        .then(cache => {
          return cache.match(event.request)
            .then(cachedResponse => {
              const fetchPromise = fetch(event.request)
                .then(networkResponse => {
                  if (networkResponse.ok) {
                    cache.put(event.request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => cachedResponse);
              
              return cachedResponse || fetchPromise;
            });
        })
    );
    return;
  }
  
  // Mobile gets simpler strategy
  // Images use cache-first for mobile
  if (destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(networkResponse => {
              if (!networkResponse || !networkResponse.ok) {
                return networkResponse;
              }
              
              const responseToCache = networkResponse.clone();
              caches.open(IMAGE_CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
                
              return networkResponse;
            });
        })
    );
  } else {
    // All other resources use network-first for mobile
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response || !response.ok) {
            return response;
          }
          
          const responseToCache = response.clone();
          const cacheName = getCacheForRequest(event.request);
          
          caches.open(cacheName)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Enhanced message handling for desktop optimization
self.addEventListener('message', (event) => {
  // Skip waiting to activate immediately
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Clear specific cache types
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    const cacheNames = event.data.cacheNames || [
      STATIC_CACHE_NAME, 
      IMAGE_CACHE_NAME, 
      JS_CACHE_NAME, 
      CSS_CACHE_NAME,
      API_CACHE_NAME
    ];
    
    event.waitUntil(
      Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      ).then(() => {
        // Confirm cache clearing back to the client
        event.ports[0].postMessage({
          type: 'CACHE_CLEARED',
          clearedCaches: cacheNames
        });
      })
    );
  }
  
  // Prefetch and cache resources for desktop
  if (event.data && event.data.type === 'PREFETCH_RESOURCES') {
    const resources = event.data.resources || [];
    
    if (resources.length === 0) return;
    
    // Desktop specific prefetching
    if (isDesktop(event.request)) {
      event.waitUntil(
        Promise.all(
          resources.map(resource => {
            const cacheName = getCacheForRequest(new Request(resource));
            return caches.open(cacheName).then(cache => {
              return fetch(resource)
                .then(response => {
                  if (response.ok) {
                    return cache.put(resource, response);
                  }
                  return Promise.resolve();
                })
                .catch(() => Promise.resolve());
            });
          })
        ).then(() => {
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({
              type: 'PREFETCH_COMPLETE',
              count: resources.length
            });
          }
        })
      );
    }
  }
});