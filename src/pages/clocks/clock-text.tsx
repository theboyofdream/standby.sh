import { useClockConfig } from "@/hooks/useClockConfig";
import { useEffect, useMemo, useState } from "react";

interface ClockTextProps {
  timezone?: string;
}

export function ClockText({ timezone }: ClockTextProps) {
  const { showSecs, hrsFormat } = useClockConfig();
  const [currentTime, setCurrentTime] = useState<string>("");

  // ponytail: one formatter per config change instead of one per tick
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: showSecs ? "2-digit" : undefined,
        hour12: hrsFormat === "12",
      }),
    [timezone, showSecs, hrsFormat]
  );

  useEffect(() => {
    const tick = () => setCurrentTime(formatter.format(new Date()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [formatter]);

  const [hours, minutes, secondsWithAMPM] = currentTime.split(":");
  const [seconds, ampm] = secondsWithAMPM?.split(" ") || [secondsWithAMPM, ""];

  return (
    <div className="flex w-fit items-baseline justify-center tabular-nums whitespace-nowrap">
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
        <span className="ml-[0.3em] text-[0.45em] sm:text-[0.3em] opacity-60 dark:opacity-30">
          {ampm}
        </span>
      )}
    </div>
  );
}
