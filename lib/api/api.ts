import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// $api.interceptors.request.use((config) => {
//   // Перевіряємо, чи ми на клієнті (в браузері)
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("accessToken");

//     // Якщо токен є — додаємо його в заголовок Authorization
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });
