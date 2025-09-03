import { lazy, Suspense, type ComponentType, type ReactElement } from 'react';
import { motion } from 'framer-motion';

// Loading component with smooth animation
const LoadingFallback = ({ message = 'Loading...' }: { message?: string }): ReactElement => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 100%)',
      color: '#d4af37',
      fontFamily: '"Cinzel", serif',
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid #d4af37',
        borderTop: '3px solid transparent',
        borderRadius: '50%',
        marginBottom: '20px',
      }}
    />
    <motion.p
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{
        fontSize: '1.1rem',
        textAlign: 'center',
      }}
    >
      {message}
    </motion.p>
  </motion.div>
);

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