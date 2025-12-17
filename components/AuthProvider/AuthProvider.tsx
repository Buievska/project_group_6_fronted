"use client";

import { useEffect } from "react";
import { useAuthStore, AuthState } from "@/lib/store/authStore";
import { getCurrentUser } from "@/lib/api/clientApi";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useAuthStore((state: AuthState) => state);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Перевіряємо, чи є "прапорець" входу
      const shouldCheckAuth = localStorage.getItem("isLoggedIn");

      // 2. Якщо юзера немає в стейті І є прапорець - робим запит
      if (!user && shouldCheckAuth) {
        try {
          const response = await getCurrentUser();

          // 3. Витягуємо правильні дані (як ми налаштували раніше)
          const userData = response.data || response.user || response;

          const adaptedUser = {
            id: userData._id || userData.id,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatarUrl || userData.avatar,
          };

          // 4. Зберігаємо в Zustand
          if (setUser) setUser(adaptedUser);
        } catch {
          console.log("Сесія неактивна, видаляю прапорець.");
          localStorage.removeItem("isLoggedIn");
        }
      }
    };

    initAuth();
  }, [user, setUser]);

  return <>{children}</>;
};

export default AuthProvider;
