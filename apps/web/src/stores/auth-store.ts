import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
        // Also store in localStorage for the API interceptor
        if (typeof window !== "undefined") {
          localStorage.setItem("gymos_access_token", token);
          localStorage.setItem("gymos_refresh_token", refreshToken);
          document.cookie = `gymos_access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("gymos_access_token");
          localStorage.removeItem("gymos_refresh_token");
          document.cookie =
            "gymos_access_token=; path=/; max-age=0";
        }
      },

      setUser: (user) => set({ user }),

      setToken: (token) => {
        set({ token });
        if (typeof window !== "undefined") {
          localStorage.setItem("gymos_access_token", token);
          document.cookie = `gymos_access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "gymos-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
