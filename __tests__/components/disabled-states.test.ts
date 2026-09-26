import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DayCell } from "../../src/components/DayCell";
import { MonthYearPicker } from "../../src/components/MonthYearPicker";
import { jalaliToGregorian } from "../../src/core/jalali-math";

describe("disabled calendar states", () => {
  it("renders a disabled day with its state class and style", () => {
    render(
      React.createElement(DayCell, {
        cell: {
          jalali: { year: 1405, month: 0, day: 10 },
          gregorianDate: jalaliToGregorian(1405, 0, 10),
          dayNumber: 10,
          isCurrentMonth: true,
          isToday: false,
          isSelected: false,
          isDisabled: true,
        },
        classNames: { disabledCell: "is-disabled" },
        styles: { disabledCell: { opacity: 0.25 } },
        onSelect: () => undefined,
      }),
    );

    const day = screen.getByRole("gridcell");
    expect(day).toHaveProperty("disabled", true);
    expect(day.classList.contains("is-disabled")).toBe(true);
    expect(day.style.cursor).toBe("not-allowed");
    expect(day.style.opacity).toBe("0.25");
  });

  it("disables unavailable months and years", () => {
    render(
      React.createElement(MonthYearPicker, {
        currentYear: 1405,
        currentMonth: 5,
        minDate: { year: 1405, month: 5, day: 10 },
        maxDate: { year: 1406, month: 2, day: 20 },
        onSelectMonth: () => undefined,
        onSelectYear: () => undefined,
      }),
    );

    expect(screen.getByRole("button", { name: "مرداد" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(screen.getByRole("button", { name: "شهریور" })).toHaveProperty(
      "disabled",
      false,
    );

    fireEvent.click(screen.getByRole("button", { name: "۱۴۰۵" }));
    expect(screen.getByRole("button", { name: "۱۴۰۴" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(screen.getByRole("button", { name: "۱۴۰۶" })).toHaveProperty(
      "disabled",
      false,
    );
    expect(screen.getByRole("button", { name: "۱۴۰۷" })).toHaveProperty(
      "disabled",
      true,
    );
  });
});
