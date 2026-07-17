import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, getRefreshToken, setToken, removeToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor — handle token refresh & errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 — try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const newToken = data.data.accessToken;
        setToken(newToken, data.data.refreshToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        removeToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Format error response
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  }
);

// Typed API helpers
export async function apiGet<T>(url: string, params?: Record<string, unknown>) {
  const response = await api.get<T>(url, { params });
  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown) {
  const response = await api.post<T>(url, data);
  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown) {
  const response = await api.put<T>(url, data);
  return response.data;
}

export async function apiPatch<T>(url: string, data?: unknown) {
  const response = await api.patch<T>(url, data);
  return response.data;
}

export async function apiDelete<T>(url: string) {
  const response = await api.delete<T>(url);
  return response.data;
}

export default api;
