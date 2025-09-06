// Lazy loading utility for components
import React, { Suspense } from 'react';
import { retry } from './retry';

// Create a lazy component with retry logic
export const lazyWithRetry = (importFunc, retries = 3, delay = 1000) => {
  return React.lazy(() => retry(importFunc, retries, delay));
};

// Create a component with loading fallback
export const withLoadingFallback = (Component, FallbackComponent = null) => {
  const Fallback = FallbackComponent || DefaultFallback;
  
  return (props) => (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );
};

// Default fallback component
const DefaultFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Create a lazy component with loading fallback
export const lazyWithFallback = (importFunc, FallbackComponent = null) => {
  const LazyComponent = lazyWithRetry(importFunc);
  return withLoadingFallback(LazyComponent, FallbackComponent);
};

// Intersection Observer for component visibility
export const observeElement = (element, callback, options = {}) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    ...options
  });

  observer.observe(element);
  
  return () => observer.unobserve(element);
};

// Lazy image loading
export const LazyImage = ({ src, alt, className = '', ...props }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  
  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        {...props}
      />
    </div>
  );
};

export default {
  lazyWithRetry,
  withLoadingFallback,
  lazyWithFallback,
  observeElement,
  LazyImage
};