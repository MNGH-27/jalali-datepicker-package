import type { JalaliDate } from "../core/types";

/**
 * Event item definition associated with a specific Jalali date.
 */
export interface CalendarEvent {
  /** Unique identifier for the event */
  id: string;
  /** Target Jalali date */
  date: JalaliDate;
  /** Short title or subject of the event */
  title: string;
  /** Optional detailed description */
  description?: string;
  /** Custom badge dot color (e.g., '#3b82f6', '#10b981', '#f59e0b') */
  color?: string;
}
