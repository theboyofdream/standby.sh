import { create } from "zustand";
import { persist /*, createJSONStorage*/ } from "zustand/middleware";
// import { hashStorage } from "./storage"; // Adjust path as needed

type Theme = "dark" | "light" | "system";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          root.classList.add(systemTheme);
          return;
        }
        root.classList.add(theme);
      },
    }),
    {
      name: "theme-storage",
      // storage: createJSONStorage(() => hashStorage),
    },
  ),
);
