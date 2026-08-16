import { describe, it, expect } from "vitest";
import { formatJalaliDate } from "../../src/formatters/jalali-formatter";
import {
  toPersianDigits,
  toLatinDigits,
} from "../../src/formatters/persian-digits";
import { JalaliDate } from "../../src/core/types";

describe("Digit Converters", () => {
  it("converts Latin to Persian digits and vice versa", () => {
    expect(toPersianDigits("1405/01/05")).toBe("۱۴۰۵/۰۱/۰۵");
    expect(toLatinDigits("۱۴۰۵/۰۱/۰۵")).toBe("1405/01/05");
  });
});

describe("Jalali Date Formatter", () => {
  // 1 Farvardin 1405 is Saturday (شنبه)
  const nowruz1405: JalaliDate = { year: 1405, month: 0, day: 1 };

  it("formats with default pattern YYYY/MM/DD using Persian digits", () => {
    const formatted = formatJalaliDate(nowruz1405);
    expect(formatted).toBe("۱۴۰۵/۰۱/۰۱");
  });

  it("formats with Latin digits when specified", () => {
    const formatted = formatJalaliDate(nowruz1405, "YYYY/MM/DD", {
      digitType: "latin",
    });
    expect(formatted).toBe("1405/01/01");
  });

  it("formats complex patterns including full weekday and month names", () => {
    const formatted = formatJalaliDate(nowruz1405, "dddd D MMMM YYYY", {
      digitType: "persian",
    });
    expect(formatted).toBe("شنبه ۱ فروردین ۱۴۰۵");
  });

  it("returns empty string when date is null or undefined", () => {
    expect(formatJalaliDate(null)).toBe("");
    expect(formatJalaliDate(undefined)).toBe("");
  });
});
