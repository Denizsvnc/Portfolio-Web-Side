const INTERNAL_API_URL = process.env.API_URL_INTERNAL || 'http://localhost:3005/api';

export async function fetchFromServer(endpoint: string, options?: RequestInit) {
  const url = `${INTERNAL_API_URL}${endpoint}`;
  
  // Default to 60 seconds revalidation (ISR)
  const defaultOptions: RequestInit = {
    next: { revalidate: 60 },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, mergedOptions);
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url} on server:`, error);
    // Return empty array/data structure as a fallback to prevent full page crash
    return { data: [] }; 
  }
}
