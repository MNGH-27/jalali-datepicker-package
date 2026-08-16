import type { JalaliDate } from "../core/types";
import { isSameJalaliDay } from "../core/jalali-math";
import type { CalendarEvent } from "./types";

/**
 * Filters and returns all events matching a specific Jalali date.
 */
export function getEventsForDate(
  date: JalaliDate,
  events?: CalendarEvent[],
): CalendarEvent[] {
  if (!events || events.length === 0) return [];
  return events.filter((e) => isSameJalaliDay(e.date, date));
}
