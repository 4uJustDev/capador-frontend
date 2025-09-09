import axios, { type AxiosRequestConfig, type AxiosError, type AxiosInstance } from 'axios';

type ApiError = { status?: number; code?: string; message: string; details?: unknown };

function toApiError(err: unknown): ApiError {
  const e = err as AxiosError<any>;
  if (e?.isAxiosError) {
    return {
      status: e.response?.status,
      code: e.code,
      message: e.response?.data?.message ?? e.message ?? 'Network error',
      details: e.response?.data,
    };
  }
  return { message: err instanceof Error ? err.message : String(err) };
}

const http = axios.create({
  baseURL: import.meta.env.DEV ? '/api/project2' : import.meta.env.VITE_API_BASE_URL!,
  timeout: 15000,
});

class AsyncClient {
  private token: string | null = null;
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      this.token = userToken;
    }

    this.http = http;
  }

  setAuthToken(token: string | null) {
    this.token = token;

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getAuthToken() {
    return this.token;
  }

  private async core<T>(opts: AxiosRequestConfig, auth: boolean = false): Promise<T> {
    try {
      if (auth && this.token) {
        (opts.headers as any).Authorization = `Bearer ${this.token}`;
      }

      const response = await this.http.request<T>(opts);

      return response.data;
    } catch (e) {
      throw toApiError(e);
    }
  }

  request<T>(opts: AxiosRequestConfig) {
    return this.core<T>(opts);
  }
  requestAuth<T>(opts: AxiosRequestConfig) {
    return this.core<T>(opts, true);
  }

  get<T>(path: string, opts: Omit<AxiosRequestConfig, 'method' | 'data' | 'url'> = {}) {
    return this.request<T>({ ...opts, url: path, method: 'get' });
  }
}

export const _Async = new AsyncClient(http);

export function mediaUrl(path?: string) {
  if (!path) {
    return '/placeholder.png';
  }

  const clean = path.replace(/^\/+/, '');
  return import.meta.env.VITE_API_BASE_URL + '/' + clean;
}
