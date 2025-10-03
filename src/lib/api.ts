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

export const api = {
  register(payload: { name: string; email: string; password: string; role?: 'customer'|'vendor'|'admin' }) {
    return request<{ user: { id: string; email: string; name: string; role: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(payload) }
    );
  },
  login(payload: { email: string; password: string }) {
    return request<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(payload) }
    );
  },
};
