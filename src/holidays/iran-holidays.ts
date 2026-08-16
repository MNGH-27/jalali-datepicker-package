import type { JalaliDate } from "../core/types";
import type { OfficialHoliday, CustomHolidayRule } from "./types";
import { jalaliToGregorian } from "../core/jalali-math";

/**
 * Fixed Solar Calendar Holidays in Iran:
 * Key format: `${monthIndex}-${day}` (Month index is 0-based: 0 = Farvardin, 11 = Esfand)
 */
const FIXED_SOLAR_HOLIDAYS: Record<string, string> = {
  "0-1": "جشن نوروز / سال نو",
  "0-2": "عید نوروز",
  "0-3": "عید نوروز",
  "0-4": "عید نوروز",
  "0-12": "روز جمهوری اسلامی ایران",
  "0-13": "روز طبیعت (سیزده‌بدر)",
  "2-14": "رحلت امام خمینی",
  "2-15": "قیام ۱۵ خرداد",
  "10-22": "پیروزی انقلاب اسلامی",
  "11-29": "روز ملی شدن صنعت نفت",
};

/**
 * Checks if a given Jalali date is Friday (جمعه).
 */
export function isJalaliFriday(date: JalaliDate): boolean {
  const g = jalaliToGregorian(date.year, date.month, date.day);
  return g.getDay() === 5; // In JS Date.getDay(), 5 represents Friday
}

/**
 * Resolves holiday info for a JalaliDate based purely on solar calendar rules and custom overrides.
 */
export function getOfficialHoliday(
  date: JalaliDate,
  customHolidays?: CustomHolidayRule[],
): OfficialHoliday | null {
  // 1. Check Custom User-Defined Holidays
  if (customHolidays && customHolidays.length > 0) {
    const custom = customHolidays.find(
      (h) =>
        h.date.year === date.year &&
        h.date.month === date.month &&
        h.date.day === date.day,
    );
    if (custom) {
      return {
        title: custom.title,
        type: "custom",
        isOff: custom.isOff ?? true,
      };
    }
  }

  // 2. Check Fixed Solar Holidays (O(1) Hash Map Lookup)
  const solarKey = `${date.month}-${date.day}`;
  if (FIXED_SOLAR_HOLIDAYS[solarKey]) {
    return {
      title: FIXED_SOLAR_HOLIDAYS[solarKey],
      type: "solar",
      isOff: true,
    };
  }

  // 3. Check Friday (End of Week)
  if (isJalaliFriday(date)) {
    return { title: "جمعه (تعطیل پایان هفته)", type: "solar", isOff: true };
  }

  return null;
}
