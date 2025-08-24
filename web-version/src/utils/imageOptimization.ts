/**
 * Image optimization utilities for better performance
 */

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
 * Check if browser supports WebP
 * @returns Promise<boolean>
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      resolve(webp.height === 2);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';
  });
}

/**
 * Preload images for better performance
 * @param imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls: string[]) {
  imageUrls.forEach(url => {
    const { webp, fallback } = getOptimizedImageUrl(url);
    
    // Try to preload WebP first
    supportsWebP().then(supportsWebP => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = supportsWebP ? webp : fallback;
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