import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, supportsWebP } from '../utils/imageOptimization';

/**
 * Hook for optimized image loading with WebP support
 * @param imagePath - Original PNG image path
 * @returns Object with optimized image URL and loading state
 */
export function useOptimizedImage(imagePath: string) {
  const [optimizedUrl, setOptimizedUrl] = useState<string>(imagePath);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadOptimizedImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { webp, fallback } = getOptimizedImageUrl(imagePath);
        const isWebPSupported = await supportsWebP();
        
        const urlToUse = isWebPSupported ? webp : fallback;
        
        // Test if the image actually exists
        const img = new Image();
        img.onload = () => {
          if (mounted) {
            setOptimizedUrl(urlToUse);
            setIsLoading(false);
          }
        };
        
        img.onerror = () => {
          if (mounted) {
            // If WebP fails, try fallback
            if (isWebPSupported && urlToUse === webp) {
              setOptimizedUrl(fallback);
            } else {
              setError(new Error(`Failed to load image: ${imagePath}`));
            }
            setIsLoading(false);
          }
        };
        
        img.src = urlToUse;
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setIsLoading(false);
        }
      }
    };

    loadOptimizedImage();

    return () => {
      mounted = false;
    };
  }, [imagePath]);

  return {
    src: optimizedUrl,
    isLoading,
    error
  };
}

/**
 * Hook for optimized background image with WebP support
 * @param imagePath - Original PNG image path
 * @returns CSS background-image value
 */
export function useOptimizedBackgroundImage(imagePath: string) {
  const [backgroundImage, setBackgroundImage] = useState<string>(`url('${imagePath}')`);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadOptimizedBackground = async () => {
      try {
        setIsLoading(true);
        const { webp, fallback } = getOptimizedImageUrl(imagePath);
        const isWebPSupported = await supportsWebP();
        
        const urlToUse = isWebPSupported ? webp : fallback;
        
        // Test if the image exists
        const img = new Image();
        img.onload = () => {
          if (mounted) {
            setBackgroundImage(`url('${urlToUse}')`);
            setIsLoading(false);
          }
        };
        
        img.onerror = () => {
          if (mounted) {
            // Fallback to original if WebP fails
            if (isWebPSupported && urlToUse === webp) {
              setBackgroundImage(`url('${fallback}')`);
            }
            setIsLoading(false);
          }
        };
        
        img.src = urlToUse;
      } catch (err) {
        if (mounted) {
          setBackgroundImage(`url('${imagePath}')`);
          setIsLoading(false);
        }
      }
    };

    loadOptimizedBackground();

    return () => {
      mounted = false;
    };
  }, [imagePath]);

  return {
    backgroundImage,
    isLoading
  };
}