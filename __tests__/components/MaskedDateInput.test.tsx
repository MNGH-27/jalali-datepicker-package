import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MaskedDateInput } from "../../src/components/masked-input/MaskedDateInput";
import { DatePickerThemeProvider } from "../../src/theme/ThemeProvider";

describe("MaskedDateInput Component", () => {
  it("formats typed numbers with auto slashes and fires onChange on complete date", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <DatePickerThemeProvider>
        <MaskedDateInput onChange={handleChange} digitType="latin" />
      </DatePickerThemeProvider>,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "14050115");

    expect(input).toHaveValue("1405/01/15");
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({
      year: 1405,
      month: 0,
      day: 15,
    });
  });

  it("clears text and calls onChange(null) when clicking clear button", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <DatePickerThemeProvider>
        <MaskedDateInput
          defaultValue={{ year: 1405, month: 0, day: 1 }}
          onChange={handleChange}
        />
      </DatePickerThemeProvider>,
    );

    const clearBtn = screen.getByLabelText("پاک کردن");
    await user.click(clearBtn);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
    expect(handleChange).toHaveBeenCalledWith(null);
  });
});
