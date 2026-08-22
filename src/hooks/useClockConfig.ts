import { useEffect } from "react";
import { create } from "zustand";
import { persist /*, createJSONStorage*/ } from "zustand/middleware";
// import { hashStorage } from "./storage"; // Adjust path as needed

export type FontScale = "sm" | "md" | "lg" | "xl";

// root font-size percentages — tailwind rem-based sizes scale with it
export const FONT_SCALES: Record<FontScale, { label: string; percent: string }> = {
  sm: { label: "Small", percent: "87.5%" },
  md: { label: "Default", percent: "100%" },
  lg: { label: "Large", percent: "112.5%" },
  xl: { label: "Extra large", percent: "125%" },
};

type ClockConfigState = {
  showSecs: boolean;
  hrsFormat: "12" | "24";
  fontScale: FontScale;
  setShowSecs: (show: boolean) => void;
  setHrsFormat: (format: "12" | "24") => void;
  setFontScale: (scale: FontScale) => void;
};

export const useClockConfig = create<ClockConfigState>()(
  persist(
    (set) => ({
      showSecs: true,
      hrsFormat: "12",
      fontScale: "md",
      setShowSecs: (show) => set({ showSecs: show }),
      setHrsFormat: (format) => set({ hrsFormat: format }),
      setFontScale: (fontScale) => set({ fontScale }),
    }),
    {
      name: "clock-config-storage",
    },
  ),
);

export function useApplyFontScale() {
  const fontScale = useClockConfig((s) => s.fontScale);
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SCALES[fontScale].percent;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [fontScale]);
}
