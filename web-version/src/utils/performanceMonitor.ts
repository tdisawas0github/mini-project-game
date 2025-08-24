/**
 * Performance monitoring utilities for game optimization
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
}

/**
 * Web Vitals performance monitoring
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Performance observer for navigation and resource timings
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      this.observeMetric('largest-contentful-paint', (entries) => {
        const lcpEntry = entries[entries.length - 1];
        this.recordMetricInternal('LCP', lcpEntry.startTime);
      });

      // FID (First Input Delay)
      this.observeMetric('first-input', (entries) => {
        const fidEntry = entries[0] as any;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        this.recordMetricInternal('FID', fid);
      });

      // CLS (Cumulative Layout Shift)
      this.observeMetric('layout-shift', (entries) => {
        let clsValue = 0;
        for (const entry of entries) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.recordMetricInternal('CLS', clsValue);
      });
    }
  }

  private observeMetric(type: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: [type] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  private recordMetricInternal(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value: Math.round(value * 100) / 100,
      timestamp: Date.now(),
      url: window.location.href
    };
    
    this.metrics.push(metric);
    console.log(`Performance: ${name} = ${metric.value}ms`);
    
    // Send to analytics if needed
    this.sendToAnalytics(metric);
  }

  /**
   * Record a custom metric (public method)
   */
  recordMetric(name: string, value: number) {
    this.recordMetricInternal(name, value);
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // Send to analytics service (placeholder)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(metric));
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get bundle size information
   */
  async getBundleStats() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const jsFiles = resourceEntries.filter(entry => 
        entry.name.includes('.js') && entry.transferSize > 0
      );
      
      const cssFiles = resourceEntries.filter(entry => 
        entry.name.includes('.css') && entry.transferSize > 0
      );

      const totalJSSize = jsFiles.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
      const totalCSSSize = cssFiles.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
      
      return {
        totalJS: Math.round(totalJSSize / 1024),
        totalCSS: Math.round(totalCSSSize / 1024),
        jsFiles: jsFiles.length,
        cssFiles: cssFiles.length,
        files: jsFiles.concat(cssFiles).map(entry => ({
          url: entry.name,
          size: Math.round((entry.transferSize || 0) / 1024),
          loadTime: Math.round(entry.duration)
        }))
      };
    }
    return null;
  }

  /**
   * Monitor memory usage if available
   */
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }

  /**
   * Clean up observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
let performanceMonitor: PerformanceMonitor | null = null;

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
    
    // Log initial page load metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          performanceMonitor!.recordMetric('TTFB', navigation.responseStart - navigation.requestStart);
          performanceMonitor!.recordMetric('DOMContentLoaded', navigation.domContentLoadedEventEnd - (navigation as any).navigationStart);
          performanceMonitor!.recordMetric('Load', navigation.loadEventEnd - (navigation as any).navigationStart);
        }
      }, 0);
    });
  }
  
  return performanceMonitor;
}

/**
 * Get the global performance monitor instance
 */
export function getPerformanceMonitor(): PerformanceMonitor | null {
  return performanceMonitor;
}