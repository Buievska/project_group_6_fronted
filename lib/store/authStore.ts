import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/types/user";
interface AuthState {
  user: UserProfile | null;
  isAuth: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      login: (user) => set({ user, isAuth: true }),
      logout: () => set({ user: null, isAuth: false }),
    }),
    { name: 'auth-storage' }
  )
);
