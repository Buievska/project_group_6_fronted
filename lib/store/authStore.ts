import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/types/user";
interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuth: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuth: false,
      login: (user, token) => set({ user, token, isAuth: true }),
      logout: () => set({ user: null, token: null, isAuth: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
