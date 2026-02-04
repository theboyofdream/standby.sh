import { useEffect, useState } from "react";

interface CountdownTextProps {
  targetDate: number;
  isRunning: boolean;
  remainingMs?: number | null;
}

export function CountdownText({ targetDate, isRunning, remainingMs }: CountdownTextProps) {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  useEffect(() => {
    if (!isRunning) {
      // If not active, show frozen remainingMs if provided, otherwise compute from targetDate
      const now = Date.now();
      const difference = remainingMs ?? Math.max(targetDate - now, 0);

      if (difference <= 0) {
        setTimeLeft("00:00:00");
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      }
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isRunning, remainingMs]);

  return <span>{timeLeft}</span>;
}
