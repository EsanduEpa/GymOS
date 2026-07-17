import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "dark" | "light";
  mobileMenuOpen: boolean;
  commandPaletteOpen: boolean;
  notificationPanelOpen: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: "dark",
      mobileMenuOpen: false,
      commandPaletteOpen: false,
      notificationPanelOpen: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
          document.documentElement.classList.toggle("light", theme === "light");
        }
      },

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", newTheme === "dark");
            document.documentElement.classList.toggle("light", newTheme === "light");
          }
          return { theme: newTheme };
        }),

      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),

      setCommandPaletteOpen: (commandPaletteOpen) =>
        set({ commandPaletteOpen }),

      setNotificationPanelOpen: (notificationPanelOpen) =>
        set({ notificationPanelOpen }),
    }),
    {
      name: "gymos-ui-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
