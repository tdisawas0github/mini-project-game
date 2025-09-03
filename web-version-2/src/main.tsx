import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializePerformanceMonitoring } from './utils/performanceMonitor'
import { preloadImages } from './utils/imageOptimization'

// Initialize performance monitoring
const performanceMonitor = initializePerformanceMonitoring();

// Preload critical images
const criticalImages = [
  '/assets/map-of-valdaren.png',
  '/assets/factions-of-valdaren.png',
  '/assets/problems-map.png'
];

preloadImages(criticalImages);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Log performance metrics in development
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(async () => {
      const bundleStats = await performanceMonitor.getBundleStats();
      const memoryUsage = performanceMonitor.getMemoryUsage();
      
      console.group('🚀 Performance Metrics');
      if (bundleStats) {
        console.log('📦 Bundle Stats:', bundleStats);
      }
      if (memoryUsage) {
        console.log('🧠 Memory Usage:', memoryUsage);
      }
      console.log('📊 Web Vitals:', performanceMonitor.getMetrics());
      console.groupEnd();
    }, 1000);
  });
}
