const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export interface FetchOptions extends RequestInit {}

export async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
