// src/App.tsx
import React, { useState } from "react";
import {
  JalaliDatePicker,
  DatePickerThemeProvider,
  formatJalaliDate,
  toPersianDigits,
} from "@mngh/jalali-datepicker";
import type { DateRange } from "@mngh/jalali-datepicker";

export function App() {
  // States
  const [mode, setMode] = useState<DatePickerMode>("single");
  const [variant, setVariant] = useState<DatePickerVariant>("popover");
  const [enableTime, setEnableTime] = useState<boolean>(true);
  const [showSeconds, setShowSeconds] = useState<boolean>(false);
  const [showHolidays, setShowHolidays] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState<boolean>(true);

  // Selected values for each mode
  const [singleDate, setSingleDate] = useState<Date | null>(new Date());
  const [rangeDate, setRangeDate] = useState<DateRange>([null, null]);
  const [multipleDates, setMultipleDates] = useState<Date[]>([]);

  // Get current active value based on mode
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

  return (
    <DatePickerThemeProvider mode="light">
      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          backgroundColor: "#090d16",
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
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #4f46e5, #9333ea)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              📅
            </div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
              Jalali DatePicker{" "}
              <span style={{ color: "#818cf8", fontSize: "0.9rem" }}>
                v1.0.2
              </span>
            </h1>
          </div>

          <a
            href="https://github.com/MNGH-27/jalali-datepicker-package"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            گیت‌هاب ↗
          </a>
        </header>

        {/* Main Grid Container */}
        <main
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "24px",
            padding: "32px",
            maxWidth: "1300px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {/* Settings Sidebar */}
          <section
            style={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "12px",
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
                fontSize: "1rem",
                borderBottom: "1px solid #1e293b",
                paddingBottom: "10px",
              }}
            >
              تنظیمات دمو
            </h2>

            {/* Mode Select */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  marginBottom: "6px",
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
                {["single", "range", "multiple"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "none",
                      background: mode === m ? "#4f46e5" : "#1e293b",
                      color: mode === m ? "#ffffff" : "#94a3b8",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {m === "single"
                      ? "تکی"
                      : m === "range"
                        ? "بازه"
                        : "چندتایی"}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant Select */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  marginBottom: "6px",
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
                {["popover", "inline"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariant(v)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "none",
                      background: variant === v ? "#4f46e5" : "#1e293b",
                      color: variant === v ? "#ffffff" : "#94a3b8",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {v === "popover" ? "Popover" : "Inline"}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={enableTime}
                  onChange={(e) => setEnableTime(e.target.checked)}
                />
                انتخاب ساعت و زمان (TimePicker)
              </label>

              {enableTime && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    marginRight: "16px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showSeconds}
                    onChange={(e) => setShowSeconds(e.target.checked)}
                  />
                  نمایش ثانیه
                </label>
              )}

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={showHolidays}
                  onChange={(e) => setShowHolidays(e.target.checked)}
                />
                نمایش تعطیلات رسمی
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={showFooter}
                  onChange={(e) => setShowFooter(e.target.checked)}
                />
                نمایش فوتر (دکمه امروز و پاک کردن)
              </label>
            </div>
          </section>

          {/* Interactive Playground View */}
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Live Component Box */}
            <div
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "40px",
                minHeight: "360px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <JalaliDatePicker
                key={`${mode}-${variant}`}
                mode={mode}
                variant={variant}
                value={activeValue}
                onChange={handleDateChange}
                enableTime={enableTime}
                showSeconds={showSeconds}
                showHolidays={showHolidays}
                showFooter={showFooter}
                placeholder="برای انتخاب کلیک کنید..."
              />
            </div>

            {/* Output Panel */}
            <div
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#94a3b8" }}>
                خروجی مقدار انتخاب شده (Output):
              </h3>
              <pre
                dir="ltr"
                style={{
                  margin: 0,
                  padding: "14px",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  color: "#38bdf8",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(
                  {
                    mode,
                    formattedPersian:
                      mode === "single" && singleDate
                        ? formatJalaliDate(singleDate, "YYYY/MM/DD HH:mm:ss")
                        : mode === "range" && rangeDate[0]
                          ? `${formatJalaliDate(rangeDate[0], "YYYY/MM/DD")} - ${rangeDate[1] ? formatJalaliDate(rangeDate[1], "YYYY/MM/DD") : "..."}`
                          : mode === "multiple"
                            ? multipleDates.map((d) =>
                                formatJalaliDate(d, "YYYY/MM/DD"),
                              )
                            : null,
                    rawValue: activeValue,
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
