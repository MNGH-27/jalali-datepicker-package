import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useJalaliDatePicker } from "../../src/hooks/useJalaliDatePicker";
import type { JalaliDate } from "../../src/core/types";

describe("Headless Hook - useJalaliDatePicker", () => {
  const sampleDate1: JalaliDate = { year: 1405, month: 0, day: 10 }; // 10 Farvardin 1405
  const sampleDate2: JalaliDate = { year: 1405, month: 0, day: 20 }; // 20 Farvardin 1405

  describe("Single Mode", () => {
    it("initializes with default value and updates on selectDate", () => {
      const { result } = renderHook(() =>
        useJalaliDatePicker({
          mode: "single",
          defaultValue: sampleDate1,
        }),
      );

      expect(result.current.selected).toEqual(sampleDate1);
      expect(result.current.isDateSelected(sampleDate1)).toBe(true);

      act(() => {
        result.current.selectDate(sampleDate2);
      });

      expect(result.current.selected).toEqual(sampleDate2);
      expect(result.current.isDateSelected(sampleDate1)).toBe(false);
      expect(result.current.isDateSelected(sampleDate2)).toBe(true);
    });
  });

  describe("Range Mode", () => {
    it("sets range start on first click and completes range on second click", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useJalaliDatePicker({
          mode: "range",
          onChange,
        }),
      );

      // 1. Click Start Date
      act(() => {
        result.current.selectDate(sampleDate1);
      });

      expect(result.current.selected).toEqual([sampleDate1, null]);

      // 2. Click End Date
      act(() => {
        result.current.selectDate(sampleDate2);
      });

      expect(result.current.selected).toEqual([sampleDate1, sampleDate2]);
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it("auto-swaps dates if second selection is earlier than first", () => {
      const { result } = renderHook(() =>
        useJalaliDatePicker({
          mode: "range",
        }),
      );

      // Select 20th first, then 10th
      act(() => {
        result.current.selectDate(sampleDate2);
      });
      act(() => {
        result.current.selectDate(sampleDate1);
      });

      // Should automatically order [sampleDate1, sampleDate2]
      expect(result.current.selected).toEqual([sampleDate1, sampleDate2]);
    });
  });

  describe("Multiple Mode", () => {
    it("toggles dates in and out of selection list", () => {
      const { result } = renderHook(() =>
        useJalaliDatePicker({
          mode: "multiple",
        }),
      );

      // Add date 1
      act(() => {
        result.current.selectDate(sampleDate1);
      });
      expect(result.current.selected).toEqual([sampleDate1]);

      // Add date 2
      act(() => {
        result.current.selectDate(sampleDate2);
      });
      expect(result.current.selected).toEqual([sampleDate1, sampleDate2]);

      // Click date 1 again (toggle off)
      act(() => {
        result.current.selectDate(sampleDate1);
      });
      expect(result.current.selected).toEqual([sampleDate2]);
    });
  });

  describe("Navigation", () => {
    it("correctly increments and decrements months with year rollover", () => {
      const { result } = renderHook(() =>
        useJalaliDatePicker({
          initialViewDate: { year: 1405, month: 11 }, // Esfand 1405
        }),
      );

      act(() => {
        result.current.goToNextMonth();
      });

      expect(result.current.viewYear).toBe(1406);
      expect(result.current.viewMonth).toBe(0); // Farvardin 1406

      act(() => {
        result.current.goToPrevMonth();
      });

      expect(result.current.viewYear).toBe(1405);
      expect(result.current.viewMonth).toBe(11);
    });
  });
});
