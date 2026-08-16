import type {
  JalaliCalendarCell,
  JalaliGridOptions,
  JalaliDate,
  JalaliMonthIndex,
} from "./types";
import {
  jalaliToGregorian,
  gregorianToJalali,
  getDaysInJalaliMonth,
  getTodayJalali,
  isSameJalaliDay,
} from "./jalali-math";

/**
 * Normalizes input date (Date or JalaliDate) into JalaliDate object.
 */
export function toJalaliDate(input: Date | JalaliDate): JalaliDate {
  if (input instanceof Date) {
    return gregorianToJalali(
      input.getFullYear(),
      input.getMonth() + 1,
      input.getDate(),
    );
  }
  return input;
}

/**
 * Generates a 42-cell (6 rows x 7 columns) matrix for a given Jalali month.
 */
export function generateJalaliCalendarGrid(
  options: JalaliGridOptions,
): JalaliCalendarCell[] {
  const {
    year,
    month,
    firstDayOfWeek = 0, // 0 = Saturday (شنبه)
    selectedDate,
    minDate,
    maxDate,
    isDateDisabled,
  } = options;

  const cells: JalaliCalendarCell[] = [];
  const todayJalali = getTodayJalali();
  const activeSelected = selectedDate ? toJalaliDate(selectedDate) : null;
  const minJalali = minDate ? toJalaliDate(minDate) : null;
  const maxJalali = maxDate ? toJalaliDate(maxDate) : null;

  // Convert Jalali 1st of month to Gregorian to read weekday
  const firstDayGregorian = jalaliToGregorian(year, month, 1);

  // JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  // Map standard JS getDay() to Jalali index: 6(Sat)->0, 0(Sun)->1, ..., 5(Fri)->6
  const jsDay = firstDayGregorian.getDay();
  const rawJalaliWeekDay = (jsDay + 1) % 7;

  const leadingPaddingCount = (rawJalaliWeekDay - firstDayOfWeek + 7) % 7;

  // 1. Previous month trailing days
  const prevMonth = (month === 0 ? 11 : month - 1) as JalaliMonthIndex;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInJalaliMonth(prevYear, prevMonth);

  for (let i = leadingPaddingCount - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const jDate: JalaliDate = { year: prevYear, month: prevMonth, day };
    cells.push(buildCell(jDate, false));
  }

  // 2. Current month days
  const totalDays = getDaysInJalaliMonth(year, month);
  for (let d = 1; d <= totalDays; d++) {
    const jDate: JalaliDate = { year, month, day: d };
    cells.push(buildCell(jDate, true));
  }

  // 3. Next month leading days (completing 42 cells)
  const nextMonth = (month === 11 ? 0 : month + 1) as JalaliMonthIndex;
  const nextYear = month === 11 ? year + 1 : year;
  const trailingPaddingCount = 42 - cells.length;

  for (let d = 1; d <= trailingPaddingCount; d++) {
    const jDate: JalaliDate = { year: nextYear, month: nextMonth, day: d };
    cells.push(buildCell(jDate, false));
  }

  function buildCell(
    jDate: JalaliDate,
    isCurrentMonth: boolean,
  ): JalaliCalendarCell {
    const gregDate = jalaliToGregorian(jDate.year, jDate.month, jDate.day);
    const isToday = isSameJalaliDay(jDate, todayJalali);
    const isSelected = activeSelected
      ? isSameJalaliDay(jDate, activeSelected)
      : false;

    let isDisabled = false;
    if (minJalali) {
      const minG = jalaliToGregorian(
        minJalali.year,
        minJalali.month,
        minJalali.day,
      );
      if (gregDate.getTime() < minG.getTime()) isDisabled = true;
    }
    if (maxJalali) {
      const maxG = jalaliToGregorian(
        maxJalali.year,
        maxJalali.month,
        maxJalali.day,
      );
      if (gregDate.getTime() > maxG.getTime()) isDisabled = true;
    }
    if (isDateDisabled && isDateDisabled(jDate, gregDate)) {
      isDisabled = true;
    }

    return {
      jalali: jDate,
      gregorianDate: gregDate,
      dayNumber: jDate.day,
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled,
    };
  }

  return cells;
}
