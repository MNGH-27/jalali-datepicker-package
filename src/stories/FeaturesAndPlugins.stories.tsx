import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePickerThemeProvider } from "../theme/ThemeProvider";
import { TimePicker } from "../plugins/time-picker/TimePicker";
import type { JalaliTime } from "../plugins/time-picker/types";
import { formatTimeString } from "../plugins/time-picker/time-utils";
import { PresetsBar } from "../plugins/presets/PresetsBar";
import type { PresetValue } from "../plugins/presets/types";
import { DualMonthCalendar } from "../components/dual-calendar/DualMonthCalendar";
import type { JalaliDateRange } from "../hooks/types";
import { formatJalaliDate } from "../formatters/jalali-formatter";
import { MaskedDateInput } from "../components/masked-input/MaskedDateInput";
import type { JalaliDate } from "../core/types";

const meta: Meta = {
  title: "JalaliDatePicker/Plugins & Features",
};

export default meta;

// ۱. انتخاب زمان و ساعت (TimePicker Plugin)
export const TimePickerPlugin: StoryObj = {
  render: () => {
    const [time, setTime] = useState<JalaliTime>({
      hour: 14,
      minute: 30,
      second: 0,
    });

    return (
      <DatePickerThemeProvider mode="light">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <TimePicker
            value={time}
            onChange={setTime}
            showSeconds={true}
            digitType="persian"
          />
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            زمان انتخاب‌شده: {formatTimeString(time, true, "persian")}
          </div>
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۲. کلیدهای میانبر سریع (Presets / Shortcuts)
export const PresetsBarFeature: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<PresetValue | null>(null);

    return (
      <DatePickerThemeProvider mode="light">
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <PresetsBar
            selectedValue={selected}
            onSelectPreset={setSelected}
            orientation="vertical"
          />
          <div style={{ padding: "12px", fontSize: "13px", color: "#475569" }}>
            {selected
              ? Array.isArray(selected)
                ? `بازه: ${formatJalaliDate(selected[0])} تا ${formatJalaliDate(selected[1])}`
                : `تاریخ: ${formatJalaliDate(selected as JalaliDate)}`
              : "یک میانبر انتخاب کنید"}
          </div>
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۳. تقویم دوقلو برای بازه‌ها (Dual Month Calendar)
export const DualMonthCalendarView: StoryObj = {
  render: () => {
    const [range, setRange] = useState<JalaliDateRange>([null, null]);

    return (
      <DatePickerThemeProvider mode="light">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <DualMonthCalendar
            value={range}
            onChange={setRange}
            initialViewDate={{ year: 1405, month: 0 }}
          />
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            بازه انتخابی: {range[0] ? formatJalaliDate(range[0]) : "---"} تا{" "}
            {range[1] ? formatJalaliDate(range[1]) : "---"}
          </div>
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۴. ورودی متنی با ماسک خودکار (Masked Date Input)
export const MaskedTextInput: StoryObj = {
  render: () => {
    const [typedDate, setTypedDate] = useState<JalaliDate | null>(null);

    return (
      <DatePickerThemeProvider mode="light">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <MaskedDateInput
            digitType="persian"
            clearable={true}
            value={typedDate}
            onChange={setTypedDate}
          />
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            تاریخ تاییدشده:{" "}
            {typedDate
              ? formatJalaliDate(typedDate, "dddd D MMMM YYYY")
              : "تاریخ نامعتبر یا خالی"}
          </div>
        </div>
      </DatePickerThemeProvider>
    );
  },
};
