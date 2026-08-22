import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JalaliDatePicker } from "../../src/components/JalaliDatePicker";
import { DatePickerThemeProvider } from "../../src/theme/ThemeProvider";
import { jsDateToJalali } from "../../src/core/jalali-helpers";

describe("JalaliDatePicker Component", () => {
  it("renders all 42 calendar cells in inline mode", () => {
    render(
      <DatePickerThemeProvider>
        <JalaliDatePicker variant="inline" />
      </DatePickerThemeProvider>,
    );

    const cells = screen.getAllByRole("gridcell");
    expect(cells).toHaveLength(42);
  });

  it("triggers onChange when clicking on a date cell", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <DatePickerThemeProvider>
        <JalaliDatePicker
          variant="inline"
          mode="single"
          initialViewDate={{ year: 1405, month: 0 }} // Farvardin 1405
          onChange={handleChange}
        />
      </DatePickerThemeProvider>,
    );

    // Click on 15 Farvardin
    const targetCell = screen.getByLabelText(/۱۵ فروردین ۱۴۰۵/);
    await user.click(targetCell);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const selectedDate = handleChange.mock.calls[0][0] as Date;
    expect(selectedDate).toBeInstanceOf(Date);
    expect(jsDateToJalali(selectedDate)).toEqual({
      year: 1405,
      month: 0,
      day: 15,
    });
  });

  it("toggles MonthYearPicker when clicking on header month/year title", async () => {
    const user = userEvent.setup();

    render(
      <DatePickerThemeProvider>
        <JalaliDatePicker
          variant="inline"
          initialViewDate={{ year: 1405, month: 0 }}
        />
      </DatePickerThemeProvider>,
    );

    // Header title button contains 'فروردین ۱۴۰۵'
    const headerBtn = screen.getByRole("button", { name: /فروردین ۱۴۰۵/ });
    await user.click(headerBtn);

    // Month picker options should now be visible (e.g. اردیبهشت)
    expect(screen.getByRole("button", { name: "اردیبهشت" })).toBeDefined();
  });

  it("selects the correct zero-based month from MonthYearPicker", async () => {
    const user = userEvent.setup();

    render(
      <DatePickerThemeProvider>
        <JalaliDatePicker
          variant="inline"
          initialViewDate={{ year: 1405, month: 0 }}
        />
      </DatePickerThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /فروردین ۱۴۰۵/ }));
    await user.click(screen.getByRole("button", { name: "اسفند" }));

    expect(screen.getByRole("grid", { name: /اسفند ۱۴۰۵/ })).toBeDefined();
  });

  it("closes a popover when the user clicks outside", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <JalaliDatePicker variant="popover" />
        <button type="button">بیرون</button>
      </div>,
    );

    await user.click(screen.getByRole("textbox"));
    expect(screen.getByRole("dialog", { name: "تقویم شمسی" })).toBeDefined();

    await user.click(screen.getByRole("button", { name: "بیرون" }));
    expect(
      screen.queryByRole("dialog", { name: "تقویم شمسی" }),
    ).toBeNull();
  });

  it("keeps outside-click closing configurable", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <JalaliDatePicker variant="popover" closeOnOutsideClick={false} />
        <button type="button">بیرون</button>
      </div>,
    );

    await user.click(screen.getByRole("textbox"));
    await user.click(screen.getByRole("button", { name: "بیرون" }));
    expect(screen.getByRole("dialog", { name: "تقویم شمسی" })).toBeDefined();
  });

  it("keeps modal backdrop closing configurable", async () => {
    const user = userEvent.setup();

    render(
      <JalaliDatePicker variant="modal" closeOnOutsideClick={false} />,
    );

    await user.click(screen.getByRole("textbox"));
    await user.click(screen.getByRole("presentation"));
    expect(screen.getByRole("dialog", { name: "تقویم شمسی" })).toBeDefined();
  });

  it("applies direction, classNames and inline style slots", () => {
    render(
      <JalaliDatePicker
        variant="inline"
        direction="ltr"
        enableTime
        classNames={{
          root: "custom-root",
          calendar: "custom-calendar",
          header: "custom-header",
          dayCell: "custom-day",
          timePicker: "custom-time",
        }}
        styles={{ calendar: { backgroundColor: "rgb(1, 2, 3)" } }}
      />,
    );

    const calendar = screen.getByRole("region", { name: "تقویم شمسی" });
    expect(calendar.getAttribute("dir")).toBe("ltr");
    expect(calendar.classList.contains("custom-calendar")).toBe(true);
    expect(calendar.style.backgroundColor).toBe("rgb(1, 2, 3)");
    expect(document.querySelector(".custom-root")).not.toBeNull();
    expect(document.querySelector(".custom-header")).not.toBeNull();
    expect(document.querySelector(".custom-day")).not.toBeNull();
    expect(document.querySelector(".custom-time")).not.toBeNull();
  });

  it("emits an updated Date when time changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <JalaliDatePicker
        variant="inline"
        mode="single"
        defaultValue={new Date(2026, 2, 21, 10, 30)}
        enableTime
        onChange={handleChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText("ساعت"), "5");

    const updatedDate = handleChange.mock.calls.at(-1)?.[0] as Date;
    expect(updatedDate).toBeInstanceOf(Date);
    expect(updatedDate.getHours()).toBe(5);
    expect(updatedDate.getMinutes()).toBe(30);
  });
});
