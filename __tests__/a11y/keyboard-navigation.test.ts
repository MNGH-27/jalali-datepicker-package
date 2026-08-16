import { describe, it, expect } from "vitest";
import { calculateNextFocusedDate } from "../../src/a11y/keyboard-navigation";
import { JalaliDate } from "../../src/core/types";

describe("Accessibility - Keyboard Navigation", () => {
  const startDay: JalaliDate = { year: 1405, month: 0, day: 15 }; // 15 Farvardin

  it("moves to next day on ArrowLeft in RTL mode", () => {
    const result = calculateNextFocusedDate({
      currentFocused: startDay,
      key: "ArrowLeft",
      isRtl: true,
    });

    expect(result.handled).toBe(true);
    expect(result.nextDate.day).toBe(16);
  });

  it("moves to previous day on ArrowRight in RTL mode", () => {
    const result = calculateNextFocusedDate({
      currentFocused: startDay,
      key: "ArrowRight",
      isRtl: true,
    });

    expect(result.handled).toBe(true);
    expect(result.nextDate.day).toBe(14);
  });

  it("moves backward/forward 1 week on ArrowUp and ArrowDown", () => {
    const upResult = calculateNextFocusedDate({
      currentFocused: startDay,
      key: "ArrowUp",
    });
    expect(upResult.nextDate.day).toBe(8);

    const downResult = calculateNextFocusedDate({
      currentFocused: startDay,
      key: "ArrowDown",
    });
    expect(downResult.nextDate.day).toBe(22);
  });

  it("jumps month and shifts year on boundary overflow (Esfand -> Farvardin)", () => {
    const lastDayEsfand: JalaliDate = { year: 1404, month: 11, day: 29 };
    const result = calculateNextFocusedDate({
      currentFocused: lastDayEsfand,
      key: "ArrowLeft", // RTL next day
      isRtl: true,
    });

    expect(result.nextDate).toEqual({ year: 1405, month: 0, day: 1 });
    expect(result.viewChanged).toBe(true);
  });

  it("jumps to start and end of month on Home and End", () => {
    const homeResult = calculateNextFocusedDate({
      currentFocused: startDay,
      key: "Home",
    });
    expect(homeResult.nextDate.day).toBe(1);

    const endResult = calculateNextFocusedDate({
      currentFocused: startDay, // Farvardin has 31 days
      key: "End",
    });
    expect(endResult.nextDate.day).toBe(31);
  });
});
