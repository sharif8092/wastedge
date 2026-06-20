export const WP_API_BASE = import.meta.env.VITE_WP_API_URL || 'https://api.wastedge.in/wp-json';
export const USE_MOCK_DB = import.meta.env.VITE_USE_MOCK_DB !== 'false'; // Defaults to true until WP is fully ready

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('wp_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${WP_API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
};
