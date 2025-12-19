import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/types/user";

// 1. Описуємо, що буде в нашому стейті
export interface AuthState {
  user: UserProfile | null;
  isAuth: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  setUser: (userData: UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuth: false,

      login: (user: UserProfile) => set({ user, isAuth: true }),

      logout: () => set({ user: null, isAuth: false }),

      setUser: (userData: UserProfile) => set({ user: userData, isAuth: true }),
    }),
    {
      name: "auth-storage",
    }
  )
);
