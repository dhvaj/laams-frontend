const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').trim();

export const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

export const api = {
  get: async (path: string) => {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { data: await res.json() };
  },
  post: async (path: string, body?: any) => {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { data: await res.json() };
  }
};

export default api;
