import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { JalaliDatePicker } from "../../src/components/JalaliDatePicker";
import { DualMonthCalendar } from "../../src/components/dual-calendar/DualMonthCalendar";

afterEach(() => cleanup());

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

  it("portals and repositions popovers that would overflow the viewport", async () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function () {
        if (this.classList.contains("portal-root")) {
          return {
            x: 900,
            y: 50,
            top: 50,
            right: 1050,
            bottom: 90,
            left: 900,
            width: 150,
            height: 40,
            toJSON: () => undefined,
          } as DOMRect;
        }
        if (this.getAttribute("aria-label") === "تقویم شمسی") {
          return {
            x: 0,
            y: 0,
            top: 0,
            right: 568,
            bottom: 400,
            left: 0,
            width: 568,
            height: 400,
            toJSON: () => undefined,
          } as DOMRect;
        }
        return {
          x: 0,
          y: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: 0,
          height: 0,
          toJSON: () => undefined,
        } as DOMRect;
      });
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });

    render(
      React.createElement(JalaliDatePicker, {
        variant: "popover",
        numberOfMonths: 2,
        className: "portal-root",
      }),
    );
    fireEvent.click(screen.getByRole("textbox"));

    const calendar = await screen.findByRole("region", {
      name: "تقویم شمسی",
    });
    await waitFor(() => expect(calendar.style.visibility).toBe("visible"));
    expect(calendar.parentElement).toBe(document.body);
    expect(calendar.style.position).toBe("fixed");
    expect(calendar.style.left).toBe("444px");

    rectSpy.mockRestore();
  });
});
