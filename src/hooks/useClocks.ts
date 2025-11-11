// stores/useClocksStore.ts
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Clock = {
  id: string;
  label: string;
  timezone: string;
};

type ClocksState = {
  clocks: Clock[];
  activeClockId: string;
  addClock: (timezone: string, location: string) => void;
  removeClock: (id: string) => void;
  setActiveClock: (id: string) => void;
};

export const useClocks = create<ClocksState>()(
  persist(
    (set, get) => ({
      clocks: [
        {
          id: "1",
          timezone: "Asia/Kolkata",
          label: "Mumbai",
        },
      ],
      activeClockId: "1",

      addClock: (timezone, label) => {
        if (get().clocks.length >= 4) {
          toast.error("You can add maximum upto 4 clocks.");
          return;
        }
        set((state) => ({
          clocks: [
            ...state.clocks,
            { id: Date.now().toString(), timezone, label },
          ],
        }));
      },

      removeClock: (id) =>
        set((state) => {
          const newClocks = state.clocks.filter((clock) => clock.id !== id);
          return {
            clocks: newClocks,
            activeClockId:
              state.activeClockId === id
                ? newClocks[0]?.id
                : state.activeClockId,
          };
        }),

      setActiveClock: (id) => set({ activeClockId: id }),
    }),
    {
      name: "clocks-storage", // Key for localStorage
    },
  ),
);
