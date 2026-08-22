// demo/src/App.tsx
import React, { useState, useEffect } from "react";
import {
  JalaliDatePicker,
  DatePickerThemeProvider,
  type CalendarEvent,
  type CustomHolidayRule,
} from "@mngh/jalali-datepicker";

export function App() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Interactive Props
  const [mode, setMode] = useState<"single" | "range" | "multiple">("single");
  const [variant, setVariant] = useState<"popover" | "inline" | "modal">(
    "popover",
  );
  const [digitType, setDigitType] = useState<"latin" | "persian">("latin");
  const [numberOfMonths, setNumberOfMonths] = useState<1 | 2>(1);
  const [enableTime, setEnableTime] = useState<boolean>(true);
  const [showSeconds, setShowSeconds] = useState<boolean>(false);
  const [showHolidays, setShowHolidays] = useState<boolean>(true);
  const [allowClear, setAllowClear] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState<boolean>(true);

  // Selected values (Native Date)
  const [singleValue, setSingleValue] = useState<Date | null>(new Date());
  const [rangeValue, setRangeValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [multiValue, setMultiValue] = useState<Date[]>([]);

  // Events State
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      date: { year: 1405, month: 5, day: 10 },
      title: "Code Review Meeting",
      color: "#3b82f6",
    },
    {
      id: "2",
      date: { year: 1405, month: 5, day: 25 },
      title: "Project Deadline",
      color: "#ef4444",
    },
  ]);

  // Form State for creating a new event
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventYear, setNewEventYear] = useState(1405);
  const [newEventMonth, setNewEventMonth] = useState(5);
  const [newEventDay, setNewEventDay] = useState(15);
  const [newEventColor, setNewEventColor] = useState("#10b981");

  // Custom Holidays State
  const [customHolidays, setCustomHolidays] = useState<CustomHolidayRule[]>([
    {
      date: { year: 1405, month: 5, day: 1 },
      title: "Company Anniversary (سالروز تاسیس شرکت)",
      isOff: true,
    },
  ]);

  // Form State for adding custom holiday
  const [newHolidayTitle, setNewHolidayTitle] = useState("");
  const [newHolidayYear, setNewHolidayYear] = useState(1405);
  const [newHolidayMonth, setNewHolidayMonth] = useState(5);
  const [newHolidayDay, setNewHolidayDay] = useState(8);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: String(Date.now()),
      title: newEventTitle.trim(),
      date: {
        year: Number(newEventYear),
        month: Number(newEventMonth) as CalendarEvent["date"]["month"],
        day: Number(newEventDay),
      },
      color: newEventColor,
    };

    setEvents((prev) => [...prev, newEv]);
    setNewEventTitle("");
  };

  const handleRemoveEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayTitle.trim()) return;

    const newHol: CustomHolidayRule = {
      title: newHolidayTitle.trim(),
      date: {
        year: Number(newHolidayYear),
        month: Number(newHolidayMonth) as CustomHolidayRule["date"]["month"],
        day: Number(newHolidayDay),
      },
      isOff: true,
    };

    setCustomHolidays((prev) => [...prev, newHol]);
    setNewHolidayTitle("");
  };

  const handleRemoveHoliday = (index: number) => {
    setCustomHolidays((prev) => prev.filter((_, i) => i !== index));
  };

  const currentValue =
    mode === "single"
      ? singleValue
      : mode === "range"
        ? rangeValue
        : multiValue;

  const handleDateChange = (val: any) => {
    if (mode === "single") setSingleValue(val);
    else if (mode === "range") setRangeValue(val);
    else setMultiValue(val);
  };

  const isDark = themeMode === "dark";
  const bgMain = isDark ? "#0f172a" : "#f8fafc";
  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const borderColor = isDark ? "#334155" : "#e2e8f0";

  return (
    <DatePickerThemeProvider mode={themeMode}>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: bgMain,
          color: textColor,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease",
        }}
      >
        {/* Responsive Navbar */}
        <header
          style={{
            padding: isMobile ? "12px 16px" : "16px 32px",
            backgroundColor: cardBg,
            borderBottom: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: 800,
              }}
            >
              @mngh/jalali-datepicker
            </h1>
            <span
              style={{
                fontSize: "11.5px",
                color: isDark ? "#94a3b8" : "#64748b",
              }}
            >
              Interactive Playground & Demo
            </span>
          </div>

          <button
            onClick={() => setThemeMode(isDark ? "light" : "dark")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: `1px solid ${borderColor}`,
              backgroundColor: cardBg,
              color: textColor,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "12.5px",
              whiteSpace: "nowrap",
            }}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        {/* Responsive Layout Grid */}
        <main
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(320px, 440px) 1fr",
            gap: isMobile ? "16px" : "24px",
            padding: isMobile ? "16px" : "24px 32px",
            maxWidth: "1440px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {/* Main Preview & Inspector Column (Shown First on Mobile) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              order: isMobile ? 1 : 2,
            }}
          >
            {/* Live Component Card */}
            <section
              style={{
                backgroundColor: cardBg,
                borderRadius: "16px",
                border: `1px solid ${borderColor}`,
                padding: isMobile ? "20px 12px" : "36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: isMobile ? "300px" : "380px",
                overflowX: "auto",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{ maxWidth: "100%", overflowX: "auto", padding: "4px" }}
              >
                <JalaliDatePicker
                  key={`${mode}-${variant}-${numberOfMonths}`}
                  mode={mode}
                  variant={variant}
                  value={currentValue as any}
                  onChange={handleDateChange}
                  digitType={digitType}
                  numberOfMonths={numberOfMonths}
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
            </section>

            {/* Native Date Output Inspector */}
            <section
              style={{
                backgroundColor: cardBg,
                borderRadius: "16px",
                border: `1px solid ${borderColor}`,
                padding: "16px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "13.5px",
                  fontWeight: 700,
                }}
              >
                📋 Native JavaScript `Date` Output:
              </h3>
              <pre
                style={{
                  margin: 0,
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: isDark ? "#090d16" : "#f1f5f9",
                  color: isDark ? "#38bdf8" : "#0369a1",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  overflowX: "auto",
                  fontFamily: "monospace",
                }}
              >
                {JSON.stringify(currentValue, null, 2) || "null"}
              </pre>
            </section>
          </div>

          {/* Configuration Panel & Management Sidebar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              order: isMobile ? 2 : 1,
            }}
          >
            {/* Props Configuration Card */}
            <section
              style={{
                backgroundColor: cardBg,
                borderRadius: "16px",
                border: `1px solid ${borderColor}`,
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "14.5px", fontWeight: 700 }}>
                ⚙️ Props Configuration
              </h2>

              {/* Selection Mode */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ fontSize: "12px", fontWeight: 600 }}>
                  Mode (`mode`):
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(["single", "range", "multiple"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: "6px",
                        border: `1px solid ${mode === m ? "#4f46e5" : borderColor}`,
                        backgroundColor: mode === m ? "#4f46e5" : "transparent",
                        color: mode === m ? "#fff" : textColor,
                        cursor: "pointer",
                        fontSize: "11.5px",
                        fontWeight: 600,
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Variant */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ fontSize: "12px", fontWeight: 600 }}>
                  Variant (`variant`):
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(["popover", "inline", "modal"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: "6px",
                        border: `1px solid ${variant === v ? "#4f46e5" : borderColor}`,
                        backgroundColor:
                          variant === v ? "#4f46e5" : "transparent",
                        color: variant === v ? "#fff" : textColor,
                        cursor: "pointer",
                        fontSize: "11.5px",
                        fontWeight: 600,
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Digits & Dual Calendar Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <label style={{ fontSize: "12px", fontWeight: 600 }}>
                    Digit Type:
                  </label>
                  <select
                    value={digitType}
                    onChange={(e) => setDigitType(e.target.value as any)}
                    style={{
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      color: textColor,
                      fontSize: "12px",
                    }}
                  >
                    <option value="latin">Latin (0-9)</option>
                    <option value="persian">Persian (۰-۹)</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <label style={{ fontSize: "12px", fontWeight: 600 }}>
                    Months Grid:
                  </label>
                  <select
                    value={numberOfMonths}
                    onChange={(e) =>
                      setNumberOfMonths(Number(e.target.value) as any)
                    }
                    style={{
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      color: textColor,
                      fontSize: "12px",
                    }}
                  >
                    <option value={1}>1 Month</option>
                    <option value={2}>2 Months (Dual)</option>
                  </select>
                </div>
              </div>

              {/* Feature Toggles */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enableTime}
                    onChange={(e) => setEnableTime(e.target.checked)}
                  />
                  Enable Time Picker (`enableTime`)
                </label>

                {enableTime && (
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12.5px",
                      cursor: "pointer",
                      marginInlineStart: "16px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={showSeconds}
                      onChange={(e) => setShowSeconds(e.target.checked)}
                    />
                    Show Seconds (`showSeconds`)
                  </label>
                )}

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showHolidays}
                    onChange={(e) => setShowHolidays(e.target.checked)}
                  />
                  Show Holidays & Fridays (`showHolidays`)
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={allowClear}
                    onChange={(e) => setAllowClear(e.target.checked)}
                  />
                  Allow Clear Button (`allowClear`)
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showFooter}
                    onChange={(e) => setShowFooter(e.target.checked)}
                  />
                  Show Footer (`showFooter`)
                </label>
              </div>
            </section>

            {/* Custom Holidays Manager */}
            <section
              style={{
                backgroundColor: cardBg,
                borderRadius: "16px",
                border: `1px solid ${borderColor}`,
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "14.5px",
                  fontWeight: 700,
                  color: "#e11d48",
                }}
              >
                🎉 Custom Holidays
              </h2>

              <form
                onSubmit={handleAddHoliday}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <input
                  type="text"
                  placeholder="Holiday title"
                  value={newHolidayTitle}
                  onChange={(e) => setNewHolidayTitle(e.target.value)}
                  style={{
                    padding: "7px 9px",
                    borderRadius: "6px",
                    border: `1px solid ${borderColor}`,
                    backgroundColor: isDark ? "#0f172a" : "#fff",
                    color: textColor,
                    fontSize: "12.5px",
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "6px",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Year"
                    value={newHolidayYear}
                    onChange={(e) => setNewHolidayYear(Number(e.target.value))}
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      color: textColor,
                      fontSize: "11.5px",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Month"
                    min={0}
                    max={11}
                    value={newHolidayMonth}
                    onChange={(e) => setNewHolidayMonth(Number(e.target.value))}
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      color: textColor,
                      fontSize: "11.5px",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Day"
                    min={1}
                    max={31}
                    value={newHolidayDay}
                    onChange={(e) => setNewHolidayDay(Number(e.target.value))}
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      color: textColor,
                      fontSize: "11.5px",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "7px 10px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#e11d48",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  + Add Custom Holiday
                </button>
              </form>

              {/* List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  maxHeight: "130px",
                  overflowY: "auto",
                }}
              >
                {customHolidays.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      backgroundColor: isDark ? "#090d16" : "#fff1f2",
                      border: "1px solid #fecdd3",
                      fontSize: "11.5px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          color: "#e11d48",
                          fontWeight: 600,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        🚩 {h.title}
                      </span>
                      <span
                        style={{
                          color: isDark ? "#fda4af" : "#be123c",
                          fontSize: "11px",
                          flexShrink: 0,
                        }}
                      >
                        ({h.date.year}/{h.date.month + 1}/{h.date.day})
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveHoliday(idx)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: 700,
                        padding: "0 4px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Custom Events Creator */}
            <section
              style={{
                backgroundColor: cardBg,
                borderRadius: "16px",
                border: `1px solid ${borderColor}`,
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "14.5px", fontWeight: 700 }}>
                📅 Add Custom Calendar Events
              </h2>

              <form
                onSubmit={handleAddEvent}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  style={{
                    padding: "7px 9px",
                    borderRadius: "6px",
                    border: `1px solid ${borderColor}`,
                    backgroundColor: isDark ? "#0f172a" : "#fff",
                    color: textColor,
                    fontSize: "12.5px",
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Year"
                    value={newEventYear}
                    onChange={(e) => setNewEventYear(Number(e.target.value))}
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      color: textColor,
                      fontSize: "11.5px",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Month"
                    min={0}
                    max={11}
                    value={newEventMonth}
                    onChange={(e) => setNewEventMonth(Number(e.target.value))}
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      color: textColor,
                      fontSize: "11.5px",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Day"
                    min={1}
                    max={31}
                    value={newEventDay}
                    onChange={(e) => setNewEventDay(Number(e.target.value))}
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      color: textColor,
                      fontSize: "11.5px",
                    }}
                  />
                  <input
                    type="color"
                    value={newEventColor}
                    onChange={(e) => setNewEventColor(e.target.value)}
                    style={{
                      width: "28px",
                      height: "28px",
                      padding: 0,
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "7px 10px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#4f46e5",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  + Add Event Badge
                </button>
              </form>

              {/* List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  maxHeight: "130px",
                  overflowY: "auto",
                }}
              >
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
                      fontSize: "11.5px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: ev.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.title}
                      </span>
                      <span
                        style={{
                          color: isDark ? "#94a3b8" : "#64748b",
                          fontSize: "10.5px",
                          flexShrink: 0,
                        }}
                      >
                        ({ev.date.year}/{ev.date.month + 1}/{ev.date.day})
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveEvent(ev.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: 700,
                        padding: "0 4px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </DatePickerThemeProvider>
  );
}

export default App;
