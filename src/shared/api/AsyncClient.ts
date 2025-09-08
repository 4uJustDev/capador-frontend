import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';

export type RequestOpts = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15000,
});

export type ApiError = { status?: number; code?: string; message: string; details?: unknown };
export function toApiError(err: unknown): ApiError {
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

class AsyncClient {
  private http: AxiosInstance;
  private token: string | null = null;

  constructor(http: AxiosInstance) {
    this.http = http;

    const userToken = localStorage.getItem('token');
    if (userToken) {
      this.token = userToken;
    }
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

  private async core<T>(opts: RequestOpts, auth: boolean): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        method: opts.method,
        url: opts.path,
        params: opts.params,
        data: opts.data,
        headers: { ...(opts.headers ?? {}) },
        signal: opts.signal,
      };

      if (auth && this.token) {
        (config.headers as any).Authorization = `Bearer ${this.token}`;
      }
      const res = await this.http.request<T>(config);
      return res.data as T;
    } catch (e) {
      throw toApiError(e);
    }
  }

  request<T>(opts: RequestOpts) {
    return this.core<T>(opts, false);
  }
  requestAuth<T>(opts: RequestOpts) {
    return this.core<T>(opts, true);
  }

  get<T>(path: string, o: Omit<RequestOpts, 'method' | 'path'> = {}) {
    return this.request<T>({ ...o, method: 'GET', path });
  }
  getAuth<T>(path: string, o: Omit<RequestOpts, 'method' | 'path'> = {}) {
    return this.requestAuth<T>({ ...o, method: 'GET', path });
  }
  postAuth<T>(path: string, data?: unknown, o: Omit<RequestOpts, 'method' | 'path' | 'data'> = {}) {
    return this.requestAuth<T>({ ...o, method: 'POST', path, data });
  }
  post<T>(path: string, data?: unknown, o: Omit<RequestOpts, 'method' | 'path' | 'data'> = {}) {
    return this.request<T>({ ...o, method: 'POST', path, data });
  }
}

export const _Async = new AsyncClient(http);
