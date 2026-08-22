import { create } from "zustand";
import { persist } from "zustand/middleware";

// ponytail: epoch-based timing — elapsed is always derived, never ticked,
// so it survives reload/tab-sleep for free
export type Stopwatch = {
  id: string;
  label: string;
  startedAt: number | null; // epoch ms while running, null when paused
  accumulatedMs: number;
};

type StopwatchState = {
  stopwatches: Stopwatch[];
  activeStopwatchId: string | null;
  addStopwatch: (label?: string) => void;
  removeStopwatch: (id: string) => void;
  setActiveStopwatch: (id: string) => void;
  renameStopwatch: (id: string, label: string) => void;
  toggleStopwatch: (id: string) => void;
  resetStopwatch: (id: string) => void;
};

export function stopwatchElapsed(
  sw: Pick<Stopwatch, "startedAt" | "accumulatedMs">,
  now = Date.now()
) {
  return sw.accumulatedMs + (sw.startedAt !== null ? now - sw.startedAt : 0);
}

function pauseAll(stopwatches: Stopwatch[], exceptId?: string): Stopwatch[] {
  const now = Date.now();
  return stopwatches.map((sw) =>
    sw.startedAt !== null && sw.id !== exceptId
      ? { ...sw, accumulatedMs: stopwatchElapsed(sw, now), startedAt: null }
      : sw
  );
}

export const useStopwatch = create<StopwatchState>()(
  persist(
    (set) => ({
      stopwatches: [],
      activeStopwatchId: null,

      addStopwatch: (label) =>
        set((state) => {
          const sw: Stopwatch = {
            id: Date.now().toString(),
            label: label || `Stopwatch ${state.stopwatches.length + 1}`,
            startedAt: null,
            accumulatedMs: 0,
          };
          return {
            stopwatches: [...state.stopwatches, sw],
            activeStopwatchId: state.activeStopwatchId || sw.id,
          };
        }),

      removeStopwatch: (id) =>
        set((state) => {
          const remaining = state.stopwatches.filter((sw) => sw.id !== id);
          return {
            stopwatches: remaining,
            activeStopwatchId:
              state.activeStopwatchId === id
                ? remaining[0]?.id || null
                : state.activeStopwatchId,
          };
        }),

      setActiveStopwatch: (id) =>
        set((state) => ({
          stopwatches: pauseAll(state.stopwatches, id),
          activeStopwatchId: id,
        })),

      renameStopwatch: (id, label) =>
        set((state) => ({
          stopwatches: state.stopwatches.map((sw) =>
            sw.id === id ? { ...sw, label } : sw
          ),
        })),

      toggleStopwatch: (id) =>
        set((state) => {
          const now = Date.now();
          return {
            stopwatches: pauseAll(state.stopwatches, id).map((sw) => {
              if (sw.id !== id) return sw;
              // pausing
              if (sw.startedAt !== null)
                return { ...sw, accumulatedMs: stopwatchElapsed(sw, now), startedAt: null };
              // starting/resuming — skip if already finished at exactly 0? no, allow restart from 0
              return { ...sw, startedAt: now };
            }),
          };
        }),

      resetStopwatch: (id) =>
        set((state) => ({
          stopwatches: state.stopwatches.map((sw) =>
            sw.id === id ? { ...sw, startedAt: null, accumulatedMs: 0 } : sw
          ),
        })),
    }),
    { name: "stopwatches-storage" }
  )
);
