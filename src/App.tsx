// src/App.tsx
import React, { useState } from "react";
import {
  JalaliDatePicker,
  DatePickerThemeProvider,
  formatJalaliDate,
  toPersianDigits,
} from "@mngh/jalali-datepicker";
import type {
  DatePickerMode,
  DatePickerVariant,
  DateRange,
} from "@mngh/jalali-datepicker";

export function App() {
  // Playground State Controls
  const [mode, setMode] = useState<DatePickerMode>("single");
  const [variant, setVariant] = useState<DatePickerVariant>("popover");
  const [enableTime, setEnableTime] = useState<boolean>(true);
  const [showSeconds, setShowSeconds] = useState<boolean>(false);
  const [showHolidays, setShowHolidays] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState<boolean>(true);

  // Selected Values
  const [singleDate, setSingleDate] = useState<Date | null>(new Date());
  const [rangeDate, setRangeDate] = useState<DateRange>([null, null]);
  const [multipleDates, setMultipleDates] = useState<Date[]>([]);

  const activeValue =
    mode === "single"
      ? singleDate
      : mode === "range"
        ? rangeDate
        : multipleDates;

  const handleDateChange = (val: any) => {
    if (mode === "single") setSingleDate(val);
    else if (mode === "range") setRangeDate(val);
    else if (mode === "multiple") setMultipleDates(val);
  };

  const getFormattedSummary = () => {
    if (mode === "single") {
      if (!singleDate) return "موردی انتخاب نشده";
      return formatJalaliDate(
        singleDate,
        enableTime ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD",
      );
    }
    if (mode === "range") {
      const [start, end] = rangeDate;
      if (!start) return "موردی انتخاب نشده";
      if (!end) return `${formatJalaliDate(start, "YYYY/MM/DD")} تا ...`;
      return `${formatJalaliDate(start, "YYYY/MM/DD")} تا ${formatJalaliDate(end, "YYYY/MM/DD")}`;
    }
    if (mode === "multiple") {
      if (!multipleDates.length) return "موردی انتخاب نشده";
      return `${toPersianDigits(multipleDates.length)} تاریخ انتخاب شده`;
    }
    return "";
  };

  return (
    <DatePickerThemeProvider mode="light">
      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          backgroundColor: "#0b1120",
          color: "#f8fafc",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar */}
        <header
          style={{
            borderBottom: "1px solid #1e293b",
            padding: "16px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#0f172a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4f46e5, #9333ea)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              }}
            >
              📅
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#f8fafc",
                }}
              >
                Jalali DatePicker Playground
              </h1>
              <span
                style={{
                  color: "#818cf8",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                @mngh/jalali-datepicker
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                backgroundColor: "#1e293b",
                color: "#94a3b8",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #334155",
              }}
            >
              React 18 / 19
            </span>
          </div>
        </header>

        {/* Content Layout */}
        <main
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "24px",
            padding: "32px",
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {/* Controls Panel */}
          <aside
            style={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "14px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              height: "fit-content",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 700,
                borderBottom: "1px solid #1e293b",
                paddingBottom: "10px",
              }}
            >
              پیکربندی دمو
            </h2>

            {/* Mode Selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  color: "#94a3b8",
                  marginBottom: "8px",
                }}
              >
                حالت انتخاب (Mode):
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "6px",
                }}
              >
                {(["single", "range", "multiple"] as DatePickerMode[]).map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      style={{
                        padding: "8px 4px",
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: mode === m ? "#4f46e5" : "#1e293b",
                        background: mode === m ? "#4f46e5" : "#1e293b",
                        color: mode === m ? "#ffffff" : "#94a3b8",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {m === "single"
                        ? "تکی"
                        : m === "range"
                          ? "بازه"
                          : "چندتایی"}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Variant Selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  color: "#94a3b8",
                  marginBottom: "8px",
                }}
              >
                نوع نمایش (Variant):
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                }}
              >
                {(["popover", "inline"] as DatePickerVariant[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariant(v)}
                    style={{
                      padding: "8px 4px",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: variant === v ? "#4f46e5" : "#1e293b",
                      background: variant === v ? "#4f46e5" : "#1e293b",
                      color: variant === v ? "#ffffff" : "#94a3b8",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {v === "popover" ? "Popover" : "Inline"}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                paddingTop: "4px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={enableTime}
                  onChange={(e) => setEnableTime(e.target.checked)}
                />
                انتخاب ساعت و دقیقه (TimePicker)
              </label>

              {enableTime && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    paddingRight: "22px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showSeconds}
                    onChange={(e) => setShowSeconds(e.target.checked)}
                  />
                  نمایش فیلد ثانیه
                </label>
              )}

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={showHolidays}
                  onChange={(e) => setShowHolidays(e.target.checked)}
                />
                هایلایت تعطیلات رسمی ایران
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={showFooter}
                  onChange={(e) => setShowFooter(e.target.checked)}
                />
                نمایش فوتر (دکمه‌های اقدام)
              </label>
            </div>
          </aside>

          {/* Playground Preview & Output */}
          <section
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Live Component Viewer */}
            <div
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "14px",
                padding: "48px 24px",
                minHeight: "380px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <JalaliDatePicker
                key={`${mode}-${variant}-${enableTime}-${showSeconds}`}
                mode={mode}
                variant={variant}
                value={activeValue}
                onChange={handleDateChange}
                enableTime={enableTime}
                showSeconds={showSeconds}
                showHolidays={showHolidays}
                showFooter={showFooter}
                placeholder="انتخاب تاریخ..."
              />
            </div>

            {/* Output Panel */}
            <div
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  نتیجه خروجی:
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#38bdf8",
                    fontWeight: 600,
                  }}
                >
                  {getFormattedSummary()}
                </span>
              </div>

              <pre
                dir="ltr"
                style={{
                  margin: 0,
                  padding: "14px",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "10px",
                  color: "#7dd3fc",
                  fontSize: "0.82rem",
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  overflowX: "auto",
                  lineHeight: "1.5",
                }}
              >
                {JSON.stringify(
                  {
                    mode,
                    variant,
                    hasTime: enableTime,
                    value: activeValue,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </section>
        </main>
      </div>
    </DatePickerThemeProvider>
  );
}

export default App;
