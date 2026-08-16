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
  UseJalaliDatePickerOptions,
  SelectionMode,
  JalaliDateRange,
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
import { PresetsBar } from "../plugins/presets/PresetsBar";
import type { DatePickerPreset, PresetValue } from "../plugins/presets/types";
import { MaskedDateInput } from "./masked-input/MaskedDateInput";
import { generateJalaliCalendarGrid } from "../core/calendar-grid";
import { isJalaliDateBetween } from "../core/jalali-helpers";
import { isSameJalaliDay } from "../core/jalali-math";
import type { CalendarEvent } from "../events/types";
import { getEventsForDate } from "../events/event-utils";
import { getOfficialHoliday } from "../holidays";
import type { CustomHolidayRule } from "../holidays/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";

export interface JalaliDatePickerProps<
  M extends SelectionMode = "single",
> extends UseJalaliDatePickerOptions<M> {
  /** Output digit presentation ('persian' or 'latin') */
  digitType?: "persian" | "latin";
  /** Layout presentation style: 'inline', 'popover' dropdown, or 'modal' dialog */
  variant?: "inline" | "popover" | "modal";
  /** Placeholder text for popover and modal input trigger */
  placeholder?: string;

  // --- Granular Style & Class Customization ---
  /** Root wrapper CSS class */
  className?: string;
  /** Root wrapper inline styles */
  style?: React.CSSProperties;
  /** Slot-based CSS class mapping */
  classNames?: DatePickerClassNames;
  /** Slot-based inline styles mapping */
  styles?: DatePickerStyles;

  // --- Built-in Footer & Status Props ---
  /** Whether to render the built-in footer status & actions (default: false) */
  showFooter?: boolean;
  /** Toggle status text inside footer (default: true) */
  showStatusText?: boolean;
  /** Toggle action buttons (Today, Clear, Confirm) inside footer (default: true) */
  showActions?: boolean;
  /** Callback fired when user clicks Confirm in footer */
  onConfirm?: () => void;

  // --- Time Picker Integration Props ---
  /** Enable embedded time picker below calendar grid */
  enableTime?: boolean;
  /** Controlled time value */
  timeValue?: JalaliTime | null;
  /** Default uncontrolled time value */
  defaultTimeValue?: JalaliTime;
  /** Callback fired when selected time changes */
  onTimeChange?: (time: JalaliTime) => void;
  /** Step increment for minutes (default: 1) */
  minuteStep?: number;
  /** Step increment for hours (default: 1) */
  hourStep?: number;
  /** Show seconds segment in time picker */
  showSeconds?: boolean;

  // --- Shortcuts & Presets Props ---
  /** Enable shortcut presets bar */
  enablePresets?: boolean;
  /** Custom presets array */
  presets?: DatePickerPreset[];
  /** Orientation of presets bar ('vertical' or 'horizontal') */
  presetsOrientation?: "vertical" | "horizontal";

  // --- Dual Calendar View Props ---
  /** Number of months shown side-by-side (1 or 2, default: 1) */
  numberOfMonths?: 1 | 2;

  // --- Masked Input Integration ---
  /** Use live-masked typing input when variant is 'popover' */
  useMaskedInput?: boolean;

  // --- Events & Badges Props ---
  /** Array of registered calendar events with badges and tooltips */
  events?: CalendarEvent[];

  // --- Holidays Props ---
  /** Highlight Iranian national solar holidays and Fridays in red (default: false) */
  showHolidays?: boolean;
  /** Custom additional holidays array */
  customHolidays?: CustomHolidayRule[];
}

export function JalaliDatePicker<M extends SelectionMode = "single">({
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
  defaultValue,
  // Time Picker
  enableTime = false,
  timeValue,
  defaultTimeValue,
  onTimeChange,
  minuteStep = 1,
  hourStep = 1,
  showSeconds = false,
  // Presets
  enablePresets = false,
  presets,
  presetsOrientation = "vertical",
  // Multi Month
  numberOfMonths = 1,
  // Masked Input
  useMaskedInput = false,
  // Events
  events,
  // Holidays
  showHolidays = false,
  customHolidays,

  ...hookOptions
}: JalaliDatePickerProps<M>) {
  const [isOpen, setIsOpen] = useState(variant === "inline");
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isModal = variant === "modal";

  // 1. Time State Management
  const [internalTime, setInternalTime] = useState<JalaliTime>(
    () => defaultTimeValue ?? getCurrentTime(),
  );
  const activeTime =
    timeValue !== undefined ? (timeValue ?? getCurrentTime()) : internalTime;

  const handleTimeChange = useCallback(
    (newTime: JalaliTime) => {
      if (timeValue === undefined) {
        setInternalTime(newTime);
      }
      onTimeChange?.(newTime);
    },
    [timeValue, onTimeChange],
  );

  // 2. Date State Management via Hook
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
    defaultValue,
    ...hookOptions,
  });

  const singleSelectedDate =
    hookOptions.mode === "single" ? (selected as JalaliDate | null) : null;

  const handleDateSelect = (d: JalaliDate) => {
    selectDate(d);
    if (variant === "popover" && hookOptions.mode === "single" && !enableTime) {
      setIsOpen(false);
    }
  };

  // Keyboard navigation
  const { handleKeyDown, getCellTabIndex, setFocusedDate } =
    useCalendarKeyboard({
      viewYear,
      viewMonth,
      selectedDate: singleSelectedDate,
      onSelectDate: handleDateSelect,
      onViewChange: setView,
      isRtl: true,
    });

  // 3. Modal ESC & Body Scroll Lock
  useEffect(() => {
    if (!isModal || !isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isModal, isOpen]);

  // 4. Preset Selection Handler
  const handlePresetSelect = (presetVal: PresetValue) => {
    if (hookOptions.mode === "single" && !Array.isArray(presetVal)) {
      selectDate(presetVal as JalaliDate);
      setView(presetVal.year, presetVal.month);
      if (variant === "popover" && !enableTime) setIsOpen(false);
    } else if (hookOptions.mode === "range" && Array.isArray(presetVal)) {
      const [start, end] = presetVal as JalaliDateRange;
      if (start && end) {
        selectDate(start);
        selectDate(end);
        setView(start.year, start.month);
      }
    }
  };

  // 5. Multi-Month calculations
  const nextMonthState = useMemo<{
    year: number;
    month: JalaliMonthIndex;
  }>(() => {
    if (viewMonth === 11) {
      return { year: viewYear + 1, month: 0 };
    }
    return { year: viewYear, month: (viewMonth + 1) as JalaliMonthIndex };
  }, [viewYear, viewMonth]);

  const secondGrid = useMemo<JalaliCalendarCell[]>(() => {
    if (numberOfMonths !== 2) return [];

    const rawGrid = generateJalaliCalendarGrid({
      year: nextMonthState.year,
      month: nextMonthState.month,
      firstDayOfWeek: hookOptions.firstDayOfWeek ?? 0,
      minDate: hookOptions.minDate,
      maxDate: hookOptions.maxDate,
      isDateDisabled: hookOptions.isDateDisabled,
    });

    if (hookOptions.mode !== "range") return rawGrid;

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
  }, [numberOfMonths, nextMonthState, hookOptions, selected, hoverDate]);

  // 6. Input Value String Formatter
  const formattedInputValue = useMemo(() => {
    if (!selected) return "";
    if (hookOptions.mode === "single") {
      const datePart = formatJalaliDate(selected as JalaliDate, "YYYY/MM/DD", {
        digitType,
      });
      if (enableTime && activeTime) {
        const timePart = formatTimeString(activeTime, showSeconds, digitType);
        return `${datePart} ${timePart}`;
      }
      return datePart;
    }
    if (hookOptions.mode === "range") {
      const [start, end] = (selected as JalaliDateRange) || [null, null];
      if (start && end) {
        return `${formatJalaliDate(start, "YYYY/MM/DD", { digitType })} - ${formatJalaliDate(end, "YYYY/MM/DD", { digitType })}`;
      }
      if (start) {
        return formatJalaliDate(start, "YYYY/MM/DD", { digitType });
      }
    }
    return "";
  }, [
    selected,
    hookOptions.mode,
    digitType,
    enableTime,
    activeTime,
    showSeconds,
  ]);

  // Calendar Pane Renderer
  const renderCalendarPane = (
    y: number,
    m: JalaliMonthIndex,
    paneGrid: JalaliCalendarCell[],
    showPrevArrow: boolean = true,
    showNextArrow: boolean = true,
  ) => (
    <div style={{ minWidth: "270px" }}>
      <Header
        year={y}
        month={m}
        onPrevMonth={showPrevArrow ? goToPrevMonth : () => {}}
        onNextMonth={showNextArrow ? goToNextMonth : () => {}}
        onTogglePicker={() =>
          numberOfMonths === 1 && setShowMonthYearPicker(true)
        }
        onGoToToday={goToToday}
        classNames={classNames}
        styles={styles}
      />

      <Weekdays
        firstDayOfWeek={hookOptions.firstDayOfWeek}
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

  // Core Calendar Box
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
        flexDirection: presetsOrientation === "horizontal" ? "column" : "row",
        gap: "12px",
        ...styles?.calendar,
      }}
    >
      {/* Modal Close Button */}
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

      {/* Shortcuts Presets Bar */}
      {enablePresets && (
        <PresetsBar
          presets={presets}
          orientation={presetsOrientation}
          digitType={digitType}
          selectedValue={selected as PresetValue}
          onSelectPreset={handlePresetSelect}
          classNames={classNames}
          styles={styles}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {showMonthYearPicker ? (
          <MonthYearPicker
            currentYear={viewYear}
            currentMonth={viewMonth}
            onSelectMonth={(m) => setView(viewYear, m)}
            onSelectYear={(y) => setView(y, viewMonth)}
            onClose={() => setShowMonthYearPicker(false)}
          />
        ) : (
          <>
            {/* Multi-Month Calendar Panes */}
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

            {/* Embedded Time Picker */}
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

            {/* Built-in Status & Actions Footer */}
            {showFooter && (
              <CalendarFooter
                mode={hookOptions.mode}
                digitType={digitType}
                showStatusText={showStatusText}
                showActions={showActions}
                selectedDate={
                  hookOptions.mode === "single"
                    ? (selected as JalaliDate | null)
                    : null
                }
                selectedRange={
                  hookOptions.mode === "range"
                    ? (selected as JalaliDateRange)
                    : undefined
                }
                selectedDates={
                  hookOptions.mode === "multiple"
                    ? (selected as JalaliDate[])
                    : undefined
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
      {/* Popover / Modal Trigger Input */}
      {variant !== "inline" &&
        (useMaskedInput &&
        hookOptions.mode === "single" &&
        variant === "popover" ? (
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

      {/* Render Modal Overlay with Backdrop vs Standard Container */}
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
