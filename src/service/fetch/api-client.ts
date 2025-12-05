export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions {
  skipAuthRedirect?: boolean;
}

async function handleResponse<T>(response: Response, options?: RequestOptions): Promise<T> {
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined' && !options?.skipAuthRedirect) {
      window.location.href = '/';
      throw new ApiError(401, 'Unauthorized');
    }
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, error.message || 'An error occurred');
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

const fetchOptions = { credentials: 'include' as const, headers: { 'Content-Type': 'application/json' } };

export const apiGet = <T>(url: string, options?: RequestOptions): Promise<T> =>
  fetch(url, fetchOptions).then((r) => handleResponse<T>(r, options));

export const apiPost = <T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> =>
  fetch(url, { ...fetchOptions, method: 'POST', body: data ? JSON.stringify(data) : undefined }).then((r) => handleResponse<T>(r, options));

export const apiPut = <T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> =>
  fetch(url, { ...fetchOptions, method: 'PUT', body: data ? JSON.stringify(data) : undefined }).then((r) => handleResponse<T>(r, options));

export const apiDelete = <T>(url: string, options?: RequestOptions): Promise<T> =>
  fetch(url, { ...fetchOptions, method: 'DELETE' }).then((r) => handleResponse<T>(r, options));
