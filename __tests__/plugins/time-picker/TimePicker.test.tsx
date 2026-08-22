import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TimePicker } from "../../../src/plugins/time-picker/TimePicker";

describe("TimePicker", () => {
  it("renders Persian digits while keeping numeric option values", () => {
    render(
      <TimePicker
        value={{ hour: 5, minute: 7 }}
        digitType="persian"
        onChange={() => {}}
      />,
    );

    const hour = screen.getByLabelText("ساعت") as HTMLSelectElement;
    const minute = screen.getByLabelText("دقیقه") as HTMLSelectElement;
    expect(hour.value).toBe("5");
    expect(hour.selectedOptions[0].textContent).toBe("۰۵");
    expect(minute.selectedOptions[0].textContent).toBe("۰۷");
  });

  it("keeps a controlled value visible even when it is off-step", () => {
    render(
      <TimePicker
        value={{ hour: 10, minute: 7 }}
        minuteStep={15}
        onChange={() => {}}
      />,
    );

    const minute = screen.getByLabelText("دقیقه") as HTMLSelectElement;
    expect(minute.value).toBe("7");
  });

  it("supports a seconds step and normalizes invalid controlled segments", () => {
    render(
      <TimePicker
        value={{ hour: 99.5, minute: Number.NaN, second: 17 }}
        showSeconds
        secondStep={15}
      />,
    );

    expect((screen.getByLabelText("ساعت") as HTMLSelectElement).value).toBe(
      "23",
    );
    expect((screen.getByLabelText("دقیقه") as HTMLSelectElement).value).toBe(
      "0",
    );
    expect((screen.getByLabelText("ثانیه") as HTMLSelectElement).value).toBe(
      "17",
    );
  });

  it("supports uncontrolled selection and all style slots", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <TimePicker
        defaultValue={{ hour: 1, minute: 2 }}
        onChange={handleChange}
        classNames={{
          timePicker: "time-root",
          timeSelect: "time-select",
          timeLabel: "time-label",
        }}
        styles={{ timeSelect: { width: "72px" } }}
      />,
    );

    await user.selectOptions(screen.getByLabelText("ساعت"), "5");
    expect(handleChange).toHaveBeenLastCalledWith({
      hour: 5,
      minute: 2,
      second: 0,
    });
    expect(document.querySelector(".time-root")).not.toBeNull();
    expect(document.querySelector(".time-label")).not.toBeNull();
    expect(document.querySelectorAll(".time-select").length).toBe(2);
    expect(
      (screen.getByLabelText("ساعت") as HTMLSelectElement).style.width,
    ).toBe("72px");
  });
});
