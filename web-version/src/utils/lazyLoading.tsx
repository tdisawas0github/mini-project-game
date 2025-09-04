import { lazy, Suspense, type ComponentType, type ReactElement } from 'react';
import { LoadingFallback } from '../components/LoadingFallback';

/**
 * Create a lazy-loaded component with custom loading message
 * @param importFn - Dynamic import function
 * @param fallbackMessage - Custom loading message
 * @returns Lazy component wrapped with Suspense
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallbackMessage?: string
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: any): ReactElement {
    return (
      <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Preload a lazy component
 * @param importFn - Dynamic import function
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  // Trigger the import to start loading
  importFn().catch(() => {
    // Ignore errors during preload
  });
}

// Intersection Observer based lazy loading for images
export function useLazyImageLoading() {
  const handleImageLazyLoad = (img: HTMLImageElement, src: string) => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target as HTMLImageElement;
            lazyImage.src = src;
            lazyImage.classList.remove('lazy');
            observer.unobserve(lazyImage);
          }
        });
      });
      
      imageObserver.observe(img);
    } else {
      // Fallback for browsers without Intersection Observer
      img.src = src;
    }
  };
  
  return handleImageLazyLoad;
}