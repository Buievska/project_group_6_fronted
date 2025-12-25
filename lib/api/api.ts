import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

type QueueItem = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

$api.interceptors.response.use(
  (config) => config,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _isRetry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "/auth/logout"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => $api.request(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        await $api.post("/auth/refresh");

        isRefreshing = false;
        processQueue(null);

        return $api.request(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        console.error("Сесія повністю прострочена");

        if (typeof window !== "undefined") {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    if (
      error.response?.status === 401 &&
      originalRequest?.url === "/auth/logout"
    ) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }

      return Promise.resolve();
    }

    return Promise.reject(error);
  }
);
