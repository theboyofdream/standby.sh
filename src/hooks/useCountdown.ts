// hooks/useCountdown.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Countdown = {
  id: string;
  label: string;
  targetDate: number; // timestamp in ms
  isPaused: boolean;
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
  markCountdownExpired: (id: string) => void;
  resetCountdown: (id: string) => void;
};

export const useCountdown = create<CountdownState>()(
  persist(
    (set) => ({
      countdowns: [],
      activeCountdownId: null,

      addCountdown: (label, targetDate, initialHours, initialMinutes) => {
        // if (get().countdowns.length >= 4) {
        //   toast.error("You can add maximum upto 4 countdowns.");
        //   return;
        // }
        const newCountdown: Countdown = {
          id: Date.now().toString(),
          label,
          targetDate: targetDate.getTime(),
          isPaused: true,
          initialHours,
          initialMinutes,
          // freeze display at full duration until first start
          remainingMs: (initialHours * 60 + initialMinutes) * 60 * 1000,
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

      setActiveCountdown: (id) =>
        set((state) => {
          const now = Date.now();
          // Pause any running countdowns when switching to a different countdown, except the one being activated
          const newCountdowns = state.countdowns.map((countdown) => {
            if (countdown.id === id) {
              // Don't pause the countdown being activated
              return countdown;
            }
            if (!countdown.isPaused) {
              const remaining = countdown.targetDate - now;
              return { ...countdown, isPaused: true, remainingMs: remaining > 0 ? remaining : 0 };
            }
            return countdown;
          });
          
          return {
            countdowns: newCountdowns,
            activeCountdownId: id,
          };
        }),

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
            if (countdown.id === id) {
              // If currently paused -> resuming: compute new targetDate from remainingMs (or keep existing)
              if (countdown.isPaused) {
                const remainingMs = countdown.remainingMs ?? Math.max(countdown.targetDate - now, 0);
                const newTarget = now + (remainingMs > 0 ? remainingMs : 0);
                return { ...countdown, isPaused: false, targetDate: newTarget, remainingMs: undefined };
              }
              // If currently running -> pausing: store remainingMs and set isPaused true
              const remaining = countdown.targetDate - now;
              return { ...countdown, isPaused: true, remainingMs: remaining > 0 ? remaining : 0 };
            }
            // Any other countdown that is running -> pause it so only one runs at a time
            if (!countdown.isPaused) {
              const remaining = countdown.targetDate - now;
              return { ...countdown, isPaused: true, remainingMs: remaining > 0 ? remaining : 0 };
            }
            return countdown;
          });

          return { countdowns: newCountdowns };
        }),

      markCountdownExpired: (id) =>
        set((state) => ({
          countdowns: state.countdowns.map((countdown) =>
            countdown.id === id
              ? { ...countdown, isPaused: true, remainingMs: 0 }
              : countdown
          ),
        })),

      resetCountdown: (id) =>
        set((state) => {
          const countdown = state.countdowns.find((c) => c.id === id);
          if (!countdown) return state;
          
          const now = Date.now();
          // Reset to original target date based on initial hours and minutes
          const newTargetDate = now + (countdown.initialHours * 60 * 60 * 1000) + (countdown.initialMinutes * 60 * 1000);
          
          return {
            countdowns: state.countdowns.map((c) =>
              c.id === id
                ? {
                    ...c,
                    targetDate: newTargetDate,
                    isPaused: true,
                    remainingMs: (c.initialHours * 60 + c.initialMinutes) * 60 * 1000,
                  }
                : c
            ),
          };
        }),
    }),
    {
      name: "countdowns-storage", // Key for localStorage
    }
  )
);
