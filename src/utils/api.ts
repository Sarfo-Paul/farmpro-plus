import { storage } from './storage';

// Use VITE_API_URL when provided (for separate API hosts). Default to
// an empty string so the client calls relative paths (e.g. `/api/...`) when
// the frontend and backend are served from the same origin (suitable for Vercel
// deployments that serve the static site from the same domain as the API).
const API_BASE = (import.meta.env.VITE_API_URL as string) || '';

async function request(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = storage.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { headers: { ...headers, ...(opts.headers as any) }, ...opts });
  const contentType = (res.headers.get('content-type') || '').toLowerCase();

  // If response is JSON, parse normally and surface JSON errors
  if (contentType.includes('application/json')) {
    const json = await res.json();
    if (!res.ok) throw json || { message: res.statusText };
    return json;
  }

  // Non-JSON responses (HTML, text). Read text for debugging and throw on error.
  const txt = await res.text();
  if (!res.ok) {
    const message = txt ? txt : res.statusText;
    throw { message, status: res.status, body: txt };
  }

  // Successful non-JSON response (e.g. served SPA). Return null so callers can fall back.
  return null;
}

export const api = {
  async login(email: string, password: string) {
    return await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async register(name: string, email: string, password: string) {
    return await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  },
  async me() {
    return await request('/api/auth/me');
  },
  async updateMe(data: { name?: string; password?: string }) {
    return await request('/api/auth/me', { method: 'PUT', body: JSON.stringify(data) });
  },
  async getRecords(params: { limit?: number; userId?: string; crop?: string } = {}) {
    const qs = new URLSearchParams();
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.userId) qs.set('userId', String(params.userId));
    if (params.crop) qs.set('crop', params.crop);
    return await request(`/api/records?${qs.toString()}`);
  },
  async createRecord(data: any) {
    return await request('/api/records', { method: 'POST', body: JSON.stringify(data) });
  },
  async deleteRecord(id: number) {
    return await request(`/api/records/${id}`, { method: 'DELETE' });
  },
  async getMarketPrices(params: { limit?: number; crop?: string } = {}) {
    const qs = new URLSearchParams();
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.crop) qs.set('crop', params.crop);
    return await request(`/api/market-prices?${qs.toString()}`);
  },
  async getWeather(params: { limit?: number; location?: string } = {}) {
    const qs = new URLSearchParams();
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.location) qs.set('location', params.location);
    return await request(`/api/weather?${qs.toString()}`);
  },
  // Admin helpers
  async adminGetUsers() {
    return await request('/api/admin/users');
  },
  async adminDeleteUser(id: number) {
    return await request(`/api/admin/users/${id}`, { method: 'DELETE' });
  },
  async adminGetMarketPrices() {
    return await request('/api/admin/market-prices');
  },
  async adminCreateMarketPrice(data: { crop: string; date?: string; price: number }) {
    return await request('/api/admin/market-prices', { method: 'POST', body: JSON.stringify(data) });
  },
  async adminDeleteMarketPrice(id: number) {
    return await request(`/api/admin/market-prices/${id}`, { method: 'DELETE' });
  },
};

export default api;
