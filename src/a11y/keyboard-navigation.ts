import type { JalaliMonthIndex } from "../core/types";
import { getDaysInJalaliMonth } from "../core/jalali-math";
import type { NavigateOptions, NavigationResult } from "./types";

export function calculateNextFocusedDate(
  options: NavigateOptions,
): NavigationResult {
  const { currentFocused, key, isRtl = true } = options;
  let { year, month, day } = currentFocused;
  let viewChanged = false;
  let handled = true;

  // Handle RTL vs LTR arrow directions
  const stepLeft = isRtl ? 1 : -1;
  const stepRight = isRtl ? -1 : 1;

  switch (key) {
    case "ArrowRight":
      day += stepRight;
      break;

    case "ArrowLeft":
      day += stepLeft;
      break;

    case "ArrowUp":
      day -= 7;
      break;

    case "ArrowDown":
      day += 7;
      break;

    case "Home":
      day = 1;
      break;

    case "End":
      day = getDaysInJalaliMonth(year, month);
      break;

    case "PageUp":
      // Previous Month
      if (month === 0) {
        year -= 1;
        month = 11;
      } else {
        month = (month - 1) as JalaliMonthIndex;
      }
      viewChanged = true;
      break;

    case "PageDown":
      // Next Month
      if (month === 11) {
        year += 1;
        month = 0;
      } else {
        month = (month + 1) as JalaliMonthIndex;
      }
      viewChanged = true;
      break;

    default:
      handled = false;
      return { nextDate: currentFocused, viewChanged: false, handled: false };
  }

  // Normalize days falling outside current month boundary
  while (day < 1) {
    if (month === 0) {
      year -= 1;
      month = 11;
    } else {
      month = (month - 1) as JalaliMonthIndex;
    }
    day += getDaysInJalaliMonth(year, month);
    viewChanged = true;
  }

  while (day > getDaysInJalaliMonth(year, month)) {
    day -= getDaysInJalaliMonth(year, month);
    if (month === 11) {
      year += 1;
      month = 0;
    } else {
      month = (month + 1) as JalaliMonthIndex;
    }
    viewChanged = true;
  }

  return {
    nextDate: { year, month, day },
    viewChanged,
    handled,
  };
}
