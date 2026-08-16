import { describe, it, expect } from "vitest";
import {
  formatTimeSegment,
  formatTimeString,
  clampTime,
} from "./../../../src/plugins/time-picker";

describe("TimePicker Utilities", () => {
  it("formats digits to Persian properly", () => {
    expect(formatTimeSegment(5, "persian")).toBe("۰۵");
    expect(formatTimeSegment(14, "persian")).toBe("۱۴");
  });

  it("formats digits to Latin properly", () => {
    expect(formatTimeSegment(5, "latin")).toBe("05");
    expect(formatTimeSegment(14, "latin")).toBe("14");
  });

  it("formats complete time string with and without seconds", () => {
    const time = { hour: 9, minute: 5, second: 3 };
    expect(formatTimeString(time, false, "latin")).toBe("09:05");
    expect(formatTimeString(time, true, "latin")).toBe("09:05:03");
    expect(formatTimeString(time, false, "persian")).toBe("۰۹:۰۵");
  });

  it("clamps out of bounds time segments", () => {
    expect(clampTime({ hour: 25, minute: 70, second: -5 })).toEqual({
      hour: 23,
      minute: 59,
      second: 0,
    });
  });
});
