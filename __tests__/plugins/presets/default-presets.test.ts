import { describe, it, expect } from "vitest";
import {
  addDaysToJalali,
  getJalaliWeekRange,
  getJalaliMonthRange,
  getDefaultJalaliPresets,
} from "./../../../src/plugins/presets";
import type { JalaliDate } from "../../../src/core/types";

describe("Presets Calculations", () => {
  it("adds and subtracts days across month and year boundaries correctly", () => {
    const endOfFarvardin: JalaliDate = { year: 1405, month: 0, day: 31 };
    const nextDay = addDaysToJalali(endOfFarvardin, 1);
    expect(nextDay).toEqual({ year: 1405, month: 1, day: 1 }); // 1 Ordibehesht

    const firstOfFarvardin: JalaliDate = { year: 1405, month: 0, day: 1 };
    const prevDay = addDaysToJalali(firstOfFarvardin, -1);
    expect(prevDay).toEqual({ year: 1404, month: 11, day: 29 }); // 29 Esfand (1404 is non-leap)
  });

  it("calculates full Jalali week range starting Saturday and ending Friday", () => {
    // 1405/01/01 is Saturday (شنبه)
    const sat: JalaliDate = { year: 1405, month: 0, day: 1 };
    const [start, end] = getJalaliWeekRange(sat);

    expect(start).toEqual({ year: 1405, month: 0, day: 1 }); // Saturday
    expect(end).toEqual({ year: 1405, month: 0, day: 7 }); // Friday
  });

  it("calculates full month range from day 1 to last day of month", () => {
    const sampleDate: JalaliDate = { year: 1405, month: 0, day: 15 };
    const [start, end] = getJalaliMonthRange(sampleDate);

    expect(start).toEqual({ year: 1405, month: 0, day: 1 });
    expect(end).toEqual({ year: 1405, month: 0, day: 31 }); // Farvardin has 31 days
  });

  it("generates default presets with Persian digit formatting", () => {
    const presets = getDefaultJalaliPresets("persian");
    expect(presets.find((p) => p.id === "last_7_days")?.label).toBe(
      "۷ روز گذشته",
    );
    expect(presets.find((p) => p.id === "last_30_days")?.label).toBe(
      "۳۰ روز گذشته",
    );
  });
});
