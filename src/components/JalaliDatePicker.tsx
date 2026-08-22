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
import { mergeClassNames } from "../theme/style-utils";
import { useTheme } from "../theme/ThemeProvider";

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
  /** تاریخ اولیه برای ماه قابل مشاهده */
  initialViewDate?: Date | JalaliDate;
  /** جهت چیدمان و رفتار کلیدهای افقی */
  direction?: "rtl" | "ltr";

  // استایل‌دهی
  className?: string;
  style?: React.CSSProperties;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;

  // فوتر
  showFooter?: boolean;
  showStatusText?: boolean;
  showActions?: boolean;
  onConfirm?: (value: SelectedDateValue<M>) => void;

  // زمان
  enableTime?: boolean;
  timeValue?: JalaliTime | null;
  defaultTimeValue?: JalaliTime;
  onTimeChange?: (time: JalaliTime) => void;
  minuteStep?: number;
  hourStep?: number;
  secondStep?: number;
  showSeconds?: boolean;

  // تقویم دو ماهه و اینپوت ماسک‌دار
  numberOfMonths?: 1 | 2;
  useMaskedInput?: boolean;

  // رویدادها و تعطیلات
  events?: CalendarEvent[];
  showHolidays?: boolean;
  customHolidays?: CustomHolidayRule[];

  /** بستن popover با کلیک بیرون */
  closeOnOutsideClick?: boolean;
  /** بستن popover/modal با Escape */
  closeOnEscape?: boolean;
  /** اعلان تغییر وضعیت باز/بسته */
  onOpenChange?: (isOpen: boolean) => void;
}

function getFirstDateFromValue<M extends SelectionMode>(
  selectedValue: SelectedDateValue<M> | undefined,
): Date | undefined {
  if (
    selectedValue instanceof Date &&
    !Number.isNaN(selectedValue.getTime())
  ) {
    return selectedValue;
  }
  if (!Array.isArray(selectedValue)) return undefined;
  for (const candidate of selectedValue as readonly unknown[]) {
    if (candidate instanceof Date && !Number.isNaN(candidate.getTime())) {
      return candidate;
    }
  }
  return undefined;
}

function getTimeFromDate(date: Date | undefined): JalaliTime | undefined {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
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
  initialViewDate,
  direction = "rtl",
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
  secondStep = 1,
  showSeconds = false,
  numberOfMonths = 1,
  useMaskedInput = false,
  events,
  showHolidays = false,
  customHolidays,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  onOpenChange,
}: JalaliDatePickerProps<M>) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(variant === "inline");
  const isOpenRef = useRef(variant === "inline");
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  const isModal = variant === "modal";
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);
  const setOpen = useCallback((nextOpen: boolean) => {
    if (isOpenRef.current === nextOpen) return;
    isOpenRef.current = nextOpen;
    setIsOpen(nextOpen);
    onOpenChangeRef.current?.(nextOpen);
  }, []);

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
  const internalInitialViewDate = useMemo(() => {
    if (initialViewDate) {
      return initialViewDate instanceof Date
        ? jsDateToJalali(initialViewDate)
        : initialViewDate;
    }
    const selectedDate =
      getFirstDateFromValue(value) ?? getFirstDateFromValue(defaultValue);
    return selectedDate ? jsDateToJalali(selectedDate) : undefined;
  }, [defaultValue, initialViewDate, value]);

  const controlledDateTime = useMemo(
    () => getTimeFromDate(getFirstDateFromValue(value)),
    [value],
  );

  // ۲. مدیریت زمان
  const [internalTime, setInternalTime] = useState<JalaliTime>(
    () =>
      defaultTimeValue ??
      getTimeFromDate(getFirstDateFromValue(defaultValue)) ??
      getCurrentTime(),
  );
  const activeTime =
    timeValue === null
      ? { hour: 0, minute: 0, second: 0 }
      : (timeValue ?? controlledDateTime ?? internalTime);

  const internalIsDateDisabled = useCallback(
    (jDate: JalaliDate) =>
      isDateDisabled ? isDateDisabled(jalaliToJsDate(jDate)) : false,
    [isDateDisabled],
  );

  // ۳. تبدیل خروجی JalaliDate به Date استاندارد JS
  const convertJalaliToDateOutput = useCallback(
    (
      jVal: InternalSelectedValue<M>,
      timeOverride: JalaliTime = activeTime,
    ): SelectedDateValue<M> => {
      if (!jVal) return null as SelectedDateValue<M>;

      const h = enableTime ? timeOverride.hour : 0;
      const m = enableTime ? timeOverride.minute : 0;
      const s = enableTime && showSeconds ? (timeOverride.second ?? 0) : 0;

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
          start ? jalaliToJsDate(start, h, m, s) : null,
          end
            ? jalaliToJsDate(
                end,
                enableTime ? h : 23,
                enableTime ? m : 59,
                enableTime ? s : 59,
              )
            : null,
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
    initialViewDate: internalInitialViewDate,
    minDate: internalMinDate,
    maxDate: internalMaxDate,
    firstDayOfWeek,
    isDateDisabled: isDateDisabled ? internalIsDateDisabled : undefined,
    onChange: (val) => {
      onChange?.(convertJalaliToDateOutput(val));
    },
  });

  const handleTimeChange = useCallback(
    (newTime: JalaliTime) => {
      if (timeValue === undefined) setInternalTime(newTime);
      onTimeChange?.(newTime);
      const hasSelectedDate = Array.isArray(selected)
        ? selected.some(Boolean)
        : Boolean(selected);
      if (hasSelectedDate) {
        onChange?.(
          convertJalaliToDateOutput(
            selected as InternalSelectedValue<M>,
            newTime,
          ),
        );
      }
    }, [
      timeValue,
      onTimeChange,
      selected,
      onChange,
      convertJalaliToDateOutput,
    ],
  );

  const singleSelectedDate =
    mode === "single" ? (selected as JalaliDate | null) : null;

  const handleDateSelect = (d: JalaliDate) => {
    selectDate(d);
    if (variant === "popover" && mode === "single" && !enableTime) {
      setOpen(false);
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
      isRtl: direction === "rtl",
    });

  // همگام‌سازی variant و مدیریت بستن با کلیک بیرون / Escape
  useEffect(() => {
    setOpen(variant === "inline");
  }, [variant, setOpen]);

  useEffect(() => {
    if (!isOpen || variant === "inline") return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!closeOnOutsideClick || isModal) return;
      const target = event.target;
      if (target instanceof Node && !containerRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (!closeOnEscape || event.key !== "Escape") return;
      setOpen(false);
      containerRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [
    closeOnEscape,
    closeOnOutsideClick,
    isModal,
    isOpen,
    setOpen,
    variant,
  ]);

  // قفل اسکرول پس‌زمینه در مدال
  useEffect(() => {
    if (!isModal || !isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
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
      isDateDisabled: isDateDisabled ? internalIsDateDisabled : undefined,
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
    internalIsDateDisabled,
    isDateDisabled,
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
      const timePart = enableTime
        ? ` ${formatTimeString(activeTime, showSeconds, digitType)}`
        : "";
      if (start && end) {
        return `${formatJalaliDate(start, "YYYY/MM/DD", { digitType })}${timePart} - ${formatJalaliDate(end, "YYYY/MM/DD", { digitType })}${timePart}`;
      }
      if (start) {
        return `${formatJalaliDate(start, "YYYY/MM/DD", { digitType })}${timePart}`;
      }
    }
    if (mode === "multiple") {
      const count = (selected as JalaliDate[]).length;
      if (count > 0) {
        const displayCount =
          digitType === "persian" ? toPersianDigits(count) : String(count);
        return `${displayCount} تاریخ انتخاب شده`;
      }
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
    <div
      dir={direction}
      className={classNames?.calendarPane}
      style={{
        width: "var(--pdp-calendar-pane-width, 276px)",
        minWidth: "var(--pdp-calendar-pane-width, 276px)",
        ...styles?.calendarPane,
      }}
    >
      <Header
        year={y}
        monthName={PERSIAN_MONTH_NAMES[m]}
        onPrevMonth={showPrevArrow ? goToPrevMonth : () => {}}
        onNextMonth={showNextArrow ? goToNextMonth : () => {}}
        onTitleClick={() => setShowMonthYearPicker((prev) => !prev)}
        isPickerOpen={showMonthYearPicker}
        digitType={digitType}
        direction={direction}
        classNames={classNames}
        styles={styles}
      />

      <Weekdays
        firstDayOfWeek={firstDayOfWeek}
        direction={direction}
        classNames={classNames}
        styles={styles}
      />

      <div
        role="grid"
        aria-label={`${PERSIAN_MONTH_NAMES[m]} ${
          digitType === "persian" ? toPersianDigits(y) : y
        }`}
        dir={direction}
        className={classNames?.grid}
        style={{
          display: "grid",
          width: "var(--pdp-calendar-pane-width, 276px)",
          gridTemplateColumns: "repeat(7, var(--pdp-cell-size, 36px))",
          gap: "var(--pdp-cell-gap, 4px)",
          ...styles?.grid,
        }}
      >
        {paneGrid.map((cell) => {
          const holidayInfo = showHolidays
            ? getOfficialHoliday(cell.jalali, customHolidays)
            : null;
          const dayEvents = getEventsForDate(cell.jalali, events);

          return (
            <DayCell
              key={`${cell.jalali.year}-${cell.jalali.month}-${cell.jalali.day}`}
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
      role={variant === "inline" ? "region" : "dialog"}
      aria-modal={isModal ? true : undefined}
      aria-label="تقویم شمسی"
      dir={direction}
      onKeyDown={handleKeyDown}
      onClick={(e) => isModal && e.stopPropagation()}
      className={classNames?.calendar}
      style={{
        position:
          variant === "popover" ? "absolute" : isModal ? "relative" : "static",
        top: variant === "popover" ? "calc(100% + 4px)" : undefined,
        right: variant === "popover" && direction === "rtl" ? 0 : undefined,
        left: variant === "popover" && direction === "ltr" ? 0 : undefined,
        zIndex: isModal ? 1001 : 50,
        padding: "16px",
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        borderRadius: theme.radii.lg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: isModal
          ? "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)"
          : theme.shadows.lg,
        width: "fit-content",
        maxWidth: "calc(100vw - 16px)",
        boxSizing: "border-box",
        overflowX: "auto",
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
          onClick={() => setOpen(false)}
          className={classNames?.closeButton}
          style={{
            position: "absolute",
            top: "10px",
            insetInlineEnd: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: theme.colors.textSecondary,
            lineHeight: 1,
            zIndex: 10,
            ...styles?.closeButton,
          }}
        >
          ✕
        </button>
      )}

      <div
        className={classNames?.calendarBody}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          ...styles?.calendarBody,
        }}
      >
        {showMonthYearPicker ? (
          <MonthYearPicker
            currentYear={viewYear}
            currentMonth={viewMonth}
            onSelectMonth={(m) => {
              setView(viewYear, m as JalaliMonthIndex);
              setShowMonthYearPicker(false);
            }}
            onSelectYear={(y) => setView(y, viewMonth)}
            digitType={digitType}
            direction={direction}
            classNames={classNames}
            styles={styles}
          />
        ) : (
          <>
            <div
              dir={direction}
              className={classNames?.calendarPanes}
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                flexWrap: "wrap",
                ...styles?.calendarPanes,
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
                    className={classNames?.paneDivider}
                    style={{
                      width: "1px",
                      backgroundColor: theme.colors.border,
                      alignSelf: "stretch",
                      ...styles?.paneDivider,
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
                secondStep={secondStep}
                showSeconds={showSeconds}
                digitType={digitType}
                direction={direction}
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
                showSeconds={showSeconds}
                onToday={goToToday}
                onClear={clear}
                onConfirm={() => {
                  if (variant !== "inline") setOpen(false);
                  onConfirm?.(
                    convertJalaliToDateOutput(
                      selected as InternalSelectedValue<M>,
                    ),
                  );
                }}
                direction={direction}
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
      dir={direction}
      className={mergeClassNames(className, classNames?.root)}
      style={{
        "--pdp-cell-size": "36px",
        "--pdp-cell-gap": "4px",
        "--pdp-calendar-pane-width": "276px",
        position: "relative",
        display: "inline-block",
        color: theme.colors.textPrimary,
        fontFamily: "inherit",
        ...style,
        ...styles?.root,
      } as React.CSSProperties}
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
            onClick={() => setOpen(true)}
            direction={direction}
            minDate={internalMinDate}
            maxDate={internalMaxDate}
            isDateDisabled={
              isDateDisabled ? internalIsDateDisabled : undefined
            }
            wrapperClassName={classNames?.inputWrapper}
            wrapperStyle={styles?.inputWrapper}
            clearButtonClassName={classNames?.inputClearButton}
            clearButtonStyle={styles?.inputClearButton}
            className={classNames?.input}
            style={styles?.input}
          />
        ) : (
          <input
            type="text"
            readOnly
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            placeholder={placeholder}
            value={formattedInputValue}
            onClick={() => setOpen(true)}
            className={classNames?.input}
            style={{
              width: enableTime
                ? "230px"
                : numberOfMonths === 2
                  ? "260px"
                  : "190px",
              minHeight: "40px",
              boxSizing: "border-box",
              padding: "8px 12px",
              borderRadius: theme.radii.sm,
              border: `1px solid ${theme.colors.border}`,
              outlineColor: theme.colors.primary,
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              cursor: "pointer",
              textAlign: direction === "rtl" ? "right" : "left",
              direction,
              fontFamily: "inherit",
              fontSize: "14px",
              ...styles?.input,
            }}
          />
        ))}

      {isOpen &&
        (isModal ? (
          <div
            role="presentation"
            onClick={() => {
              if (closeOnOutsideClick) setOpen(false);
            }}
            className={classNames?.modalBackdrop}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.64)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              direction,
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
