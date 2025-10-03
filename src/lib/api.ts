// Works with CRA. If env missing, safely falls back to localhost:4000/api
const RAW_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';
// trim trailing slashes
export const API_BASE = RAW_BASE.replace(/\/+$/, '');

function buildUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return /^https?:\/\//i.test(API_BASE) ? `${API_BASE}${p}` : `${p}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(buildUrl(path), {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && (data.error || data.message)) || `HTTP ${res.status}`);
  }
  return data as T;
}

// ---------- Types that reflect your backend now ----------
type Role = 'customer' | 'vendor' | 'admin';

export type UserDTO = {
  id: string;
  name: string;
  phone: string;
  role: Role;
  email: string | null; // backend sends null if absent (we can normalize to null)
};

export const api = {
  register(payload: { name: string; phone: string; password: string; email?: string; role?: 'customer'|'vendor'|'admin' }) {
    return request<{ user: { id: string; name: string; phone: string; email: string | null; role: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(payload) }
    );
  },
  login(payload: { phone: string; password: string }) {
    return request<{ token: string; user: { id: string; name: string; phone: string; email: string | null; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(payload) }
    );
  },
};


