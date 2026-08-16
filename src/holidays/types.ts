import type { JalaliDate } from "../core/types";

/**
 * Holiday classification:
 * - 'solar': Fixed Iranian solar events (Nowruz, 22 Bahman, etc.)
 * - 'custom': User-defined events or organizational days off
 */
export type HolidayType = "solar" | "custom";

export interface OfficialHoliday {
  /** Title or description of the holiday */
  title: string;
  /** Category of the holiday */
  type: HolidayType;
  /** Whether this is an off day */
  isOff: boolean;
}

export interface CustomHolidayRule {
  date: JalaliDate;
  title: string;
  isOff?: boolean;
}
