import type { DatePickerPreset } from "./types";
import { getTodayJalali, getDaysInJalaliMonth } from "../../core/jalali-math";
import {
  addDaysToJalali,
  getJalaliWeekRange,
  getJalaliMonthRange,
} from "../../core/jalali-helpers";
import type { JalaliMonthIndex } from "../../core/types";
import { toPersianDigits } from "../../formatters/persian-digits";

// Re-export helpers so tests importing from presets find them directly
export { addDaysToJalali, getJalaliWeekRange, getJalaliMonthRange };

export function getDefaultJalaliPresets(
  digitType: "persian" | "latin" = "persian",
): DatePickerPreset[] {
  const formatNum = (n: number | string) =>
    digitType === "persian" ? toPersianDigits(n) : `${n}`;

  return [
    {
      id: "today",
      label: "امروز",
      getValue: () => getTodayJalali(),
    },
    {
      id: "this_week",
      label: "این هفته",
      getValue: () => getJalaliWeekRange(getTodayJalali()),
    },
    {
      id: "last_7_days",
      label: `${formatNum(7)} روز گذشته`,
      getValue: () => {
        const today = getTodayJalali();
        return [addDaysToJalali(today, -6), today];
      },
    },
    {
      id: "this_month",
      label: "این ماه",
      getValue: () => getJalaliMonthRange(getTodayJalali()),
    },
    {
      id: "last_month",
      label: "ماه گذشته",
      getValue: () => {
        const today = getTodayJalali();
        let prevYear = today.year;
        let prevMonth = (today.month - 1) as JalaliMonthIndex;

        if (prevMonth < 0) {
          prevMonth = 11;
          prevYear -= 1;
        }

        const daysInPrevMonth = getDaysInJalaliMonth(prevYear, prevMonth);
        return [
          { year: prevYear, month: prevMonth, day: 1 },
          { year: prevYear, month: prevMonth, day: daysInPrevMonth },
        ];
      },
    },
    {
      id: "last_30_days",
      label: `${formatNum(30)} روز گذشته`,
      getValue: () => {
        const today = getTodayJalali();
        return [addDaysToJalali(today, -29), today];
      },
    },
  ];
}

export const DEFAULT_DATE_PICKER_PRESETS = getDefaultJalaliPresets("persian");
