import type { JalaliDate, JalaliMonthIndex } from "../../core/types";
import type { DateParseResult } from "./types";
import {
  toLatinDigits,
  toPersianDigits,
} from "../../formatters/persian-digits";
import { getDaysInJalaliMonth } from "../../core/jalali-math";
import { compareJalaliDates } from "../../core/jalali-helpers";

/**
 * Strips all non-digit characters and applies the 'YYYY/MM/DD' mask structure.
 */
export function applyDateMask(
  rawInput: string,
  digitType: "persian" | "latin" = "persian",
): string {
  // Normalize all Persian/Arabic digits to ASCII 0-9
  const cleanDigits = toLatinDigits(rawInput).replace(/\D/g, "").slice(0, 8);

  let masked = "";
  if (cleanDigits.length > 0) {
    masked = cleanDigits.slice(0, 4); // Year (YYYY)
  }
  if (cleanDigits.length >= 5) {
    masked += `/${cleanDigits.slice(4, 6)}`; // Month (MM)
  }
  if (cleanDigits.length >= 7) {
    masked += `/${cleanDigits.slice(6, 8)}`; // Day (DD)
  }

  return digitType === "persian" ? toPersianDigits(masked) : masked;
}

/**
 * Validates and parses a masked string into a valid JalaliDate object.
 */
export function parseAndValidateJalaliString(
  input: string,
  minDate?: JalaliDate,
  maxDate?: JalaliDate,
  isDateDisabled?: (date: JalaliDate) => boolean,
): DateParseResult {
  const normalized = toLatinDigits(input).trim();

  if (!normalized) {
    return { isValid: true, date: null };
  }

  const parts = normalized.split("/");
  if (
    parts.length !== 3 ||
    parts[0].length !== 4 ||
    parts[1].length !== 2 ||
    parts[2].length !== 2
  ) {
    return { isValid: false, date: null, error: "INVALID_FORMAT" };
  }

  const year = parseInt(parts[0], 10);
  const monthNum = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Validate Month Range (1 to 12)
  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, date: null, error: "INVALID_MONTH" };
  }

  const monthIndex = (monthNum - 1) as JalaliMonthIndex;
  const maxDays = getDaysInJalaliMonth(year, monthIndex);

  // Validate Day Range (1 to 29/30/31 based on month & leap year)
  if (day < 1 || day > maxDays) {
    return { isValid: false, date: null, error: "INVALID_DAY" };
  }

  const jalaliDate: JalaliDate = { year, month: monthIndex, day };

  // Min / Max range validations
  if (minDate && compareJalaliDates(jalaliDate, minDate) < 0) {
    return { isValid: false, date: jalaliDate, error: "OUT_OF_MIN_BOUNDS" };
  }

  if (maxDate && compareJalaliDates(jalaliDate, maxDate) > 0) {
    return { isValid: false, date: jalaliDate, error: "OUT_OF_MAX_BOUNDS" };
  }

  // Custom disable rule
  if (isDateDisabled && isDateDisabled(jalaliDate)) {
    return { isValid: false, date: jalaliDate, error: "DISABLED_DATE" };
  }

  return { isValid: true, date: jalaliDate };
}
