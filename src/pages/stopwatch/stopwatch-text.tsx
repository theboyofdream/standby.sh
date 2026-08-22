import { stopwatchElapsed } from "@/hooks/useStopwatch";
import { useEffect, useState } from "react";

function formatStopwatch(ms: number) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSecs = Math.floor(totalCs / 100);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    return `${hours}:${pad(mins % 60)}:${pad(secs)}.${pad(cs)}`;
  }
  return `${pad(mins)}:${pad(secs)}.${pad(cs)}`;
}

interface StopwatchTextProps {
  startedAt: number | null;
  accumulatedMs: number;
}

export function StopwatchText({ startedAt, accumulatedMs }: StopwatchTextProps) {
  const isRunning = startedAt !== null;
  const [elapsed, setElapsed] = useState(() =>
    accumulatedMs + (isRunning ? Date.now() - (startedAt as number) : 0)
  );

  useEffect(() => {
    if (!isRunning) {
      setElapsed(accumulatedMs);
      return;
    }
    // ponytail: 33ms interval for centisecond display; rAF not worth the code here
    const id = setInterval(() => setElapsed(stopwatchElapsed({ startedAt: startedAt!, accumulatedMs })), 33);
    return () => clearInterval(id);
  }, [startedAt, accumulatedMs, isRunning]);

  return <span className="tabular-nums">{formatStopwatch(elapsed)}</span>;
}
