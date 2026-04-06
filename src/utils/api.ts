import { storage } from './storage';

const API_BASE = (import.meta.env.VITE_API_URL as string) ?? '';

async function request(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = storage.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { headers: { ...headers, ...(opts.headers as any) }, ...opts });
  const txt = await res.text();
  try {
    const json = txt ? JSON.parse(txt) : null;
    if (!res.ok) throw json || { message: res.statusText };
    return json;
  } catch (e) {
    if (!res.ok) throw e;
    return null;
  }
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
