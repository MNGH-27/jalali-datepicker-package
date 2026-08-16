import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DualMonthCalendar } from "../../src/components/dual-calendar/DualMonthCalendar";
import { DatePickerThemeProvider } from "../../src/theme/ThemeProvider";

describe("DualMonthCalendar Component", () => {
  it("renders two consecutive month panes (e.g. Farvardin & Ordibehesht)", () => {
    render(
      <DatePickerThemeProvider>
        <DualMonthCalendar
          initialViewDate={{ year: 1405, month: 0 }} // Farvardin 1405
        />
      </DatePickerThemeProvider>,
    );

    // Assert headers for both months are visible
    expect(screen.getByText(/فروردین ۱۴۰۵/)).toBeDefined();
    expect(screen.getByText(/اردیبهشت ۱۴۰۵/)).toBeDefined();

    // 42 cells per pane -> 84 total cells
    const cells = screen.getAllByRole("gridcell");
    expect(cells).toHaveLength(84);
  });

  it("selects date range across two different month panes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <DatePickerThemeProvider>
        <DualMonthCalendar
          initialViewDate={{ year: 1405, month: 0 }}
          onChange={handleChange}
        />
      </DatePickerThemeProvider>,
    );

    // 1. Click 20 Farvardin in first pane
    const cell1 = screen.getByLabelText(/۲۰ فروردین ۱۴۰۵/);
    await user.click(cell1);

    // 2. Click 10 Ordibehesht in second pane
    const cell2 = screen.getByLabelText(/۱۰ اردیبهشت ۱۴۰۵/);
    await user.click(cell2);

    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenLastCalledWith([
      { year: 1405, month: 0, day: 20 },
      { year: 1405, month: 1, day: 10 },
    ]);
  });

  it("shifts both month panes simultaneously on next/prev navigation", async () => {
    const user = userEvent.setup();

    render(
      <DatePickerThemeProvider>
        <DualMonthCalendar initialViewDate={{ year: 1405, month: 0 }} />
      </DatePickerThemeProvider>,
    );

    const nextBtn = screen.getByLabelText("ماه بعد");
    await user.click(nextBtn);

    // Now panes should display Ordibehesht and Khordad
    expect(screen.getByText(/اردیبهشت ۱۴۰۵/)).toBeDefined();
    expect(screen.getByText(/خرداد ۱۴۰۵/)).toBeDefined();
  });
});
