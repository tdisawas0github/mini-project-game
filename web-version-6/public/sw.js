const CACHE_NAME = 'ellidra-v3';
const STATIC_CACHE = 'ellidra-static-v3';
const IMAGE_CACHE = 'ellidra-images-v3';
const RUNTIME_CACHE = 'ellidra-runtime-v3';

// Cache strategies
const CACHE_STRATEGIES = {
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
};

const urlsToCache = [
  '/',
  '/manifest.json',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png'
];

// Critical WebP images to cache
const imagesToCache = [
  '/assets/map-of-valdaren.webp',
  '/assets/factions-of-valdaren.webp',
  '/assets/problems-map.webp'
];

// Fallback PNG images
const fallbackImages = [
  '/assets/map-of-valdaren.png',
  '/assets/factions-of-valdaren.png',
  '/assets/problems-map.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('Service Worker: Caching static files');
          return cache.addAll(urlsToCache);
        }),
      // Cache WebP images with fallback
      caches.open(IMAGE_CACHE)
        .then(async (cache) => {
          console.log('Service Worker: Caching optimized images');
          
          // Try to cache WebP images first
          for (const webpUrl of imagesToCache) {
            try {
              const response = await fetch(webpUrl);
              if (response.ok) {
                await cache.put(webpUrl, response);
              }
            } catch (error) {
              console.log(`Failed to cache ${webpUrl}, will use fallback`);
            }
          }
          
          // Cache PNG fallbacks
          for (const pngUrl of fallbackImages) {
            try {
              const response = await fetch(pngUrl);
              if (response.ok) {
                await cache.put(pngUrl, response);
              }
            } catch (error) {
              console.log(`Failed to cache fallback ${pngUrl}`);
            }
          }
        })
    ]).catch((err) => {
      console.log('Service Worker: Cache failed', err);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== IMAGE_CACHE &&
                cacheName !== RUNTIME_CACHE) {
              console.log('Service Worker: Clearing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim clients immediately
      self.clients.claim()
    ])
  );
});

// Enhanced fetch handler with better caching strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Handle image requests with WebP optimization
  if (url.pathname.includes('/assets/') && 
      (url.pathname.endsWith('.png') || url.pathname.endsWith('.webp') || 
       url.pathname.endsWith('.jpg') || url.pathname.endsWith('.jpeg'))) {
    
    event.respondWith(handleImageRequest(event.request));
    return;
  }
  
  // Handle JavaScript and CSS files with cache-first strategy
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(handleStaticAsset(event.request));
    return;
  }
  
  // Handle HTML pages with network-first strategy
  if (event.request.destination === 'document') {
    event.respondWith(handleDocumentRequest(event.request));
    return;
  }
  
  // Default cache strategy for other resources
  event.respondWith(handleDefaultRequest(event.request));
});

// Handle static assets (JS, CSS) with cache-first strategy
async function handleStaticAsset(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Static asset fetch failed:', error);
    throw error;
  }
}

// Handle document requests with network-first strategy
async function handleDocumentRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Return offline fallback
    return caches.match('/') || new Response('Offline', { status: 503 });
  }
}

// Handle default requests
async function handleDefaultRequest(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Stale-while-revalidate: return cached version, update in background
    fetch(request).then(response => {
      if (response.ok) {
        const cache = caches.open(RUNTIME_CACHE);
        cache.then(c => c.put(request, response));
      }
    }).catch(() => {
      // Ignore background update failures
    });
    
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Resource not available', { status: 404 });
  }
}

// Enhanced image request handler with better caching and format support
async function handleImageRequest(request) {
  const url = new URL(request.url);
  
  // Check if request is for PNG and browser supports WebP
  if (url.pathname.endsWith('.png') && 
      request.headers.get('accept')?.includes('image/webp')) {
    
    const webpUrl = url.pathname.replace('.png', '.webp');
    
    // Try WebP from cache first
    const webpCached = await caches.match(webpUrl);
    if (webpCached) {
      return webpCached;
    }
    
    // Try to fetch WebP from network
    try {
      const webpResponse = await fetch(webpUrl);
      if (webpResponse.ok) {
        // Cache the WebP version with appropriate headers
        const cache = await caches.open(IMAGE_CACHE);
        const responseToCache = webpResponse.clone();
        
        // Add cache headers for better performance
        const headers = new Headers(responseToCache.headers);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        
        cache.put(webpUrl, new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers
        }));
        
        return webpResponse;
      }
    } catch (error) {
      console.log('WebP not available, falling back to PNG');
    }
  }
  
  // Handle other image formats (JPEG, etc.)
  if (url.pathname.match(/\.(jpg|jpeg)$/i) && 
      request.headers.get('accept')?.includes('image/webp')) {
    
    const webpUrl = url.pathname.replace(/\.(jpg|jpeg)$/i, '.webp');
    
    try {
      const webpCached = await caches.match(webpUrl);
      if (webpCached) {
        return webpCached;
      }
      
      const webpResponse = await fetch(webpUrl);
      if (webpResponse.ok) {
        const cache = await caches.open(IMAGE_CACHE);
        cache.put(webpUrl, webpResponse.clone());
        return webpResponse;
      }
    } catch (error) {
      console.log('WebP not available for JPEG, using original');
    }
  }
  
  // Fall back to original request
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      
      // Add appropriate cache headers
      const headers = new Headers(networkResponse.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      
      cache.put(request, new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: headers
      }));
    }
    return networkResponse;
  } catch (error) {
    return new Response('Image not available', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'game-state-sync') {
    event.waitUntil(syncGameState());
  }
});

async function syncGameState() {
  // Placeholder for game state synchronization
  console.log('Service Worker: Syncing game state');
}