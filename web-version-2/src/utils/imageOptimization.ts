/**
 * Image optimization utilities for better performance
 */

// Cache WebP support detection to avoid repeated checks
let webpSupportCache: boolean | null = null;
let webpSupportPromise: Promise<boolean> | null = null;

/**
 * Get optimized image URL with WebP support and PNG fallback
 * @param imagePath - Original image path (PNG)
 * @returns Object with WebP and fallback URLs
 */
export function getOptimizedImageUrl(imagePath: string) {
  const webpPath = imagePath.replace(/\.png$/, '.webp');
  
  return {
    webp: webpPath,
    fallback: imagePath
  };
}

/**
 * Create a picture element with WebP optimization
 * @param src - Original PNG image path
 * @param alt - Alt text for the image
 * @param className - CSS class name
 * @returns HTMLPictureElement
 */
export function createOptimizedPicture(src: string, alt: string = '', className: string = '') {
  const { webp, fallback } = getOptimizedImageUrl(src);
  
  const picture = document.createElement('picture');
  
  // WebP source for modern browsers
  const webpSource = document.createElement('source');
  webpSource.srcset = webp;
  webpSource.type = 'image/webp';
  
  // Fallback img element
  const img = document.createElement('img');
  img.src = fallback;
  img.alt = alt;
  if (className) img.className = className;
  
  picture.appendChild(webpSource);
  picture.appendChild(img);
  
  return picture;
}

/**
 * Check if browser supports WebP (cached)
 * @returns Promise<boolean>
 */
export function supportsWebP(): Promise<boolean> {
  // Return cached result if available
  if (webpSupportCache !== null) {
    return Promise.resolve(webpSupportCache);
  }
  
  // Return existing promise if one is in progress
  if (webpSupportPromise) {
    return webpSupportPromise;
  }
  
  // Create new promise for WebP detection
  webpSupportPromise = new Promise((resolve) => {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      webpSupportCache = webp.height === 2;
      resolve(webpSupportCache);
      webpSupportPromise = null; // Clear promise after resolution
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';
  });
  
  return webpSupportPromise;
}

/**
 * Preload images for better performance
 * @param imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls: string[]) {
  // Use cached WebP support if available, otherwise detect once
  const preloadPromise = supportsWebP();
  
  preloadPromise.then(isWebPSupported => {
    const preloadedUrls = new Set<string>();
    
    imageUrls.forEach(url => {
      const { webp, fallback } = getOptimizedImageUrl(url);
      const urlToPreload = isWebPSupported ? webp : fallback;
      
      // Avoid duplicate preloads
      if (preloadedUrls.has(urlToPreload)) {
        return;
      }
      preloadedUrls.add(urlToPreload);
      
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = urlToPreload;
      
      // Add crossorigin for better caching
      link.crossOrigin = 'anonymous';
      
      document.head.appendChild(link);
    });
  });
}

/**
 * Get CSS background image with WebP support
 * @param imagePath - Original PNG image path  
 * @returns CSS-compatible background-image value
 */
export async function getOptimizedBackgroundImage(imagePath: string): Promise<string> {
  const { webp, fallback } = getOptimizedImageUrl(imagePath);
  const isWebPSupported = await supportsWebP();
  
  return `url('${isWebPSupported ? webp : fallback}')`;
}

/**
 * Create responsive image URLs for different screen sizes
 * @param imagePath - Base image path
 * @param sizes - Array of size suffixes (e.g., ['sm', 'md', 'lg'])
 * @returns Object with responsive image URLs
 */
export function getResponsiveImageUrls(imagePath: string, sizes: string[] = ['sm', 'md', 'lg']) {
  const baseUrl = imagePath.replace(/\.[^/.]+$/, ''); // Remove extension
  const extension = imagePath.match(/\.[^/.]+$/)?.[0] || '.png';
  
  const responsive: Record<string, { webp: string; fallback: string }> = {};
  
  sizes.forEach(size => {
    const sizedImagePath = `${baseUrl}-${size}${extension}`;
    responsive[size] = getOptimizedImageUrl(sizedImagePath);
  });
  
  // Add original size as 'original'
  responsive.original = getOptimizedImageUrl(imagePath);
  
  return responsive;
}

/**
 * Create picture element with responsive image support
 * @param src - Base image path
 * @param alt - Alt text
 * @param className - CSS class
 * @param sizes - CSS sizes attribute value
 * @returns HTMLPictureElement with responsive sources
 */
export function createResponsivePicture(
  src: string, 
  alt: string = '', 
  className: string = '',
  sizes: string = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
) {
  const responsiveUrls = getResponsiveImageUrls(src);
  const picture = document.createElement('picture');
  
  // Create WebP sources for different sizes
  Object.entries(responsiveUrls).forEach(([sizeKey, urls]) => {
    const source = document.createElement('source');
    source.srcset = urls.webp;
    source.type = 'image/webp';
    source.sizes = sizes;
    
    // Add media queries for different sizes
    if (sizeKey === 'sm') {
      source.media = '(max-width: 768px)';
    } else if (sizeKey === 'md') {
      source.media = '(max-width: 1024px)';
    }
    
    picture.appendChild(source);
  });
  
  // Fallback img with srcset
  const img = document.createElement('img');
  const fallbackSrcset = Object.values(responsiveUrls)
    .map((urls, index) => `${urls.fallback} ${(index + 1) * 400}w`)
    .join(', ');
  
  img.srcset = fallbackSrcset;
  img.src = responsiveUrls.original.fallback;
  img.sizes = sizes;
  img.alt = alt;
  if (className) img.className = className;
  
  picture.appendChild(img);
  
  return picture;
}