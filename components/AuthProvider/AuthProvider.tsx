"use client";

import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      // Робимо лише ОДИН запит, який повертає користувача або null
      const user = await checkSession();

      if (user) {
        // Якщо користувач є, встановлюємо його в стейт
        setUser(user);
      } else {
        // Якщо користувача немає, очищуємо дані
        clearIsAuthenticated();
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
};

export default AuthProvider;
