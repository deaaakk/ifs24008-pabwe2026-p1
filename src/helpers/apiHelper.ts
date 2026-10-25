// Produksi memakai API pada domain Netlify yang sama; env localhost tidak ikut build.
export const API_URL = import.meta.env.DEV ? (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') : '';
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
 const headers = new Headers(options.headers);
 if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
 const res = await fetch(`${API_URL.replace(/\/$/, '')}/api${path}`, { ...options, headers, credentials: 'include' });
 if (res.status === 204) return undefined as T;
 const data = await res.json().catch(() => { throw new Error('Respons API tidak valid. Pastikan backend berjalan dan penghubung /api sudah diatur.'); });
 if (!res.ok) throw new Error(data.error ?? `Permintaan gagal (${res.status})`);
 return data as T;
}
