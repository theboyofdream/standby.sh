import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getUtcOffset(timezone: string) {
    const now = new Date();
    const tz = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value;
  
    return tz?.startsWith("UTC") ? tz : `UTC${tz?.replace("GMT", "") || "+00"}`;
  }
