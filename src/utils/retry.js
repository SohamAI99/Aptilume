// Retry utility for handling failed requests
export const retry = async (fn, retries = 3, delay = 1000, backoff = 2) => {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // If this was the last attempt, throw the error
      if (i === retries) {
        throw error;
      }
      
      // Wait before retrying (with exponential backoff)
      const waitTime = delay * Math.pow(backoff, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};

// Check if a request should be retried based on error type
export const shouldRetry = (error) => {
  // Retry on network errors
  if (!error.response) {
    return true;
  }
  
  // Retry on server errors (5xx)
  if (error.response.status >= 500 && error.response.status < 600) {
    return true;
  }
  
  // Retry on rate limiting (429)
  if (error.response.status === 429) {
    return true;
  }
  
  // Don't retry on client errors (4xx, except 429)
  return false;
};

// Wrapper for fetch with retry logic
export const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  return retry(
    async () => {
      const response = await fetch(url, options);
      
      // Throw error if response is not ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    },
    retries,
    delay
  );
};

export default {
  retry,
  shouldRetry,
  fetchWithRetry
};