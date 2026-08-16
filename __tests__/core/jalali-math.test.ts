import { describe, it, expect } from "vitest";
import {
  gregorianToJalali,
  jalaliToGregorian,
  isJalaliLeapYear,
  getDaysInJalaliMonth,
} from "../../src/core/jalali-math";
import { generateJalaliCalendarGrid } from "../../src/core/calendar-grid";

describe("Jalali Conversion & Math Engine", () => {
  it("converts known historical & modern dates correctly", () => {
    // 2026-03-21 -> 1405-01-01 (Nowruz)
    const nowruz = gregorianToJalali(2026, 3, 21);
    expect(nowruz).toEqual({ year: 1405, month: 0, day: 1 });

    // Roundtrip verification
    const gBack = jalaliToGregorian(1405, 0, 1);
    expect(gBack.getFullYear()).toBe(2026);
    expect(gBack.getMonth()).toBe(2); // March (0-indexed)
    expect(gBack.getDate()).toBe(21);
  });

  it("correctly calculates leap year days for Esfand", () => {
    // 1403 is a leap year (کبیسه), Esfand has 30 days
    expect(isJalaliLeapYear(1403)).toBe(true);
    expect(getDaysInJalaliMonth(1403, 11)).toBe(30);

    // 1404 is a regular year, Esfand has 29 days
    expect(isJalaliLeapYear(1404)).toBe(false);
    expect(getDaysInJalaliMonth(1404, 11)).toBe(29);
  });

  it("generates an exact 42-cell grid aligned with Saturday as first day of week", () => {
    const grid = generateJalaliCalendarGrid({
      year: 1405,
      month: 0, // Farvardin 1405
    });

    expect(grid).toHaveLength(42);
    // Farvardin 1st, 1405 is Saturday (شنبه) -> should have 0 leading padding days
    expect(grid[0].isCurrentMonth).toBe(true);
    expect(grid[0].dayNumber).toBe(1);
  });
});
