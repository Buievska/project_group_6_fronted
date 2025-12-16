import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/types/user";

export interface AuthState {
  user: UserProfile | null;
  isAuth: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  setUser: (userData: UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      login: (user, token) => set({ user, token, isAuth: true }),
      logout: () => set({ user: null, token: null, isAuth: false }),
      setUser: (userData) => set({ user: userData, isAuth: true }),
    }),
    { name: 'auth-storage' }
  )
);
