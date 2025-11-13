// hooks/useCountdown.ts
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Countdown = {
  id: string;
  label: string;
  targetDate: number; // timestamp in ms
  isActive: boolean;
  initialHours: number;
  initialMinutes: number;
  remainingMs?: number | null;
};

type CountdownState = {
  countdowns: Countdown[];
  activeCountdownId: string | null;
  addCountdown: (label: string, targetDate: Date, initialHours: number, initialMinutes: number) => void;
  removeCountdown: (id: string) => void;
  setActiveCountdown: (id: string) => void;
  updateCountdown: (id: string, label: string, targetDate: Date, initialHours: number, initialMinutes: number) => void;
  toggleCountdown: (id: string) => void;
};

export const useCountdown = create<CountdownState>()(
  persist(
    (set, get) => ({
      countdowns: [],
      activeCountdownId: null,

      addCountdown: (label, targetDate, initialHours, initialMinutes) => {
        if (get().countdowns.length >= 4) {
          toast.error("You can add maximum upto 4 countdowns.");
          return;
        }
        const newCountdown: Countdown = {
          id: Date.now().toString(),
          label,
          targetDate: targetDate.getTime(),
          isActive: false,
          initialHours,
          initialMinutes,
        };
        set((state) => ({
          countdowns: [...state.countdowns, newCountdown],
          activeCountdownId:
            state.activeCountdownId || newCountdown.id,
        }));
      },

      removeCountdown: (id) =>
        set((state) => {
          const newCountdowns = state.countdowns.filter(
            (countdown) => countdown.id !== id
          );
          return {
            countdowns: newCountdowns,
            activeCountdownId:
              state.activeCountdownId === id
                ? newCountdowns[0]?.id || null
                : state.activeCountdownId,
          };
        }),

      setActiveCountdown: (id) => set({ activeCountdownId: id }),

      updateCountdown: (id, label, targetDate, initialHours, initialMinutes) =>
        set((state) => ({
          countdowns: state.countdowns.map((countdown) =>
            countdown.id === id
              ? { ...countdown, label, targetDate: targetDate.getTime(), initialHours, initialMinutes, remainingMs: undefined }
              : countdown
          ),
        })),

      toggleCountdown: (id) =>
        set((state) => {
          const now = Date.now();
          const newCountdowns = state.countdowns.map((countdown) => {
            if (countdown.id !== id) return countdown;

            // If currently active -> pausing: store remainingMs and set isActive false
            if (countdown.isActive) {
              const remaining = countdown.targetDate - now;
              return { ...countdown, isActive: false, remainingMs: remaining > 0 ? remaining : 0 };
            }

            // If currently paused -> resuming: compute new targetDate from remainingMs (or keep existing)
            const remainingMs = countdown.remainingMs ?? Math.max(countdown.targetDate - now, 0);
            const newTarget = now + (remainingMs > 0 ? remainingMs : 0);
            return { ...countdown, isActive: true, targetDate: newTarget, remainingMs: undefined };
          });

          return { countdowns: newCountdowns };
        }),
    }),
    {
      name: "countdowns-storage", // Key for localStorage
    }
  )
);
