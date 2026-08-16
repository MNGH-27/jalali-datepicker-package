import { describe, it, expect } from "vitest";
import {
  applyDateMask,
  parseAndValidateJalaliString,
} from "../../src/components/masked-input/mask-utils";

describe("Mask Utilities", () => {
  it("automatically adds slashes at positions 4 and 7", () => {
    expect(applyDateMask("1405", "latin")).toBe("1405");
    expect(applyDateMask("140501", "latin")).toBe("1405/01");
    expect(applyDateMask("14050115", "latin")).toBe("1405/01/15");
  });

  it("converts Persian input to masked Persian output", () => {
    expect(applyDateMask("۱۴۰۵۰۱۱۵", "persian")).toBe("۱۴۰۵/۰۱/۱۵");
  });

  it("validates and parses correct dates", () => {
    const res = parseAndValidateJalaliString("۱۴۰۵/۰۱/۱۵");
    expect(res.isValid).toBe(true);
    expect(res.date).toEqual({ year: 1405, month: 0, day: 15 });
  });

  it("detects month range errors (> 12)", () => {
    const res = parseAndValidateJalaliString("۱۴۰۵/۱۳/۰۱");
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("INVALID_MONTH");
  });

  it("validates leap year days in Esfand (month 11)", () => {
    // 1403 is a leap year (Esfand has 30 days)
    const leapValid = parseAndValidateJalaliString("۱۴۰۳/۱۲/۳۰");
    expect(leapValid.isValid).toBe(true);

    // 1404 is a non-leap year (Esfand has 29 days)
    const nonLeapInvalid = parseAndValidateJalaliString("۱۴۰۴/۱۲/۳۰");
    expect(nonLeapInvalid.isValid).toBe(false);
    expect(nonLeapInvalid.error).toBe("INVALID_DAY");
  });
});
