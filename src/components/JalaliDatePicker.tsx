import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useJalaliDatePicker } from "../hooks/useJalaliDatePicker";
import { useCalendarKeyboard } from "../a11y/useCalendarKeyboard";
import type {
  SelectionMode,
  JalaliDateRange,
  InternalSelectedValue,
  SelectedDateValue,
  DateRange,
} from "../hooks/types";
import { Header } from "./Header";
import { Weekdays } from "./Weekdays";
import { DayCell } from "./DayCell";
import { MonthYearPicker } from "./MonthYearPicker";
import type {
  JalaliDate,
  JalaliMonthIndex,
  JalaliCalendarCell,
} from "../core/types";
import { formatJalaliDate } from "../formatters/jalali-formatter";
import { PERSIAN_MONTH_NAMES } from "../core/constants";
import { toPersianDigits } from "../formatters/persian-digits";
import { CalendarFooter } from "./footer/CalendarFooter";
import { TimePicker } from "../plugins/time-picker/TimePicker";
import type { JalaliTime } from "../plugins/time-picker/types";
import {
  formatTimeString,
  getCurrentTime,
} from "../plugins/time-picker/time-utils";
import { MaskedDateInput } from "./masked-input/MaskedDateInput";
import { generateJalaliCalendarGrid } from "../core/calendar-grid";
import {
  isJalaliDateBetween,
  jsDateToJalali,
  jalaliToJsDate,
} from "../core/jalali-helpers";
import { isSameJalaliDay } from "../core/jalali-math";
import type { CalendarEvent } from "../events/types";
import { getEventsForDate } from "../events/event-utils";
import { getOfficialHoliday } from "../holidays";
import type { CustomHolidayRule } from "../holidays/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";

export interface JalaliDatePickerProps<M extends SelectionMode = "single"> {
  /** حالت انتخاب تاریخ: single | range | multiple */
  mode?: M;
  /** مقدار تاریخ کنترل‌شده (شیء Date جاوااسکریپت) */
  value?: SelectedDateValue<M>;
  /** مقدار اولیه غیرکنترل‌شده (شیء Date جاوااسکریپت) */
  defaultValue?: SelectedDateValue<M>;
  /** خروجی انتخاب تاریخ (شیء Date جاوااسکریپت) */
  onChange?: (val: SelectedDateValue<M>) => void;

  /** حداقل تاریخ مجاز */
  minDate?: Date;
  /** حداکثر تاریخ مجاز */
  maxDate?: Date;
  /** غیرفعال‌سازی روزها بر اساس شرط */
  isDateDisabled?: (date: Date) => boolean;

  /** نوع ارقام: persian یا latin */
  digitType?: "persian" | "latin";
  /** نوع نمایش: inline | popover | modal */
  variant?: "inline" | "popover" | "modal";
  /** متن Placeholder */
  placeholder?: string;
  /** شروع هفته (۰ = شنبه) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  // استایل‌دهی
  className?: string;
  style?: React.CSSProperties;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;

  // فوتر
  showFooter?: boolean;
  showStatusText?: boolean;
  showActions?: boolean;
  onConfirm?: () => void;

  // زمان
  enableTime?: boolean;
  timeValue?: JalaliTime | null;
  defaultTimeValue?: JalaliTime;
  onTimeChange?: (time: JalaliTime) => void;
  minuteStep?: number;
  hourStep?: number;
  showSeconds?: boolean;

  // تقویم دو ماهه و اینپوت ماسک‌دار
  numberOfMonths?: 1 | 2;
  useMaskedInput?: boolean;

  // رویدادها و تعطیلات
  events?: CalendarEvent[];
  showHolidays?: boolean;
  customHolidays?: CustomHolidayRule[];
}

export function JalaliDatePicker<M extends SelectionMode = "single">({
  mode = "single" as M,
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  isDateDisabled,
  firstDayOfWeek = 0,
  variant = "inline",
  placeholder = "انتخاب تاریخ...",
  digitType = "persian",
  className,
  style,
  classNames,
  styles,
  showFooter = false,
  showStatusText = true,
  showActions = true,
  onConfirm,
  enableTime = false,
  timeValue,
  defaultTimeValue,
  onTimeChange,
  minuteStep = 1,
  hourStep = 1,
  showSeconds = false,
  numberOfMonths = 1,
  useMaskedInput = false,
  events,
  showHolidays = false,
  customHolidays,
}: JalaliDatePickerProps<M>) {
  const [isOpen, setIsOpen] = useState(variant === "inline");
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isModal = variant === "modal";

  // ۱. تبدیل ورودی‌های Date به JalaliDate برای هوک داخلی
  const internalJalaliValue = useMemo<
    InternalSelectedValue<M> | undefined
  >(() => {
    if (value === undefined) return undefined;
    if (!value) return null as InternalSelectedValue<M>;
    if (value instanceof Date) {
      return jsDateToJalali(value) as InternalSelectedValue<M>;
    }
    if (Array.isArray(value)) {
      if (mode === "range") {
        const [start, end] = value as DateRange;
        return [
          start ? jsDateToJalali(start) : null,
          end ? jsDateToJalali(end) : null,
        ] as InternalSelectedValue<M>;
      }
      if (mode === "multiple") {
        return (value as Date[]).map((d) =>
          jsDateToJalali(d),
        ) as InternalSelectedValue<M>;
      }
    }
    return null as InternalSelectedValue<M>;
  }, [value, mode]);

  const internalDefaultJalaliValue = useMemo<
    InternalSelectedValue<M> | undefined
  >(() => {
    if (defaultValue === undefined) return undefined;
    if (!defaultValue) return null as InternalSelectedValue<M>;
    if (defaultValue instanceof Date) {
      return jsDateToJalali(defaultValue) as InternalSelectedValue<M>;
    }
    if (Array.isArray(defaultValue)) {
      if (mode === "range") {
        const [start, end] = defaultValue as DateRange;
        return [
          start ? jsDateToJalali(start) : null,
          end ? jsDateToJalali(end) : null,
        ] as InternalSelectedValue<M>;
      }
      if (mode === "multiple") {
        return (defaultValue as Date[]).map((d) =>
          jsDateToJalali(d),
        ) as InternalSelectedValue<M>;
      }
    }
    return null as InternalSelectedValue<M>;
  }, [defaultValue, mode]);

  const internalMinDate = useMemo(
    () => (minDate ? jsDateToJalali(minDate) : undefined),
    [minDate],
  );
  const internalMaxDate = useMemo(
    () => (maxDate ? jsDateToJalali(maxDate) : undefined),
    [maxDate],
  );

  // ۲. مدیریت زمان
  const [internalTime, setInternalTime] = useState<JalaliTime>(
    () => defaultTimeValue ?? getCurrentTime(),
  );
  const activeTime =
    timeValue !== undefined ? (timeValue ?? getCurrentTime()) : internalTime;

  const handleTimeChange = useCallback(
    (newTime: JalaliTime) => {
      if (timeValue === undefined) setInternalTime(newTime);
      onTimeChange?.(newTime);
    },
    [timeValue, onTimeChange],
  );

  // ۳. تبدیل خروجی JalaliDate به Date استاندارد JS
  const convertJalaliToDateOutput = useCallback(
    (jVal: InternalSelectedValue<M>): SelectedDateValue<M> => {
      if (!jVal) return null as SelectedDateValue<M>;

      const h = enableTime ? activeTime.hour : 0;
      const m = enableTime ? activeTime.minute : 0;
      const s = enableTime && showSeconds ? (activeTime.second ?? 0) : 0;

      if (mode === "single" && !Array.isArray(jVal)) {
        return jalaliToJsDate(
          jVal as JalaliDate,
          h,
          m,
          s,
        ) as SelectedDateValue<M>;
      }

      if (mode === "range" && Array.isArray(jVal)) {
        const [start, end] = jVal as JalaliDateRange;
        return [
          start ? jalaliToJsDate(start, 0, 0, 0) : null,
          end ? jalaliToJsDate(end, 23, 59, 59) : null,
        ] as SelectedDateValue<M>;
      }

      if (mode === "multiple" && Array.isArray(jVal)) {
        return (jVal as JalaliDate[]).map((d) =>
          jalaliToJsDate(d, h, m, s),
        ) as SelectedDateValue<M>;
      }

      return null as SelectedDateValue<M>;
    },
    [mode, enableTime, activeTime, showSeconds],
  );

  // ۴. اتصال به هوک هسته
  const {
    selected,
    viewYear,
    viewMonth,
    grid,
    goToPrevMonth,
    goToNextMonth,
    setView,
    goToToday,
    selectDate,
    setHoverDate,
    hoverDate,
    clear,
  } = useJalaliDatePicker({
    mode,
    value: internalJalaliValue,
    defaultValue: internalDefaultJalaliValue,
    minDate: internalMinDate,
    maxDate: internalMaxDate,
    firstDayOfWeek,
    isDateDisabled: isDateDisabled
      ? (jDate: JalaliDate) => isDateDisabled(jalaliToJsDate(jDate))
      : undefined,
    onChange: (val) => {
      onChange?.(convertJalaliToDateOutput(val));
    },
  });

  const singleSelectedDate =
    mode === "single" ? (selected as JalaliDate | null) : null;

  const handleDateSelect = (d: JalaliDate) => {
    selectDate(d);
    if (variant === "popover" && mode === "single" && !enableTime) {
      setIsOpen(false);
    }
  };

  // کیبورد
  const { handleKeyDown, getCellTabIndex, setFocusedDate } =
    useCalendarKeyboard({
      viewYear,
      viewMonth,
      selectedDate: singleSelectedDate,
      onSelectDate: handleDateSelect,
      onViewChange: setView,
      isRtl: true,
    });

  // بستن مدال با Esc
  useEffect(() => {
    if (!isModal || !isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isModal, isOpen]);

  // محاسبات تقویم دو ماهه
  const nextMonthState = useMemo<{
    year: number;
    month: JalaliMonthIndex;
  }>(() => {
    if (viewMonth === 11) return { year: viewYear + 1, month: 0 };
    return { year: viewYear, month: (viewMonth + 1) as JalaliMonthIndex };
  }, [viewYear, viewMonth]);

  const secondGrid = useMemo<JalaliCalendarCell[]>(() => {
    if (numberOfMonths !== 2) return [];

    const rawGrid = generateJalaliCalendarGrid({
      year: nextMonthState.year,
      month: nextMonthState.month,
      firstDayOfWeek,
      minDate: internalMinDate,
      maxDate: internalMaxDate,
    });

    if (mode !== "range") return rawGrid;

    const [start, end] = (selected as JalaliDateRange) || [null, null];
    const effectiveEnd = end ?? (start && hoverDate ? hoverDate : null);

    return rawGrid.map((cell) => {
      const isStart = start ? isSameJalaliDay(cell.jalali, start) : false;
      const isEnd = effectiveEnd
        ? isSameJalaliDay(cell.jalali, effectiveEnd)
        : false;
      let inRange = false;
      if (start && effectiveEnd) {
        inRange = isJalaliDateBetween(cell.jalali, start, effectiveEnd);
      }
      return {
        ...cell,
        isSelected: isStart || isEnd,
        isInRange: inRange,
        isRangeStart: isStart,
        isRangeEnd: isEnd,
      };
    });
  }, [
    numberOfMonths,
    nextMonthState,
    firstDayOfWeek,
    internalMinDate,
    internalMaxDate,
    mode,
    selected,
    hoverDate,
  ]);

  // متن نمایشی اینپوت
  const formattedInputValue = useMemo(() => {
    if (!selected) return "";
    if (mode === "single") {
      const datePart = formatJalaliDate(selected as JalaliDate, "YYYY/MM/DD", {
        digitType,
      });
      if (enableTime && activeTime) {
        const timePart = formatTimeString(activeTime, showSeconds, digitType);
        return `${datePart} ${timePart}`;
      }
      return datePart;
    }
    if (mode === "range") {
      const [start, end] = (selected as JalaliDateRange) || [null, null];
      if (start && end) {
        return `${formatJalaliDate(start, "YYYY/MM/DD", { digitType })} - ${formatJalaliDate(end, "YYYY/MM/DD", { digitType })}`;
      }
      if (start) return formatJalaliDate(start, "YYYY/MM/DD", { digitType });
    }
    return "";
  }, [selected, mode, digitType, enableTime, activeTime, showSeconds]);

  const renderCalendarPane = (
    y: number,
    m: JalaliMonthIndex,
    paneGrid: JalaliCalendarCell[],
    showPrevArrow = true,
    showNextArrow = true,
  ) => (
    <div style={{ minWidth: "270px" }}>
      <Header
        year={y}
        monthName={PERSIAN_MONTH_NAMES[m]}
        onPrevMonth={showPrevArrow ? goToPrevMonth : () => {}}
        onNextMonth={showNextArrow ? goToNextMonth : () => {}}
        onTitleClick={() => setShowMonthYearPicker((prev) => !prev)}
        isPickerOpen={showMonthYearPicker}
      />

      <Weekdays
        firstDayOfWeek={firstDayOfWeek}
        classNames={classNames}
        styles={styles}
      />

      <div
        role="grid"
        aria-label={`${PERSIAN_MONTH_NAMES[m]} ${toPersianDigits(y)}`}
        className={classNames?.grid}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, var(--pdp-cell-size, 36px))",
          gap: "4px",
          ...styles?.grid,
        }}
      >
        {paneGrid.map((cell, index) => {
          const holidayInfo = showHolidays
            ? getOfficialHoliday(cell.jalali, customHolidays)
            : null;
          const dayEvents = getEventsForDate(cell.jalali, events);

          return (
            <DayCell
              key={index}
              cell={cell}
              digitType={digitType}
              isHoliday={Boolean(holidayInfo)}
              holidayTitle={holidayInfo?.title}
              events={dayEvents}
              classNames={classNames}
              styles={styles}
              tabIndex={getCellTabIndex(cell.jalali)}
              onSelect={handleDateSelect}
              onHover={setHoverDate}
              onFocus={setFocusedDate}
            />
          );
        })}
      </div>
    </div>
  );

  const calendarContent = (
    <div
      role={isModal ? "dialog" : "region"}
      aria-modal={isModal ? true : undefined}
      aria-label="تقویم شمسی"
      onKeyDown={handleKeyDown}
      onClick={(e) => isModal && e.stopPropagation()}
      className={classNames?.calendar}
      style={{
        position:
          variant === "popover" ? "absolute" : isModal ? "relative" : "static",
        top: variant === "popover" ? "calc(100% + 4px)" : undefined,
        right: variant === "popover" ? 0 : undefined,
        zIndex: isModal ? 1001 : 50,
        padding: "16px",
        backgroundColor: "var(--pdp-surface-bg, #ffffff)",
        borderRadius: "var(--pdp-border-radius, 12px)",
        border: "1px solid var(--pdp-surface-border, #e2e8f0)",
        boxShadow: isModal
          ? "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)"
          : "var(--pdp-shadow)",
        width: "fit-content",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        ...styles?.calendar,
      }}
    >
      {isModal && (
        <button
          type="button"
          aria-label="بستن"
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "var(--pdp-text-muted, #94a3b8)",
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          ✕
        </button>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {showMonthYearPicker ? (
          <MonthYearPicker
            currentYear={viewYear}
            currentMonth={viewMonth}
            onSelectMonth={(m) => {
              setView(viewYear, m as JalaliMonthIndex);
              setShowMonthYearPicker(false);
            }}
            onSelectYear={(y) => setView(y, viewMonth)}
          />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              {renderCalendarPane(
                viewYear,
                viewMonth,
                grid,
                true,
                numberOfMonths === 1,
              )}

              {numberOfMonths === 2 && (
                <>
                  <div
                    style={{
                      width: "1px",
                      backgroundColor: "var(--pdp-surface-border, #e2e8f0)",
                      alignSelf: "stretch",
                    }}
                  />
                  {renderCalendarPane(
                    nextMonthState.year,
                    nextMonthState.month,
                    secondGrid,
                    false,
                    true,
                  )}
                </>
              )}
            </div>

            {enableTime && (
              <TimePicker
                value={activeTime}
                onChange={handleTimeChange}
                minuteStep={minuteStep}
                hourStep={hourStep}
                showSeconds={showSeconds}
                digitType={digitType}
                classNames={classNames}
                styles={styles}
              />
            )}

            {showFooter && (
              <CalendarFooter
                mode={mode}
                digitType={digitType}
                showStatusText={showStatusText}
                showActions={showActions}
                selectedDate={
                  mode === "single" ? (selected as JalaliDate | null) : null
                }
                selectedRange={
                  mode === "range" ? (selected as JalaliDateRange) : undefined
                }
                selectedDates={
                  mode === "multiple" ? (selected as JalaliDate[]) : undefined
                }
                selectedTime={enableTime ? activeTime : undefined}
                onToday={goToToday}
                onClear={clear}
                onConfirm={() => {
                  if (variant !== "inline") setIsOpen(false);
                  onConfirm?.();
                }}
                classNames={classNames}
                styles={styles}
              />
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={className ?? classNames?.root}
      style={{
        position: "relative",
        display: "inline-block",
        ...style,
        ...styles?.root,
      }}
    >
      {variant !== "inline" &&
        (useMaskedInput && mode === "single" && variant === "popover" ? (
          <MaskedDateInput
            value={singleSelectedDate}
            digitType={digitType}
            placeholder={placeholder}
            onChange={(d) => {
              if (d) {
                selectDate(d);
                setView(d.year, d.month);
              } else {
                clear();
              }
            }}
            onClick={() => setIsOpen(true)}
            className={classNames?.input}
            style={styles?.input}
          />
        ) : (
          <input
            type="text"
            readOnly
            placeholder={placeholder}
            value={formattedInputValue}
            onClick={() => setIsOpen(true)}
            className={classNames?.input}
            style={{
              padding: "8px 12px",
              borderRadius: "var(--pdp-border-radius, 8px)",
              border: "1px solid var(--pdp-surface-border, #e2e8f0)",
              backgroundColor: "var(--pdp-surface-bg, #ffffff)",
              color: "var(--pdp-text-primary, #0f172a)",
              cursor: "pointer",
              textAlign: "right",
              direction: "rtl",
              fontSize: "14px",
              minWidth: enableTime
                ? "200px"
                : numberOfMonths === 2
                  ? "240px"
                  : "150px",
              ...styles?.input,
            }}
          />
        ))}

      {isOpen &&
        (isModal ? (
          <div
            role="presentation"
            onClick={() => setIsOpen(false)}
            className={classNames?.modalBackdrop}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              direction: "rtl",
              ...styles?.modalBackdrop,
            }}
          >
            {calendarContent}
          </div>
        ) : (
          calendarContent
        ))}
    </div>
  );
}
