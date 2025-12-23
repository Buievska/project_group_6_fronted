"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { getCurrentUser } from "@/lib/api/clientApi";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, login } = useAuthStore((state) => state);

  useEffect(() => {
    const initAuth = async () => {
      const shouldCheckAuth = localStorage.getItem("isLoggedIn");

      if (!user && shouldCheckAuth) {
        try {
          const response = await getCurrentUser();

          const userData = response.data || response.user || response;

          const adaptedUser = {
            _id: userData._id || userData.id,

            email: userData.email,
            name: userData.name,

            avatarUrl: userData.avatarUrl || userData.avatar || null,
            avatar: userData.avatarUrl || userData.avatar || null,

            role: userData.role || "user",
            phone: userData.phone,
            rating: userData.rating,
          };

          login(adaptedUser);
        } catch (error) {
          console.log("Сесія неактивна або помилка:", error);
          localStorage.removeItem("isLoggedIn");
        }
      }
    };

    initAuth();
  }, [user, login]);

  return <>{children}</>;
};

export default AuthProvider;
