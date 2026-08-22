import { useEffect, useRef, useState } from "react";

interface CountdownTextProps {
  targetDate: number;
  isRunning: boolean;
  remainingMs?: number | null;
  onExpire?: () => void;
}

function formatRemaining(difference: number) {
  if (difference <= 0) return "00:00:00";
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

export function CountdownText({
  targetDate,
  isRunning,
  remainingMs,
  onExpire,
}: CountdownTextProps) {
  const compute = () =>
    formatRemaining(
      isRunning
        ? targetDate - Date.now()
        : (remainingMs ?? Math.max(targetDate - Date.now(), 0))
    );

  const [timeLeft, setTimeLeft] = useState(compute);
  const expireFired = useRef(false);

  useEffect(() => {
    // paused: static render, no timer needed
    if (!isRunning) {
      expireFired.current = false;
      setTimeLeft(compute());
      return;
    }

    const tick = () => {
      const difference = targetDate - Date.now();
      setTimeLeft(formatRemaining(difference));
      if (difference <= 0 && !expireFired.current) {
        expireFired.current = true; // guard: fire once even before parent re-renders
        onExpire?.();
      }
    };

    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate, isRunning, remainingMs]);

  return <span className="tabular-nums">{timeLeft}</span>;
}
