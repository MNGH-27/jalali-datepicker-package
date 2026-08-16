const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const LATIN_DIGITS: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4", // Arabic-indic fallbacks
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

/**
 * Converts Latin digits (0-9) to Persian digits (۰-۹).
 */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

/**
 * Converts Persian/Arabic digits to standard ASCII Latin digits (0-9).
 */
export function toLatinDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (char) => LATIN_DIGITS[char] ?? char);
}
