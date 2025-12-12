"use client";

import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { $api } from "@/lib/api/api";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { token, logout } = useAuthStore();
  const router = useRouter();

  useLayoutEffect(() => {
    const authInterceptor = $api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    //  (401)
    const errorInterceptor = $api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          router.push("/auth/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      $api.interceptors.request.eject(authInterceptor);
      $api.interceptors.response.eject(errorInterceptor);
    };
  }, [token, logout, router]);

  return <>{children}</>;
};
