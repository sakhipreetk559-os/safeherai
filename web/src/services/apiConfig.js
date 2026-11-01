// API Configuration for SafeHer AI Backend (Render / Local)

export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

export async function checkBackendHealth() {
  if (!API_BASE_URL) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/docs`, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}
