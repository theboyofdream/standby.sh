import { useClockConfig } from "@/hooks/useClockConfig";
import { useEffect, useState } from "react";

interface ClockTextProps {
  timezone?: string;
}

export function ClockText({ timezone }: ClockTextProps) {
  const { showSecs, hrsFormat } = useClockConfig();
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: showSecs ? "2-digit" : undefined,
        hour12: hrsFormat === "12",
      };
      setCurrentTime(now.toLocaleTimeString("en-US", options));
    }, 1000);

    return () => clearInterval(timer);
  }, [timezone, showSecs, hrsFormat]);

  const [hours, minutes, secondsWithAMPM] = currentTime.split(":");
  const [seconds, ampm] = secondsWithAMPM?.split(" ") || [secondsWithAMPM, ""];

  return (
    <div className="flex w-fit max-h-fit items-start justify-center">
      <span>{hours}</span>
      <span className="opacity-60 dark:opacity-30">:</span>
      <span>{minutes}</span>
      {showSecs && (
        <>
          <span className="opacity-60 dark:opacity-30">:</span>
          <span>{seconds}</span>
        </>
      )}
      {hrsFormat === "12" && (
        <span className="text-[5vw] opacity-60 dark:opacity-30">
          &nbsp;{ampm}
        </span>
      )}
    </div>
  );
}
