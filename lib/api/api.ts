import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"; // <- 3001

export const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // для кукі
  headers: {
    "Content-Type": "application/json",
  },
});

$api.interceptors.response.use(
  config => {
    return config;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;

      try {
        await $api.post("/auth/refresh");

        return $api.request(originalRequest);
      } catch (e) {
        console.log("Not authorized");
      }
    }
    throw error;
  },
);
