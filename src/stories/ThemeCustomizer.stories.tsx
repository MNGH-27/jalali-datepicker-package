import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  JalaliDatePicker,
  type JalaliDatePickerProps,
} from "../components/JalaliDatePicker";
import { DatePickerThemeProvider } from "../theme/ThemeProvider";
import type { JalaliDate } from "../core/types";
import type { JalaliDateRange } from "../hooks/types";
import type { JalaliTime } from "../plugins/time-picker/types";
import type { CalendarEvent } from "../events/types";

const meta: Meta<typeof JalaliDatePicker> = {
  title: "JalaliDatePicker/AllFeatures",
  component: JalaliDatePicker,
  tags: ["autodocs"],
};

export default meta;

// ۱. تقویم کامل به همراه ساعت و فوتر داخلی (DateTime + Footer)
export const FullDateTimeWithFooter: StoryObj<JalaliDatePickerProps<"single">> =
  {
    render: () => {
      const [date, setDate] = useState<JalaliDate | null>({
        year: 1405,
        month: 0,
        day: 15,
      });
      const [time, setTime] = useState<JalaliTime>({
        hour: 14,
        minute: 30,
        second: 0,
      });

      return (
        <DatePickerThemeProvider mode="light">
          <JalaliDatePicker
            mode="single"
            variant="inline"
            enableTime={true}
            showSeconds={true}
            showFooter={true}
            showStatusText={true}
            showActions={true}
            value={date}
            timeValue={time}
            onChange={setDate}
            onTimeChange={setTime}
          />
        </DatePickerThemeProvider>
      );
    },
  };

// ۲. تقویم دوقلو بازه‌ای همراه با کلیدهای میانبر (Dual Month + Presets)
export const DualMonthWithPresets: StoryObj<JalaliDatePickerProps<"range">> = {
  render: () => {
    const [range, setRange] = useState<JalaliDateRange>([
      { year: 1405, month: 0, day: 5 },
      { year: 1405, month: 1, day: 12 },
    ]);

    return (
      <DatePickerThemeProvider mode="light">
        <JalaliDatePicker
          mode="range"
          variant="inline"
          numberOfMonths={2}
          enablePresets={true}
          presetsOrientation="vertical"
          showFooter={true}
          value={range}
          onChange={setRange}
        />
      </DatePickerThemeProvider>
    );
  },
};

// ۳. حالت دیالوگ مدال واقعی با Backdrop (Modal Variant)
export const ModalWithBackdrop: StoryObj<JalaliDatePickerProps<"single">> = {
  render: () => {
    const [date, setDate] = useState<JalaliDate | null>(null);

    return (
      <DatePickerThemeProvider mode="light">
        <div style={{ padding: "20px" }}>
          <JalaliDatePicker
            mode="single"
            variant="modal"
            placeholder="جهت باز شدن مودال کلیک کنید..."
            showFooter={true}
            enableTime={true}
            value={date}
            onChange={setDate}
          />
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۴. رویدادها، اعلان‌ها و تعطیلات رسمی (Holidays + Events + Badges + Tooltip)
export const HolidaysAndEvents: StoryObj<JalaliDatePickerProps<"single">> = {
  render: () => {
    const [date, setDate] = useState<JalaliDate | null>({
      year: 1405,
      month: 0,
      day: 1,
    });

    const sampleEvents: CalendarEvent[] = [
      {
        id: "1",
        date: { year: 1405, month: 0, day: 1 },
        title: "جلسه شروع سال جدید",
        description: "ساعت ۱۰ صبح با تیم فنی",
        color: "#10b981", // سبز
      },
      {
        id: "2",
        date: { year: 1405, month: 0, day: 15 },
        title: "موعد تحویل پروژه (Deadline)",
        description: "ارسال نسخه نهایی به کارفرما",
        color: "#ef4444", // قرمز
      },
      {
        id: "3",
        date: { year: 1405, month: 0, day: 22 },
        title: "سالگرد تاسیس شرکت",
        color: "#f59e0b", // نارنجی
      },
    ];

    return (
      <DatePickerThemeProvider mode="light">
        <JalaliDatePicker
          mode="single"
          variant="inline"
          showHolidays={true}
          events={sampleEvents}
          showFooter={true}
          value={date}
          onChange={setDate}
        />
      </DatePickerThemeProvider>
    );
  },
};

// ۵. پاپ‌اور با ورودی متنی ماسک‌دار و تایپ زنده (Popover + Masked Input)
export const PopoverMaskedInput: StoryObj<JalaliDatePickerProps<"single">> = {
  render: () => {
    const [date, setDate] = useState<JalaliDate | null>(null);

    return (
      <DatePickerThemeProvider mode="light">
        <div style={{ height: "360px", paddingTop: "20px" }}>
          <JalaliDatePicker
            mode="single"
            variant="popover"
            useMaskedInput={true}
            showFooter={true}
            value={date}
            onChange={setDate}
          />
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۶. تم تاریک جامع (Dark Mode)
export const FullDarkMode: StoryObj<JalaliDatePickerProps<"single">> = {
  render: () => {
    const [date, setDate] = useState<JalaliDate | null>({
      year: 1405,
      month: 0,
      day: 10,
    });
    const [time, setTime] = useState<JalaliTime>({ hour: 20, minute: 15 });

    return (
      <div
        style={{
          backgroundColor: "#090d16",
          padding: "24px",
          borderRadius: "12px",
        }}
      >
        <DatePickerThemeProvider mode="dark">
          <JalaliDatePicker
            mode="single"
            variant="inline"
            enableTime={true}
            showFooter={true}
            showHolidays={true}
            enablePresets={true}
            value={date}
            timeValue={time}
            onChange={setDate}
            onTimeChange={setTime}
          />
        </DatePickerThemeProvider>
      </div>
    );
  },
};
