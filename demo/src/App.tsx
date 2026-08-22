import { useState } from "react";
import {
  JalaliDatePicker,
  DatePickerThemeProvider,
} from "@mngh/jalali-datepicker";

export function App() {
  const [single, setSingle] = useState<Date | null>(null);
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [multiple, setMultiple] = useState<Date[]>([]);
  const [time, setTime] = useState<{ hour: number; minute: number }>({
    hour: 12,
    minute: 0,
  });
  const [mode, setMode] = useState<"light" | "dark">("light");

  return (
    <DatePickerThemeProvider mode={mode}>
      <div
        style={{
          minHeight: "100vh",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          fontFamily: "inherit",
          direction: "rtl",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h1 style={{ margin: 0 }}>Jalali Datepicker Demo</h1>
          <button
            type="button"
            onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid currentColor",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Switch {mode === "light" ? "Dark" : "Light"} Theme
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <section
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(128,128,128,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Single - Popover</h3>
            <JalaliDatePicker
              variant="popover"
              mode="single"
              value={single}
              onChange={setSingle}
              placeholder="تاریخ را انتخاب کنید"
            />
            <pre style={{ margin: 0, fontSize: "0.85rem" }}>
              {JSON.stringify(single, null, 2)}
            </pre>
          </section>

          <section
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(128,128,128,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Range - Inline</h3>
            <JalaliDatePicker
              variant="inline"
              mode="range"
              value={range}
              onChange={setRange}
              numberOfMonths={2}
            />
            <pre style={{ margin: 0, fontSize: "0.85rem" }}>
              {JSON.stringify(range, null, 2)}
            </pre>
          </section>

          <section
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(128,128,128,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Multiple - Popover</h3>
            <JalaliDatePicker
              variant="popover"
              mode="multiple"
              value={multiple}
              onChange={setMultiple}
            />
            <pre style={{ margin: 0, fontSize: "0.85rem" }}>
              {JSON.stringify(multiple, null, 2)}
            </pre>
          </section>

          <section
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(128,128,128,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Single - Modal + Time</h3>
            <JalaliDatePicker
              variant="modal"
              mode="single"
              value={single}
              onChange={setSingle}
              enableTime
              timeValue={time}
              onTimeChange={setTime}
              showFooter
            />
            <pre style={{ margin: 0, fontSize: "0.85rem" }}>
              {JSON.stringify({ single, time }, null, 2)}
            </pre>
          </section>

          <section
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(128,128,128,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Inline + Holidays + Events</h3>
            <JalaliDatePicker
              variant="inline"
              mode="single"
              value={single}
              onChange={setSingle}
              showHolidays
              customHolidays={[
                {
                  date: {
                    year: new Date().getFullYear() + 621,
                    month: 0,
                    day: 1,
                  },
                  title: "نمایش تعطیل سفارشی",
                  isOff: true,
                },
              ]}
              events={[
                {
                  id: "1",
                  date: {
                    year: new Date().getFullYear() + 621,
                    month: 0,
                    day: 3,
                  },
                  title: "رویداد نمونه",
                  color: "#2563eb",
                },
              ]}
            />
          </section>
        </div>
      </div>
    </DatePickerThemeProvider>
  );
}
