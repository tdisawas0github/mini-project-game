const CACHE_NAME = 'ellidra-v2';
const STATIC_CACHE = 'ellidra-static-v2';
const IMAGE_CACHE = 'ellidra-images-v2';

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
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline with image optimization
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Handle image requests with WebP optimization
  if (url.pathname.includes('/assets/') && 
      (url.pathname.endsWith('.png') || url.pathname.endsWith('.webp'))) {
    
    event.respondWith(
      handleImageRequest(event.request)
    );
    return;
  }
  
  // Handle other requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Make network request and cache successful responses
        return fetch(event.request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for cache
            const responseToCache = response.clone();
            
            // Cache in appropriate cache based on content type
            const cacheToUse = response.headers.get('content-type')?.includes('image/') 
              ? IMAGE_CACHE 
              : STATIC_CACHE;
              
            caches.open(cacheToUse)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Handle image requests with WebP optimization
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
        // Cache the WebP version
        const cache = await caches.open(IMAGE_CACHE);
        cache.put(webpUrl, webpResponse.clone());
        return webpResponse;
      }
    } catch (error) {
      console.log('WebP not available, falling back to PNG');
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
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Image not available', { status: 404 });
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