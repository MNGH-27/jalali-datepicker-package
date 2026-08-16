import { useState } from "react";
import {
  JalaliDatePicker,
  DatePickerThemeProvider,
  type DateRange,
} from "@mngh/jalali-datepicker";
import {
  Copy,
  Check,
  Moon,
  Sun,
  Calendar,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [mode, setMode] = useState<"single" | "range" | "multiple">("single");
  const [variant, setVariant] = useState<"popover" | "inline" | "modal">(
    "popover",
  );
  const [enableTime, setEnableTime] = useState<boolean>(false);
  const [showHolidays, setShowHolidays] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [numberOfMonths, setNumberOfMonths] = useState<1 | 2>(1);

  // States
  const [singleDate, setSingleDate] = useState<Date | null>(new Date());
  const [rangeDate, setRangeDate] = useState<DateRange>([null, null]);
  const [multipleDates, setMultipleDates] = useState<Date[]>([]);
  const [copied, setCopied] = useState(false);

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveCode = () => {
    return `import { JalaliDatePicker } from '@mngh/jalali-datepicker';
import { useState } from 'react';

export function Example() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <JalaliDatePicker
      mode="${mode}"
      variant="${variant}"
      ${enableTime ? "enableTime={true}\n      showSeconds={true}" : ""}
      ${numberOfMonths > 1 ? `numberOfMonths={${numberOfMonths}}` : ""}
      showHolidays={${showHolidays}}
      showFooter={${showFooter}}
      value={date}
      onChange={setDate}
    />
  );
}`;
  };

  const isDark = themeMode === "dark";

  return (
    <DatePickerThemeProvider mode={themeMode}>
      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          backgroundColor: isDark ? "#090d16" : "#f8fafc",
          color: isDark ? "#f1f5f9" : "#0f172a",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          transition: "all 0.2s ease",
        }}
      >
        {/* Header */}
        <header
          style={{
            borderBottom: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backdropFilter: "blur(8px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: isDark
              ? "rgba(9, 13, 22, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                padding: "0.5rem",
                background: "#3b82f6",
                borderRadius: "8px",
                color: "#fff",
                display: "flex",
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                @mngh/jalali-datepicker
              </h1>
              <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
                Zero-dependency, Native JS Date Shamsi Calendar for React
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() =>
                setThemeMode((prev) => (prev === "light" ? "dark" : "light"))
              }
              style={{
                background: isDark ? "#1e293b" : "#e2e8f0",
                border: "none",
                color: isDark ? "#f1f5f9" : "#0f172a",
                padding: "0.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
              }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3rem 1.5rem 1rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              تقویم شمسی مدرن، فوق‌العاده سبک و بدون وابستگی
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                opacity: 0.7,
                maxWidth: "650px",
                margin: "0 auto",
              }}
            >
              پشتیبانی کامل از فرمت استاندارد <code>Date</code> جاوااسکریپت،
              محاسبات نجومی دقیق جلالی، تایپ‌اسکریپت کامل و امکانات پیشرفته نظیر
              بازه زمانی و انتخاب ساعت.
            </p>

            {/* Quick Install */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                background: isDark ? "#1e293b" : "#ffffff",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                marginTop: "1.5rem",
                direction: "ltr",
              }}
            >
              <code style={{ fontSize: "0.9rem", color: "#38bdf8" }}>
                npm install @mngh/jalali-datepicker
              </code>
              <button
                onClick={() => copyCode("npm install @mngh/jalali-datepicker")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                  display: "flex",
                }}
              >
                {copied ? (
                  <Check size={16} color="#10b981" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Interactive Playground */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(320px, 360px) 1fr",
              gap: "2rem",
              background: isDark ? "#111827" : "#ffffff",
              borderRadius: "16px",
              border: `1px solid ${isDark ? "#1f2937" : "#e2e8f0"}`,
              padding: "2rem",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            {/* Control Panel */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                borderLeft: `1px solid ${isDark ? "#1f2937" : "#e2e8f0"}`,
                paddingLeft: "1.5rem",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Layers size={18} /> تنظیمات کامپوننت
              </h3>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    marginBottom: "0.5rem",
                    opacity: 0.8,
                  }}
                >
                  حالت انتخاب (Mode):
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["single", "range", "multiple"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{
                        flex: 1,
                        padding: "0.4rem",
                        fontSize: "0.8rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        background:
                          mode === m
                            ? "#3b82f6"
                            : isDark
                              ? "#1f2937"
                              : "#e2e8f0",
                        color: mode === m ? "#ffffff" : "inherit",
                        border: "none",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    marginBottom: "0.5rem",
                    opacity: 0.8,
                  }}
                >
                  نحوه نمایش (Variant):
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["popover", "inline", "modal"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      style={{
                        flex: 1,
                        padding: "0.4rem",
                        fontSize: "0.8rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        background:
                          variant === v
                            ? "#3b82f6"
                            : isDark
                              ? "#1f2937"
                              : "#e2e8f0",
                        color: variant === v ? "#ffffff" : "inherit",
                        border: "none",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enableTime}
                    onChange={(e) => setEnableTime(e.target.checked)}
                  />
                  فعال‌سازی انتخاب زمان (Time Picker)
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
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
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showFooter}
                    onChange={(e) => setShowFooter(e.target.checked)}
                  />
                  نمایش فوتر و دکمه امروز
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={numberOfMonths === 2}
                    onChange={(e) =>
                      setNumberOfMonths(e.target.checked ? 2 : 1)
                    }
                  />
                  نمایش تقویم دو ماهه (Dual Month)
                </label>
              </div>
            </div>

            {/* Live Component Preview */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: numberOfMonths === 2 ? "650px" : "360px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {mode === "single" && (
                  <JalaliDatePicker
                    mode="single"
                    variant={variant}
                    value={singleDate}
                    onChange={setSingleDate}
                    enableTime={enableTime}
                    showSeconds={true}
                    showHolidays={showHolidays}
                    showFooter={showFooter}
                    numberOfMonths={numberOfMonths}
                  />
                )}

                {mode === "range" && (
                  <JalaliDatePicker
                    mode="range"
                    variant={variant}
                    value={rangeDate}
                    onChange={setRangeDate}
                    enablePresets={true}
                    showHolidays={showHolidays}
                    showFooter={showFooter}
                    numberOfMonths={numberOfMonths}
                  />
                )}

                {mode === "multiple" && (
                  <JalaliDatePicker
                    mode="multiple"
                    variant={variant}
                    value={multipleDates}
                    onChange={setMultipleDates}
                    showHolidays={showHolidays}
                    showFooter={showFooter}
                    numberOfMonths={numberOfMonths}
                  />
                )}
              </div>

              {/* Output Readout */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  background: isDark ? "#0a0f1d" : "#f1f5f9",
                  borderRadius: "8px",
                  padding: "1rem",
                  direction: "ltr",
                  fontSize: "0.85rem",
                }}
              >
                <span
                  style={{
                    color: "#94a3b8",
                    display: "block",
                    marginBottom: "0.25rem",
                  }}
                >
                  // Selected Value (Native JS Date Output):
                </span>
                <code style={{ color: "#38bdf8" }}>
                  {mode === "single" &&
                    (singleDate ? singleDate.toString() : "null")}
                  {mode === "range" &&
                    JSON.stringify(
                      rangeDate.map((d) =>
                        d ? d.toISOString().split("T")[0] : null,
                      ),
                    )}
                  {mode === "multiple" &&
                    JSON.stringify(
                      multipleDates.map((d) => d.toISOString().split("T")[0]),
                    )}
                </code>
              </div>
            </div>
          </div>

          {/* Generated Code Section */}
          <div style={{ marginTop: "3rem", position: "relative" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                کد JSX تولید شده:
              </span>
              <button
                onClick={() => copyCode(getActiveCode())}
                style={{
                  background: isDark ? "#1e293b" : "#e2e8f0",
                  border: "none",
                  color: "inherit",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {copied ? (
                  <Check size={14} color="#10b981" />
                ) : (
                  <Copy size={14} />
                )}{" "}
                کپی کد
              </button>
            </div>
            <pre
              style={{
                background: isDark ? "#111827" : "#1e293b",
                color: "#e2e8f0",
                padding: "1.5rem",
                borderRadius: "12px",
                overflowX: "auto",
                direction: "ltr",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                border: `1px solid ${isDark ? "#1f2937" : "#334155"}`,
              }}
            >
              <code>{getActiveCode()}</code>
            </pre>
          </div>
        </div>
      </div>
    </DatePickerThemeProvider>
  );
}
