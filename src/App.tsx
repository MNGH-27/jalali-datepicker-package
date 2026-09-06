// demo/src/App.tsx
import React, { useEffect, useState } from "react";
import {
  JalaliDatePicker,
  DatePickerThemeProvider,
  type CalendarEvent,
  type CustomHolidayRule,
} from "@mngh/jalali-datepicker";

import "./App.css";

type Mode = "single" | "range" | "multiple";
type Variant = "popover" | "inline" | "modal";
type DigitType = "latin" | "persian";

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
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 560px)");
    const update = () => setIsNarrow(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  const [mode, setMode] = useState<Mode>("single");
  const [variant, setVariant] = useState<Variant>("popover");
  const [digitType, setDigitType] = useState<DigitType>("latin");
  const [numberOfMonths, setNumberOfMonths] = useState<1 | 2>(1);
  const [enableTime, setEnableTime] = useState(true);
  const [showSeconds, setShowSeconds] = useState(false);
  const [showHolidays, setShowHolidays] = useState(true);
  const [allowClear, setAllowClear] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

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

  const effectiveMonths: 1 | 2 = isNarrow ? 1 : numberOfMonths;

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
                      <option value={2} disabled={isNarrow}>
                        2 months
                      </option>
                    </select>
                  </label>
                </div>
                {isNarrow && numberOfMonths === 2 && (
                  <div className="jdp-note">
                    Two-month view is automatically reduced to one month on
                    small screens.
                  </div>
                )}
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
              </div>
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
                </div>
                <div className="jdp-preview-meta">
                  <span className="jdp-chip primary">{variant}</span>
                  <span className="jdp-chip">{mode}</span>
                  <span className="jdp-chip">
                    {effectiveMonths} month{effectiveMonths > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="jdp-preview-stage">
                <div className="jdp-preview-stage-inner">
                  <JalaliDatePicker
                    key={`${variant}-${effectiveMonths}`}
                    mode={mode}
                    variant={variant}
                    value={currentValue as any}
                    onChange={handleDateChange}
                    digitType={digitType}
                    numberOfMonths={effectiveMonths}
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
          </div>
        </main>
      </div>
    </DatePickerThemeProvider>
  );
}

export default App;
