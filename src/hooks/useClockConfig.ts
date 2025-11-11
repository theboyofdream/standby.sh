import { create } from "zustand";
import { persist /*, createJSONStorage*/ } from "zustand/middleware";
// import { hashStorage } from "./storage"; // Adjust path as needed

type ClockConfigState = {
  showSecs: boolean;
  hrsFormat: "12" | "24";
  setShowSecs: (show: boolean) => void;
  setHrsFormat: (format: "12" | "24") => void;
};

export const useClockConfig = create<ClockConfigState>()(
  persist(
    (set) => ({
      showSecs: true,
      hrsFormat: "12",
      setShowSecs: (show) => set({ showSecs: show }),
      setHrsFormat: (format) => set({ hrsFormat: format }),
    }),
    {
      name: "clock-config-storage",
    },
  ),
);
