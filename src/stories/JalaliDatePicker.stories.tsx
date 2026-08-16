import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  JalaliDatePicker,
  type JalaliDatePickerProps,
} from "../components/JalaliDatePicker";
import { DatePickerThemeProvider } from "../theme/ThemeProvider";
import type { JalaliDate } from "../core/types";
import type { JalaliDateRange } from "../hooks/types";
import { formatJalaliDate } from "../formatters/jalali-formatter";

const meta: Meta<typeof JalaliDatePicker> = {
  title: "JalaliDatePicker/Core",
  component: JalaliDatePicker,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["inline", "popover"],
    },
    digitType: {
      control: "radio",
      options: ["persian", "latin"],
    },
  },
};

export default meta;

// ۱. حالت تک انتخابی (Single Inline)
export const SingleSelection: StoryObj<JalaliDatePickerProps<"single">> = {
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<JalaliDate | null>({
      year: 1405,
      month: 0,
      day: 15,
    });

    const { value, defaultValue, onChange, ...restArgs } = args;

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
          <JalaliDatePicker
            {...restArgs}
            mode="single"
            variant={args.variant ?? "inline"}
            value={selectedDate}
            onChange={(d) => {
              setSelectedDate(d);
              args.onChange?.(d);
            }}
          />
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            تاریخ انتخابی: {formatJalaliDate(selectedDate, "dddd D MMMM YYYY")}
          </div>
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۲. حالت پاپ‌اور با اینپوت کلیک‌خور (Popover Mode)
export const PopoverMode: StoryObj<JalaliDatePickerProps<"single">> = {
  render: (args) => {
    const [date, setDate] = useState<JalaliDate | null>(null);
    const { value, defaultValue, onChange, ...restArgs } = args;

    return (
      <DatePickerThemeProvider mode="light">
        <div style={{ height: "380px", paddingTop: "20px" }}>
          <JalaliDatePicker
            {...restArgs}
            mode="single"
            variant="popover"
            placeholder="جهت انتخاب تاریخ کلیک کنید..."
            value={date}
            onChange={(d) => {
              setDate(d);
              args.onChange?.(d);
            }}
          />
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۳. حالت انتخاب بازه تاریخی (Range Selection)
export const RangeSelection: StoryObj<JalaliDatePickerProps<"range">> = {
  render: (args) => {
    const [range, setRange] = useState<JalaliDateRange>([
      { year: 1405, month: 0, day: 5 },
      { year: 1405, month: 0, day: 20 },
    ]);

    const { value, defaultValue, onChange, mode, ...restArgs } = args;

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
          <JalaliDatePicker
            {...restArgs}
            mode="range"
            variant={args.variant ?? "inline"}
            value={range}
            onChange={(r) => {
              setRange(r);
              args.onChange?.(r);
            }}
          />
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            بازه انتخابی: {formatJalaliDate(range[0])} تا{" "}
            {formatJalaliDate(range[1])}
          </div>
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۴. حالت چند انتخابی (Multiple Dates)
export const MultipleSelection: StoryObj<JalaliDatePickerProps<"multiple">> = {
  render: (args) => {
    const [dates, setDates] = useState<JalaliDate[]>([]);
    const { value, defaultValue, onChange, mode, ...restArgs } = args;

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
          <JalaliDatePicker
            {...restArgs}
            mode="multiple"
            variant={args.variant ?? "inline"}
            value={dates}
            onChange={(list) => {
              setDates(list);
              args.onChange?.(list);
            }}
          />
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            تعداد روزهای انتخاب‌شده: {dates.length}
          </div>
        </div>
      </DatePickerThemeProvider>
    );
  },
};

// ۵. تم تاریک (Dark Mode)
export const DarkTheme: StoryObj<JalaliDatePickerProps<"single">> = {
  render: (args) => {
    const { value, defaultValue, onChange, ...restArgs } = args;

    return (
      <div
        style={{ background: "#090d16", padding: "24px", borderRadius: "12px" }}
      >
        <DatePickerThemeProvider mode="dark">
          <JalaliDatePicker {...restArgs} mode="single" variant="inline" />
        </DatePickerThemeProvider>
      </div>
    );
  },
};
