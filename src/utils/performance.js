// Performance monitoring utility
export const measurePerformance = (metricName, callback) => {
  const start = performance.now();
  
  try {
    const result = callback();
    const end = performance.now();
    const duration = end - start;
    
    // Log performance metric
    console.log(`[PERFORMANCE] ${metricName}: ${duration.toFixed(2)}ms`);
    
    // In a real app, you would send this to a monitoring service
    // like Google Analytics, Sentry, or a custom backend
    
    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    
    console.error(`[PERFORMANCE] ${metricName} failed after ${duration.toFixed(2)}ms:`, error);
    
    throw error;
  }
};

// Track component render times
export const withPerformanceTracking = (Component, componentName) => {
  return function TrackedComponent(props) {
    return measurePerformance(`${componentName} Render`, () => {
      return <Component {...props} />;
    });
  };
};

// Track API call performance
export const trackAPICall = async (apiName, apiCall) => {
  return measurePerformance(`${apiName} API Call`, async () => {
    const response = await apiCall();
    return response;
  });
};

// Memory usage tracking
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    };
  }
  return null;
};

// Navigation timing
export const getNavigationTiming = () => {
  const timing = performance.getEntriesByType('navigation')[0];
  if (timing) {
    return {
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnection: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      domLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      windowLoaded: timing.loadEventEnd - timing.navigationStart
    };
  }
  return null;
};

// Resource timing
export const getResourceTiming = () => {
  const resources = performance.getEntriesByType('resource');
  return resources.map(resource => ({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize
  }));
};

export default {
  measurePerformance,
  withPerformanceTracking,
  trackAPICall,
  getMemoryUsage,
  getNavigationTiming,
  getResourceTiming
};