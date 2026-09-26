// demo/src/App.tsx
import React, { useState } from "react";
import {
  JalaliDatePicker,
  DatePickerThemeProvider,
  getDaysInJalaliMonth,
  jalaliToJsDate,
  type CalendarEvent,
  type CustomHolidayRule,
  type JalaliDate,
  type JalaliMonthIndex,
} from "@mngh/jalali-datepicker";

import "./App.css";

type Mode = "single" | "range" | "multiple";
type Variant = "popover" | "inline" | "modal";
type DigitType = "latin" | "persian";
type RangeLimit = { year: number; month: number; day: number };

const formatRangeLimit = ({ year, month, day }: RangeLimit) =>
  `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;

const toJalaliLimit = ({ year, month, day }: RangeLimit): JalaliDate | null => {
  if (!Number.isInteger(year) || year < 1200 || year > 1600) return null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  const monthIndex = (month - 1) as JalaliMonthIndex;
  if (
    !Number.isInteger(day) ||
    day < 1 ||
    day > getDaysInJalaliMonth(year, monthIndex)
  ) {
    return null;
  }
  return { year, month: monthIndex, day };
};

function ToggleRow({
  title,
  code,
  checked,
  onChange,
}: {
  title: string;
  code: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="jdp-toggle-row">
      <span className="jdp-toggle-copy">
        <div className="jdp-toggle-title">{title}</div>
        <div className="jdp-toggle-code">{code}</div>
      </span>
      <input
        className="jdp-switch-input"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`jdp-switch ${checked ? "on" : ""}`}
        aria-hidden="true"
      />
    </label>
  );
}

export function App() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState<Mode>("single");
  const [variant, setVariant] = useState<Variant>("popover");
  const [digitType, setDigitType] = useState<DigitType>("latin");
  const [numberOfMonths, setNumberOfMonths] = useState<1 | 2>(1);
  const [enableTime, setEnableTime] = useState(true);
  const [showSeconds, setShowSeconds] = useState(false);
  const [showHolidays, setShowHolidays] = useState(true);
  const [allowClear, setAllowClear] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [useDateLimits, setUseDateLimits] = useState(true);
  const [disableFridays, setDisableFridays] = useState(false);
  const [copied, setCopied] = useState(false);
  const [minLimit, setMinLimit] = useState<RangeLimit>({
    year: 1405,
    month: 6,
    day: 19,
  });
  const [maxLimit, setMaxLimit] = useState<RangeLimit>({
    year: 1406,
    month: 3,
    day: 30,
  });

  const [singleValue, setSingleValue] = useState<Date | null>(new Date());
  const [rangeValue, setRangeValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [multiValue, setMultiValue] = useState<Date[]>([]);

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      date: { year: 1405, month: 5, day: 10 },
      title: "Code Review Meeting",
      color: "#635bff",
    },
    {
      id: "2",
      date: { year: 1405, month: 5, day: 25 },
      title: "Project Deadline",
      color: "#e5484d",
    },
  ]);

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventYear, setNewEventYear] = useState(1405);
  const [newEventMonth, setNewEventMonth] = useState(5);
  const [newEventDay, setNewEventDay] = useState(15);
  const [newEventColor, setNewEventColor] = useState("#19a974");

  const [customHolidays, setCustomHolidays] = useState<CustomHolidayRule[]>([
    {
      date: { year: 1405, month: 5, day: 1 },
      title: "Company Anniversary (سالروز تاسیس شرکت)",
      isOff: true,
    },
  ]);

  const [newHolidayTitle, setNewHolidayTitle] = useState("");
  const [newHolidayYear, setNewHolidayYear] = useState(1405);
  const [newHolidayMonth, setNewHolidayMonth] = useState(5);
  const [newHolidayDay, setNewHolidayDay] = useState(8);

  const currentValue =
    mode === "single"
      ? singleValue
      : mode === "range"
        ? rangeValue
        : multiValue;

  const minJalaliLimit = toJalaliLimit(minLimit);
  const maxJalaliLimit = toJalaliLimit(maxLimit);
  const rawMinDate = minJalaliLimit
    ? jalaliToJsDate(minJalaliLimit)
    : undefined;
  const rawMaxDate = maxJalaliLimit
    ? jalaliToJsDate(maxJalaliLimit)
    : undefined;
  const hasValidDateRange = Boolean(
    rawMinDate && rawMaxDate && rawMinDate <= rawMaxDate,
  );
  const minDate = useDateLimits && hasValidDateRange ? rawMinDate : undefined;
  const maxDate = useDateLimits && hasValidDateRange ? rawMaxDate : undefined;

  const updateRangeLimit = (
    setter: React.Dispatch<React.SetStateAction<RangeLimit>>,
    field: keyof RangeLimit,
    value: string,
  ) => {
    setter((current) => ({ ...current, [field]: Number(value) }));
  };

  const handleDateChange = (value: any) => {
    if (mode === "single") setSingleValue(value);
    else if (mode === "range") setRangeValue(value);
    else setMultiValue(value);
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayTitle.trim()) return;

    setCustomHolidays((prev) => [
      ...prev,
      {
        title: newHolidayTitle.trim(),
        date: {
          year: Number(newHolidayYear),
          month: Number(newHolidayMonth) as CustomHolidayRule["date"]["month"],
          day: Number(newHolidayDay),
        },
        isOff: true,
      },
    ]);
    setNewHolidayTitle("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    setEvents((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: newEventTitle.trim(),
        date: {
          year: Number(newEventYear),
          month: Number(newEventMonth) as CalendarEvent["date"]["month"],
          day: Number(newEventDay),
        },
        color: newEventColor,
      },
    ]);
    setNewEventTitle("");
  };

  const isDark = themeMode === "dark";

  const valueType =
    mode === "single"
      ? "Date | null"
      : mode === "range"
        ? "[Date | null, Date | null]"
        : "Date[]";
  const initialValue =
    mode === "single" ? "null" : mode === "range" ? "[null, null]" : "[]";
  const optionalSampleProps = [
    useDateLimits &&
      hasValidDateRange &&
      `        minDate={jalaliToJsDate({ year: ${minLimit.year}, month: ${minLimit.month - 1}, day: ${minLimit.day} })}`,
    useDateLimits &&
      hasValidDateRange &&
      `        maxDate={jalaliToJsDate({ year: ${maxLimit.year}, month: ${maxLimit.month - 1}, day: ${maxLimit.day} })}`,
    disableFridays &&
      "        isDateDisabled={(date) => date.getDay() === 5}",
  ]
    .filter(Boolean)
    .join("\n");
  const sampleCode = `import { useState } from "react";
import {
  DatePickerThemeProvider,
  JalaliDatePicker,
${useDateLimits && hasValidDateRange ? "  jalaliToJsDate,\n" : ""}} from "@mngh/jalali-datepicker";

export default function Example() {
  const [value, setValue] = useState<${valueType}>(${initialValue});

  return (
    <DatePickerThemeProvider mode="${themeMode}">
      <JalaliDatePicker
        mode="${mode}"
        variant="${variant}"
        value={value}
        onChange={setValue}
        digitType="${digitType}"
        numberOfMonths={${numberOfMonths}}
        enableTime={${enableTime}}
        showSeconds={${showSeconds}}
        showHolidays={${showHolidays}}
        allowClear={${allowClear}}
        showFooter={${showFooter}}
${optionalSampleProps ? `${optionalSampleProps}\n` : ""}        placeholder="YYYY/MM/DD"
      />
    </DatePickerThemeProvider>
  );
}`;

  const handleCopySample = async () => {
    await navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <DatePickerThemeProvider mode={themeMode}>
      <div className={`jdp-demo ${isDark ? "is-dark" : ""}`}>
        <header className="jdp-topbar">
          <div className="jdp-topbar-inner">
            <div className="jdp-brand">
              <div className="jdp-logo">JD</div>
              <div className="jdp-brand-copy">
                <div className="jdp-brand-line">
                  <h1 className="jdp-title">@mngh/jalali-datepicker</h1>
                  <span className="jdp-badge">PLAYGROUND</span>
                  <span className="jdp-badge version">v1.2.3</span>
                </div>
                <div className="jdp-subtitle">
                  Interactive configuration and live component preview
                </div>
              </div>
            </div>

            <button
              type="button"
              className="jdp-theme-button"
              onClick={() => setThemeMode(isDark ? "light" : "dark")}
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            >
              <span>{isDark ? "☀" : "☾"}</span>
              <span className="jdp-theme-text">
                {isDark ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </header>

        <main className="jdp-shell">
          <aside className="jdp-sidebar">
            <section className="jdp-card jdp-card-pad">
              <div className="jdp-card-head">
                <div>
                  <h2 className="jdp-card-title">Configuration</h2>
                  <p className="jdp-card-desc">
                    Change props and watch the component update instantly.
                  </p>
                </div>
              </div>

              <div className="jdp-field-group">
                <div className="jdp-section-label">Selection mode</div>
                <div className="jdp-segmented three">
                  {(["single", "range", "multiple"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`jdp-segment ${mode === item ? "active" : ""}`}
                      onClick={() => setMode(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="jdp-field-group">
                <div className="jdp-section-label">Display variant</div>
                <div className="jdp-segmented three">
                  {(["popover", "inline", "modal"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`jdp-segment ${variant === item ? "active" : ""}`}
                      onClick={() => setVariant(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="jdp-field-group">
                <div className="jdp-section-label">Calendar</div>
                <div className="jdp-select-grid">
                  <label>
                    <span className="jdp-label">Digits</span>
                    <select
                      className="jdp-select"
                      value={digitType}
                      onChange={(e) =>
                        setDigitType(e.target.value as DigitType)
                      }
                    >
                      <option value="latin">Latin 0–9</option>
                      <option value="persian">Persian ۰–۹</option>
                    </select>
                  </label>

                  <label>
                    <span className="jdp-label">Months</span>
                    <select
                      className="jdp-select"
                      value={numberOfMonths}
                      onChange={(e) =>
                        setNumberOfMonths(Number(e.target.value) as 1 | 2)
                      }
                    >
                      <option value={1}>1 month</option>
                      <option value={2}>2 months</option>
                    </select>
                  </label>
                </div>
                <div className="jdp-note">
                  Two-month view now stacks automatically on small screens.
                </div>
              </div>

              <div className="jdp-divider" />

              <div className="jdp-section-label">Features</div>
              <div className="jdp-toggles">
                <ToggleRow
                  title="Time picker"
                  code="enableTime"
                  checked={enableTime}
                  onChange={setEnableTime}
                />
                {enableTime && (
                  <ToggleRow
                    title="Show seconds"
                    code="showSeconds"
                    checked={showSeconds}
                    onChange={setShowSeconds}
                  />
                )}
                <ToggleRow
                  title="Holidays & Fridays"
                  code="showHolidays"
                  checked={showHolidays}
                  onChange={setShowHolidays}
                />
                <ToggleRow
                  title="Clear action"
                  code="allowClear"
                  checked={allowClear}
                  onChange={setAllowClear}
                />
                <ToggleRow
                  title="Footer"
                  code="showFooter"
                  checked={showFooter}
                  onChange={setShowFooter}
                />
                <ToggleRow
                  title="Date limits"
                  code="minDate / maxDate"
                  checked={useDateLimits}
                  onChange={setUseDateLimits}
                />
                <ToggleRow
                  title="Disable Fridays"
                  code="isDateDisabled"
                  checked={disableFridays}
                  onChange={setDisableFridays}
                />
              </div>

              {useDateLimits && (
                <div
                  className={`jdp-range-config ${hasValidDateRange ? "" : "invalid"}`}
                >
                  <div className="jdp-range-config-head">
                    <div>
                      <div className="jdp-section-label">Allowed date range</div>
                      <div className="jdp-range-hint">Jalali year / month / day</div>
                    </div>
                    <span className="jdp-range-badge">min → max</span>
                  </div>

                  {(
                    [
                      ["Start", minLimit, setMinLimit],
                      ["End", maxLimit, setMaxLimit],
                    ] as const
                  ).map(([label, limit, setter]) => (
                    <div className="jdp-range-row" key={label}>
                      <span className="jdp-range-row-label">{label}</span>
                      <div className="jdp-range-date">
                        {(["year", "month", "day"] as const).map((field) => (
                          <input
                            key={field}
                            className="jdp-input jdp-range-part"
                            type="number"
                            aria-label={`${label} ${field}`}
                            min={field === "year" ? 1200 : 1}
                            max={field === "year" ? 1600 : field === "month" ? 12 : 31}
                            value={limit[field]}
                            onChange={(event) =>
                              updateRangeLimit(setter, field, event.target.value)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="jdp-range-summary">
                    {hasValidDateRange ? (
                      <>
                        <span>{formatRangeLimit(minLimit)}</span>
                        <span aria-hidden="true">→</span>
                        <span>{formatRangeLimit(maxLimit)}</span>
                      </>
                    ) : (
                      <span>Enter a valid start date before the end date.</span>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className="jdp-card jdp-card-pad">
              <div className="jdp-card-head">
                <div>
                  <h2 className="jdp-card-title">Custom holidays</h2>
                  <p className="jdp-card-desc">
                    Add non-standard holidays to the calendar.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddHoliday}>
                <input
                  className="jdp-input"
                  type="text"
                  placeholder="Holiday title"
                  value={newHolidayTitle}
                  onChange={(e) => setNewHolidayTitle(e.target.value)}
                />

                <div className="jdp-date-grid three" style={{ marginTop: 8 }}>
                  <input
                    className="jdp-input"
                    type="number"
                    aria-label="Holiday year"
                    placeholder="Year"
                    value={newHolidayYear}
                    onChange={(e) => setNewHolidayYear(Number(e.target.value))}
                  />
                  <input
                    className="jdp-input"
                    type="number"
                    aria-label="Holiday month"
                    placeholder="Month"
                    min={0}
                    max={11}
                    value={newHolidayMonth}
                    onChange={(e) => setNewHolidayMonth(Number(e.target.value))}
                  />
                  <input
                    className="jdp-input"
                    type="number"
                    aria-label="Holiday day"
                    placeholder="Day"
                    min={1}
                    max={31}
                    value={newHolidayDay}
                    onChange={(e) => setNewHolidayDay(Number(e.target.value))}
                  />
                </div>

                <button className="jdp-action danger" type="submit">
                  Add holiday
                </button>
              </form>

              <div className="jdp-list">
                {customHolidays.map((holiday, index) => (
                  <div
                    className="jdp-list-item"
                    key={`${holiday.title}-${index}`}
                  >
                    <div className="jdp-list-info">
                      <span
                        className="jdp-dot"
                        style={{ background: "var(--danger)" }}
                      />
                      <div className="jdp-list-text">
                        <div className="jdp-list-title">{holiday.title}</div>
                        <div className="jdp-list-date">
                          {holiday.date.year}/{holiday.date.month + 1}/
                          {holiday.date.day}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="jdp-remove"
                      aria-label={`Remove ${holiday.title}`}
                      onClick={() =>
                        setCustomHolidays((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="jdp-card jdp-card-pad">
              <div className="jdp-card-head">
                <div>
                  <h2 className="jdp-card-title">Calendar events</h2>
                  <p className="jdp-card-desc">
                    Create event badges for individual dates.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddEvent}>
                <input
                  className="jdp-input"
                  type="text"
                  placeholder="Event title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />

                <div className="jdp-date-grid event" style={{ marginTop: 8 }}>
                  <input
                    className="jdp-input"
                    type="number"
                    aria-label="Event year"
                    placeholder="Year"
                    value={newEventYear}
                    onChange={(e) => setNewEventYear(Number(e.target.value))}
                  />
                  <input
                    className="jdp-input"
                    type="number"
                    aria-label="Event month"
                    placeholder="Month"
                    min={0}
                    max={11}
                    value={newEventMonth}
                    onChange={(e) => setNewEventMonth(Number(e.target.value))}
                  />
                  <input
                    className="jdp-input"
                    type="number"
                    aria-label="Event day"
                    placeholder="Day"
                    min={1}
                    max={31}
                    value={newEventDay}
                    onChange={(e) => setNewEventDay(Number(e.target.value))}
                  />
                  <input
                    className="jdp-input"
                    type="color"
                    aria-label="Event color"
                    value={newEventColor}
                    onChange={(e) => setNewEventColor(e.target.value)}
                  />
                </div>

                <button className="jdp-action" type="submit">
                  Add event
                </button>
              </form>

              <div className="jdp-list">
                {events.map((event) => (
                  <div className="jdp-list-item" key={event.id}>
                    <div className="jdp-list-info">
                      <span
                        className="jdp-dot"
                        style={{ background: event.color }}
                      />
                      <div className="jdp-list-text">
                        <div className="jdp-list-title">{event.title}</div>
                        <div className="jdp-list-date">
                          {event.date.year}/{event.date.month + 1}/
                          {event.date.day}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="jdp-remove"
                      aria-label={`Remove ${event.title}`}
                      onClick={() =>
                        setEvents((prev) =>
                          prev.filter((item) => item.id !== event.id),
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <div className="jdp-main">
            <section className="jdp-card jdp-preview-card">
              <div className="jdp-preview-head">
                <div>
                  <h2 className="jdp-card-title">Live preview</h2>
                  <p className="jdp-card-desc">
                    The component below uses the current configuration.
                  </p>
                  {useDateLimits && hasValidDateRange && (
                    <p className="jdp-preview-range">
                      Allowed: {formatRangeLimit(minLimit)} → {formatRangeLimit(maxLimit)}
                    </p>
                  )}
                </div>
                <div className="jdp-preview-meta">
                  <span className="jdp-chip primary">{variant}</span>
                  <span className="jdp-chip">{mode}</span>
                  <span className="jdp-chip">
                    {numberOfMonths} month{numberOfMonths > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="jdp-preview-stage">
                <div className="jdp-preview-stage-inner">
                  <JalaliDatePicker
                    key={`${variant}-${numberOfMonths}`}
                    mode={mode}
                    variant={variant}
                    value={currentValue as any}
                    onChange={handleDateChange}
                    digitType={digitType}
                    numberOfMonths={numberOfMonths}
                    minDate={minDate}
                    maxDate={maxDate}
                    isDateDisabled={
                      disableFridays
                        ? (date) => date.getDay() === 5
                        : undefined
                    }
                    enableTime={enableTime}
                    showSeconds={showSeconds}
                    showHolidays={showHolidays}
                    customHolidays={customHolidays}
                    events={events}
                    allowClear={allowClear}
                    showFooter={showFooter}
                    placeholder="YYYY/MM/DD"
                  />
                </div>
              </div>
            </section>

            <section className="jdp-feature-grid" aria-label="New features">
              <article className="jdp-feature-card">
                <span className="jdp-feature-icon">↔</span>
                <div>
                  <h3>Responsive layout</h3>
                  <p>Dual calendars stack and popovers stay inside the viewport.</p>
                </div>
              </article>
              <article className="jdp-feature-card">
                <span className="jdp-feature-icon">◐</span>
                <div>
                  <h3>Portal-safe theme</h3>
                  <p>Popover and modal surfaces inherit light or dark tokens.</p>
                </div>
              </article>
              <article className="jdp-feature-card">
                <span className="jdp-feature-icon">⊘</span>
                <div>
                  <h3>Range constraints</h3>
                  <p>Invalid days, months and years are visibly disabled.</p>
                </div>
              </article>
            </section>

            <section className="jdp-card">
              <div className="jdp-output-head">
                <div>
                  <h2 className="jdp-card-title">Selected value</h2>
                  <p className="jdp-card-desc">Native JavaScript Date output</p>
                </div>
                <span className="jdp-output-label">JSON</span>
              </div>
              <pre className="jdp-code">
                {JSON.stringify(currentValue, null, 2) || "null"}
              </pre>
            </section>

            <section className="jdp-card jdp-sample-card">
              <div className="jdp-output-head">
                <div>
                  <h2 className="jdp-card-title">Copy-ready example</h2>
                  <p className="jdp-card-desc">
                    This snippet updates with the playground configuration.
                  </p>
                </div>
              </div>
              <div className="jdp-editor">
                <div className="jdp-editor-titlebar">
                  <div className="jdp-window-controls" aria-hidden="true">
                    <span className="close" />
                    <span className="minimize" />
                    <span className="maximize" />
                  </div>
                  <div className="jdp-editor-tab">
                    <span className="jdp-ts-icon">TS</span>
                    <span>Example.tsx</span>
                    <span className="jdp-unsaved-dot" aria-hidden="true">●</span>
                  </div>
                  <button
                    type="button"
                    className={`jdp-copy-button ${copied ? "copied" : ""}`}
                    onClick={handleCopySample}
                    title="Copy sample code"
                  >
                    <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="jdp-editor-breadcrumb">
                  <span>src</span><span>›</span><span>Example.tsx</span>
                </div>
                <div className="jdp-editor-body">
                  <div className="jdp-line-numbers" aria-hidden="true">
                    {sampleCode.split("\n").map((_, index) => (
                      <span key={index}>{index + 1}</span>
                    ))}
                  </div>
                  <pre className="jdp-sample-code">
                    <code>{sampleCode}</code>
                  </pre>
                </div>
                <div className="jdp-editor-statusbar" aria-hidden="true">
                  <span>⑂ demo*</span>
                  <span>Ln 1, Col 1&nbsp;&nbsp; Spaces: 2&nbsp;&nbsp; UTF-8&nbsp;&nbsp; TypeScript React</span>
                </div>
              </div>
              <span className="jdp-sr-only" aria-live="polite">
                {copied ? "Sample code copied to clipboard" : ""}
              </span>
            </section>
          </div>
        </main>
      </div>
    </DatePickerThemeProvider>
  );
}

export default App;
