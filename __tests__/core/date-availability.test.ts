import { describe, expect, it } from "vitest";
import {
  isJalaliDateSelectable,
  isJalaliMonthSelectable,
  isJalaliYearSelectable,
} from "../../src/core/date-availability";

const constraints = {
  minDate: { year: 1405, month: 5 as const, day: 10 },
  maxDate: { year: 1406, month: 2 as const, day: 20 },
};

describe("Jalali date availability", () => {
  it("applies inclusive day bounds", () => {
    expect(
      isJalaliDateSelectable({ year: 1405, month: 5, day: 9 }, constraints),
    ).toBe(false);
    expect(
      isJalaliDateSelectable({ year: 1405, month: 5, day: 10 }, constraints),
    ).toBe(true);
    expect(
      isJalaliDateSelectable({ year: 1406, month: 2, day: 20 }, constraints),
    ).toBe(true);
    expect(
      isJalaliDateSelectable({ year: 1406, month: 2, day: 21 }, constraints),
    ).toBe(false);
  });

  it("disables months that contain no selectable day", () => {
    expect(isJalaliMonthSelectable(1405, 4, constraints)).toBe(false);
    expect(isJalaliMonthSelectable(1405, 5, constraints)).toBe(true);
    expect(isJalaliMonthSelectable(1406, 2, constraints)).toBe(true);
    expect(isJalaliMonthSelectable(1406, 3, constraints)).toBe(false);
  });

  it("disables years that contain no selectable month", () => {
    expect(isJalaliYearSelectable(1404, constraints)).toBe(false);
    expect(isJalaliYearSelectable(1405, constraints)).toBe(true);
    expect(isJalaliYearSelectable(1406, constraints)).toBe(true);
    expect(isJalaliYearSelectable(1407, constraints)).toBe(false);
  });

  it("disables a whole month when its custom rule rejects every day", () => {
    expect(
      isJalaliMonthSelectable(1405, 6, {
        isDateDisabled: (date) => date.month === 6,
      }),
    ).toBe(false);
  });
});
