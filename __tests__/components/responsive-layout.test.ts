import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { JalaliDatePicker } from "../../src/components/JalaliDatePicker";
import { DualMonthCalendar } from "../../src/components/dual-calendar/DualMonthCalendar";

describe("responsive calendar layouts", () => {
  it("lets the main calendar panes wrap and shrink to the available width", () => {
    render(
      React.createElement(JalaliDatePicker, {
        variant: "inline",
        numberOfMonths: 2,
        classNames: { calendarPanes: "responsive-panes" },
      }),
    );

    const calendar = screen.getByRole("region", { name: "تقویم شمسی" });
    const panes = document.querySelector<HTMLElement>(".responsive-panes");
    const firstCell = screen.getAllByRole("gridcell")[0]
      .parentElement as HTMLElement;

    expect(calendar.style.maxWidth).toBe("100%");
    expect(calendar.style.overflowX).toBe("hidden");
    expect(panes?.style.flexWrap).toBe("wrap");
    expect(firstCell.style.width).toBe("100%");
    expect(firstCell.style.aspectRatio).toBe("1 / 1");
  });

  it("lets the standalone dual calendar stack its fluid month panes", () => {
    render(
      React.createElement(DualMonthCalendar, {
        classNames: {
          calendarPane: "responsive-pane",
          grid: "responsive-grid",
        },
      }),
    );

    const calendar = screen.getByRole("region", {
      name: "تقویم دوقلو شمسی",
    });
    const pane = document.querySelector<HTMLElement>(".responsive-pane");
    const grid = document.querySelector<HTMLElement>(".responsive-grid");

    expect(calendar.style.maxWidth).toBe("100%");
    expect(calendar.style.flexWrap).toBe("wrap");
    expect(pane?.style.maxWidth).toBe("100%");
    expect(pane?.style.minWidth).toBe("0px");
    expect(grid?.style.gridTemplateColumns).toBe(
      "repeat(7, minmax(0, 1fr))",
    );
  });
});
