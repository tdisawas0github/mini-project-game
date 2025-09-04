import { useState, useEffect, useCallback, useMemo } from 'react';
import { getOptimizedImageUrl, supportsWebP } from '../utils/imageOptimization';

// Cache for loaded images to avoid re-checking
const imageCache = new Map<string, { url: string; isLoaded: boolean; error?: Error }>();

/**
 * Hook for optimized image loading with WebP support and caching
 * @param imagePath - Original PNG image path
 * @returns Object with optimized image URL and loading state
 */
export function useOptimizedImage(imagePath: string) {
  const [optimizedUrl, setOptimizedUrl] = useState<string>(imagePath);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize image URLs to prevent unnecessary recalculations
  const imageUrls = useMemo(() => getOptimizedImageUrl(imagePath), [imagePath]);

  const loadOptimizedImage = useCallback(async () => {
    // Check cache first
    const cached = imageCache.get(imagePath);
    if (cached) {
      setOptimizedUrl(cached.url);
      setIsLoading(false);
      setError(cached.error || null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { webp, fallback } = imageUrls;
      const isWebPSupported = await supportsWebP();
      
      const urlToUse = isWebPSupported ? webp : fallback;
      
      // Test if the image actually exists
      const img = new Image();
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          // Cache successful load
          imageCache.set(imagePath, { url: urlToUse, isLoaded: true });
          setOptimizedUrl(urlToUse);
          setIsLoading(false);
          resolve();
        };
        
        img.onerror = () => {
          // If WebP fails, try fallback
          if (isWebPSupported && urlToUse === webp) {
            img.src = fallback;
            return; // Let it try the fallback
          }
          
          const errorObj = new Error(`Failed to load image: ${imagePath}`);
          imageCache.set(imagePath, { url: fallback, isLoaded: false, error: errorObj });
          setError(errorObj);
          setIsLoading(false);
          reject(errorObj);
        };
      });
      
      img.src = urlToUse;
      await loadPromise;
      
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error');
      setError(errorObj);
      setIsLoading(false);
      imageCache.set(imagePath, { url: imagePath, isLoaded: false, error: errorObj });
    }
  }, [imagePath, imageUrls]);

  useEffect(() => {
    let mounted = true;
    
    loadOptimizedImage().catch((error) => {
      if (mounted) {
        console.warn('Image loading failed:', error);
      }
    });

    return () => {
      mounted = false;
    };
  }, [loadOptimizedImage]);

  return {
    src: optimizedUrl,
    isLoading,
    error
  };
}

/**
 * Hook for optimized background image with WebP support and caching
 * @param imagePath - Original PNG image path
 * @returns CSS background-image value
 */
export function useOptimizedBackgroundImage(imagePath: string) {
  const [backgroundImage, setBackgroundImage] = useState<string>(`url('${imagePath}')`);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize image URLs to prevent unnecessary recalculations
  const imageUrls = useMemo(() => getOptimizedImageUrl(imagePath), [imagePath]);

  const loadOptimizedBackground = useCallback(async () => {
    // Check cache first
    const cached = imageCache.get(`bg-${imagePath}`);
    if (cached) {
      setBackgroundImage(`url('${cached.url}')`);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { webp, fallback } = imageUrls;
      const isWebPSupported = await supportsWebP();
      
      const urlToUse = isWebPSupported ? webp : fallback;
      
      // Test if the image exists
      const img = new Image();
      
      const loadPromise = new Promise<void>((resolve) => {
        img.onload = () => {
          imageCache.set(`bg-${imagePath}`, { url: urlToUse, isLoaded: true });
          setBackgroundImage(`url('${urlToUse}')`);
          setIsLoading(false);
          resolve();
        };
        
        img.onerror = () => {
          // Fallback to original if WebP fails
          const fallbackUrl = (isWebPSupported && urlToUse === webp) ? fallback : imagePath;
          imageCache.set(`bg-${imagePath}`, { url: fallbackUrl, isLoaded: false });
          setBackgroundImage(`url('${fallbackUrl}')`);
          setIsLoading(false);
          resolve();
        };
      });
      
      img.src = urlToUse;
      await loadPromise;
      
    } catch {
      imageCache.set(`bg-${imagePath}`, { url: imagePath, isLoaded: false });
      setBackgroundImage(`url('${imagePath}')`);
      setIsLoading(false);
    }
  }, [imagePath, imageUrls]);

  useEffect(() => {
    let mounted = true;
    
    loadOptimizedBackground().catch((backgroundError) => {
      if (mounted) {
        console.warn('Background image loading failed:', backgroundError);
        setBackgroundImage(`url('${imagePath}')`);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [loadOptimizedBackground, imagePath]);

  return {
    backgroundImage,
    isLoading
  };
}