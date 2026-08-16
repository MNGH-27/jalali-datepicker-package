import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JalaliDatePicker } from "../../src/components/JalaliDatePicker";
import { DatePickerThemeProvider } from "../../src/theme/ThemeProvider";

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
    expect(handleChange).toHaveBeenCalledWith({
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
});
