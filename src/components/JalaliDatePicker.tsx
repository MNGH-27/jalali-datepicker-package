// src/components/JalaliDatePicker.tsx
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
  mode?: M;
  value?: SelectedDateValue<M>;
  defaultValue?: SelectedDateValue<M>;
  onChange?: (val: SelectedDateValue<M>) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  digitType?: "persian" | "latin";
  variant?: "inline" | "popover" | "modal";
  placeholder?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  style?: React.CSSProperties;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
  showFooter?: boolean;
  showStatusText?: boolean;
  allowClear?: boolean;
  enableTime?: boolean;
  timeValue?: JalaliTime | null;
  defaultTimeValue?: JalaliTime;
  onTimeChange?: (time: JalaliTime) => void;
  minuteStep?: number;
  hourStep?: number;
  showSeconds?: boolean;
  numberOfMonths?: 1 | 2;
  useMaskedInput?: boolean;
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
  variant = "popover",
  placeholder = "YYYY/MM/DD",
  digitType = "persian",
  className,
  style,
  classNames,
  styles,
  showFooter = true,
  showStatusText = true,
  allowClear = true,
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

  // استخراج مقدار اولیه ساعت و دقیقه
  const initialTime = useMemo<JalaliTime>(() => {
    if (defaultTimeValue) return defaultTimeValue;
    if (value instanceof Date) {
      return {
        hour: value.getHours(),
        minute: value.getMinutes(),
        second: value.getSeconds(),
      };
    }
    if (defaultValue instanceof Date) {
      return {
        hour: defaultValue.getHours(),
        minute: defaultValue.getMinutes(),
        second: defaultValue.getSeconds(),
      };
    }
    return getCurrentTime();
  }, [defaultTimeValue, value, defaultValue]);

  const [internalTime, setInternalTime] = useState<JalaliTime>(initialTime);
  const activeTime =
    timeValue !== undefined ? (timeValue ?? getCurrentTime()) : internalTime;

  // بستن پاپ‌اور هنگام کلیک خارج از محدوده
  useEffect(() => {
    if (variant === "inline" || !isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setShowMonthYearPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [variant, isOpen]);

  // تبدیل Date به فرمت محاسباتی تقویم جلالی
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

  // تبدیل خروجی به آبجکت Date واقعی به همراه زمان انتخابی
  const convertJalaliToDateOutput = useCallback(
    (
      jVal: InternalSelectedValue<M>,
      specificTime?: JalaliTime,
    ): SelectedDateValue<M> => {
      if (!jVal) return null as SelectedDateValue<M>;

      const t = specificTime ?? activeTime;
      const h = enableTime ? t.hour : 0;
      const m = enableTime ? t.minute : 0;
      const s = enableTime && showSeconds ? (t.second ?? 0) : 0;

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

  // تغییر زمان و انتشار Date جدید با ساعت به‌روز
  const handleTimeChange = useCallback(
    (newTime: JalaliTime) => {
      if (timeValue === undefined) setInternalTime(newTime);
      onTimeChange?.(newTime);

      if (selected && onChange) {
        onChange(convertJalaliToDateOutput(selected, newTime));
      }
    },
    [timeValue, onTimeChange, selected, onChange, convertJalaliToDateOutput],
  );

  const singleSelectedDate =
    mode === "single" ? (selected as JalaliDate | null) : null;

  const handleDateSelect = (d: JalaliDate) => {
    selectDate(d);
    if (variant === "popover" && mode === "single" && !enableTime) {
      setIsOpen(false);
    }
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clear();
  };

  const { handleKeyDown, getCellTabIndex, setFocusedDate } =
    useCalendarKeyboard({
      viewYear,
      viewMonth,
      selectedDate: singleSelectedDate,
      onSelectDate: handleDateSelect,
      onViewChange: setView,
      isRtl: true,
    });

  // پشتیبانی از کلید Escape در حالت مودال
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
      if (start)
        return `${formatJalaliDate(start, "YYYY/MM/DD", { digitType })} - ...`;
    }
    if (mode === "multiple" && Array.isArray(selected)) {
      return `${toPersianDigits((selected as JalaliDate[]).length)} تاریخ انتخاب شده`;
    }
    return "";
  }, [selected, mode, digitType, enableTime, activeTime, showSeconds]);

  const hasValue = Boolean(
    mode === "single"
      ? selected
      : mode === "range"
        ? (selected as JalaliDateRange)?.[0]
        : (selected as JalaliDate[])?.length,
  );

  const renderCalendarPane = (
    y: number,
    m: JalaliMonthIndex,
    paneGrid: JalaliCalendarCell[],
    showPrevArrow = true,
    showNextArrow = true,
  ) => (
    <div
      style={{
        width: "calc(7 * var(--pdp-cell-size, 34px) + 6 * 4px)",
        flexShrink: 0,
      }}
    >
      <Header
        year={y}
        monthName={PERSIAN_MONTH_NAMES[m]}
        onPrevMonth={showPrevArrow ? goToPrevMonth : () => {}}
        onNextMonth={showNextArrow ? goToNextMonth : () => {}}
        onTitleClick={() => setShowMonthYearPicker((prev) => !prev)}
        isPickerOpen={showMonthYearPicker}
        classNames={classNames}
        styles={styles}
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
          gridTemplateColumns: "repeat(7, var(--pdp-cell-size, 34px))",
          gap: "4px",
          justifyContent: "center",
          alignItems: "center",
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
        left: variant === "popover" ? 0 : undefined,
        zIndex: isModal ? 1001 : 1000,
        padding: "12px",
        backgroundColor: "var(--pdp-surface-bg, #ffffff)",
        borderRadius: "var(--pdp-border-radius, 12px)",
        border: "1px solid var(--pdp-surface-border, #e2e8f0)",
        boxShadow: isModal
          ? "0 20px 25px -5px rgb(0 0 0 / 0.3)"
          : "var(--pdp-shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.1))",
        width: "max-content",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        direction: "rtl",
        boxSizing: "border-box",
        ...styles?.calendar,
      }}
    >
      {showMonthYearPicker ? (
        <MonthYearPicker
          currentYear={viewYear}
          currentMonth={viewMonth}
          onSelectMonth={(m) => {
            setView(viewYear, m);
            setShowMonthYearPicker(false);
          }}
          onSelectYear={(y) => setView(y, viewMonth)}
          classNames={classNames}
          styles={styles}
        />
      ) : (
        <>
          {/* Dual Calendar: همواره کنار هم بدون Wrap شدن */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              gap: "20px",
              alignItems: "flex-start",
              justifyContent: "center",
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
                    alignSelf: "stretch",
                    backgroundColor: "var(--pdp-surface-border, #e2e8f0)",
                    margin: "0 2px",
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
              classNames={classNames}
              styles={styles}
            />
          )}
        </>
      )}
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
            style={{
              direction: "ltr",
              textAlign: "left",
              ...styles?.input,
            }}
          />
        ) : (
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              direction: "ltr",
              width: "100%",
            }}
          >
            <input
              type="text"
              readOnly
              placeholder={placeholder}
              value={formattedInputValue}
              className={classNames?.input}
              style={{
                direction: "ltr",
                textAlign: "left",
                padding: "8px 30px 8px 12px",
                borderRadius: "var(--pdp-border-radius, 8px)",
                border: "1px solid var(--pdp-surface-border, #e2e8f0)",
                backgroundColor: "var(--pdp-surface-bg, #ffffff)",
                color: "var(--pdp-text-primary, #0f172a)",
                cursor: "pointer",
                fontSize: "13.5px",
                minWidth: enableTime ? "190px" : "150px",
                width: "100%",
                boxSizing: "border-box",
                ...styles?.input,
              }}
            />

            {/* دکمه پاک کردن */}
            {allowClear && hasValue && (
              <button
                type="button"
                onClick={handleClearClick}
                aria-label="Clear value"
                style={{
                  position: "absolute",
                  right: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--pdp-text-muted, #94a3b8)",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: 1,
                  borderRadius: "50%",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--pdp-holiday-color, #e11d48)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "var(--pdp-text-muted, #94a3b8)";
                }}
              >
                ✕
              </button>
            )}
          </div>
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
