import type { JalaliTime } from "./types";
import { toPersianDigits } from "../../formatters/persian-digits";

/**
 * Formats a single time segment (e.g. hour/minute) as a 2-digit padded string.
 */
export function formatTimeSegment(
  val: number,
  digitType: "persian" | "latin" = "persian",
): string {
  const padded = val < 10 ? `0${val}` : `${val}`;
  return digitType === "persian" ? toPersianDigits(padded) : padded;
}

/**
 * Retrieves the current local machine time as a JalaliTime structure.
 */
export function getCurrentTime(): JalaliTime {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
}

/**
 * Clamps hour, minute, and second within valid boundary ranges.
 */
export function clampTime(time: JalaliTime): JalaliTime {
  return {
    hour: Math.max(0, Math.min(23, time.hour)),
    minute: Math.max(0, Math.min(59, time.minute)),
    second:
      time.second !== undefined
        ? Math.max(0, Math.min(59, time.second))
        : undefined,
  };
}

/**
 * Formats a JalaliTime object into a display string (e.g., "14:30" or "۱۴:۳۰").
 */
export function formatTimeString(
  time: JalaliTime | null | undefined,
  showSeconds = false,
  digitType: "persian" | "latin" = "persian",
): string {
  if (!time) return "";
  const h = formatTimeSegment(time.hour, digitType);
  const m = formatTimeSegment(time.minute, digitType);
  if (showSeconds && time.second !== undefined) {
    const s = formatTimeSegment(time.second, digitType);
    return `${h}:${m}:${s}`;
  }
  return `${h}:${m}`;
}
