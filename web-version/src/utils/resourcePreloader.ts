/**
 * Resource preloader for critical game assets
 */

interface PreloadOptions {
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch';
  crossOrigin?: 'anonymous' | 'use-credentials';
  type?: string;
  media?: string;
  priority?: 'high' | 'low' | 'auto';
}

/**
 * Preload a resource with link rel="preload"
 * @param href - Resource URL
 * @param options - Preload options
 */
export function preloadResource(href: string, options: PreloadOptions = {}) {
  // Check if already preloaded
  const existing = document.querySelector(`link[href="${href}"]`);
  if (existing) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  
  if (options.as) link.as = options.as;
  if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
  if (options.type) link.type = options.type;
  if (options.media) link.media = options.media;
  if (options.priority && 'fetchPriority' in link) {
    (link as HTMLLinkElement & { fetchPriority: string }).fetchPriority = options.priority;
  }

  document.head.appendChild(link);
}

/**
 * Preload critical game resources
 */
export function preloadCriticalResources() {
  const criticalResources = [
    // Critical images
    { href: '/assets/map-of-valdaren.webp', as: 'image' as const },
    { href: '/assets/factions-of-valdaren.webp', as: 'image' as const },
    { href: '/assets/problems-map.webp', as: 'image' as const },
    
    // Critical fonts (if any)
    // { href: '/fonts/game-font.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    
    // Critical data files
    // { href: '/data/dialogue.json', as: 'fetch', crossOrigin: 'anonymous' },
  ];

  criticalResources.forEach(resource => {
    preloadResource(resource.href, resource);
  });
}

/**
 * Prefetch non-critical resources for faster navigation
 * @param resources - Array of resource URLs
 */
export function prefetchResources(resources: string[]) {
  resources.forEach(href => {
    const existing = document.querySelector(`link[href="${href}"][rel="prefetch"]`);
    if (existing) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Preconnect to external domains for faster loading
 * @param domains - Array of domain URLs
 */
export function preconnectDomains(domains: string[]) {
  domains.forEach(href => {
    const existing = document.querySelector(`link[href="${href}"][rel="preconnect"]`);
    if (existing) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Initialize performance-oriented resource loading
 */
export function initializeResourcePreloading() {
  // Preload critical resources immediately
  preloadCriticalResources();
  
  // Preconnect to external domains if any
  // preconnectDomains(['https://cdn.example.com']);
  
  // Setup intersection observer for lazy prefetching
  setupLazyPrefetching();
}

/**
 * Setup intersection observer to prefetch resources when they might be needed
 */
function setupLazyPrefetching() {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        const prefetchUrl = element.dataset.prefetch;
        if (prefetchUrl) {
          prefetchResources([prefetchUrl]);
          observer.unobserve(element);
        }
      }
    });
  }, {
    rootMargin: '50px' // Start prefetching 50px before element is visible
  });

  // Observe elements with data-prefetch attribute
  document.addEventListener('DOMContentLoaded', () => {
    const prefetchElements = document.querySelectorAll('[data-prefetch]');
    prefetchElements.forEach(element => observer.observe(element));
  });
}