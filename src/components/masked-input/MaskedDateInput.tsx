import React, { useState, useEffect, useCallback, useRef } from "react";
import type { MaskedDateInputProps, DateValidationError } from "./types";
import { applyDateMask, parseAndValidateJalaliString } from "./mask-utils";
import { formatJalaliDate } from "../../formatters/jalali-formatter";
import type { JalaliDate } from "../../core/types";
import { useTheme } from "../../theme/ThemeProvider";

export const MaskedDateInput: React.FC<MaskedDateInputProps> = ({
  value,
  defaultValue = null,
  onChange,
  onValidationError,
  digitType = "persian",
  minDate,
  maxDate,
  isDateDisabled,
  clearable = true,
  placeholder = "۱۴۰۵/۰۱/۱۵",
  disabled = false,
  direction = "rtl",
  wrapperClassName,
  wrapperStyle,
  clearButtonClassName,
  clearButtonStyle,
  style,
  ...restProps
}) => {
  const { theme } = useTheme();
  const [internalValue, setInternalValue] = useState<JalaliDate | null>(
    defaultValue,
  );
  const activeDate = value !== undefined ? value : internalValue;

  const [text, setText] = useState<string>(() => {
    return activeDate
      ? formatJalaliDate(activeDate, "YYYY/MM/DD", { digitType })
      : "";
  });

  const [hasError, setHasError] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync text input with incoming controlled value updates
  useEffect(() => {
    if (value !== undefined) {
      setText(
        value ? formatJalaliDate(value, "YYYY/MM/DD", { digitType }) : "",
      );
      setHasError(false);
    }
  }, [value, digitType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const maskedVal = applyDateMask(rawVal, digitType);
    setText(maskedVal);

    // Validate only if complete date is typed (10 chars: YYYY/MM/DD) or empty
    if (maskedVal.length === 10 || maskedVal.length === 0) {
      const result = parseAndValidateJalaliString(
        maskedVal,
        minDate,
        maxDate,
        isDateDisabled,
      );

      if (result.isValid) {
        setHasError(false);
        onValidationError?.(null);
        if (value === undefined) {
          setInternalValue(result.date);
        }
        onChange?.(result.date);
      } else {
        setHasError(true);
        onValidationError?.(result.error as DateValidationError);
      }
    } else {
      // Incomplete state
      setHasError(false);
      onValidationError?.(null);
    }
  };

  const handleClear = useCallback(() => {
    setText("");
    setHasError(false);
    onValidationError?.(null);
    if (value === undefined) {
      setInternalValue(null);
    }
    onChange?.(null);
    inputRef.current?.focus();
  }, [value, onChange, onValidationError]);

  return (
    <div
      dir={direction}
      className={wrapperClassName}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        ...wrapperStyle,
      }}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        disabled={disabled}
        placeholder={digitType === "persian" ? placeholder : "1405/01/15"}
        value={text}
        onChange={handleInputChange}
        style={{
          width: "180px",
          padding: "8px 12px",
          paddingInlineEnd: clearable && text ? "32px" : "12px",
          borderRadius: theme.radii.sm,
          border: `1px solid ${hasError ? theme.colors.holiday : theme.colors.border}`,
          backgroundColor: theme.colors.background,
          color: theme.colors.textPrimary,
          fontSize: "14px",
          fontFamily: "inherit",
          outlineColor: theme.colors.primary,
          textAlign: "center",
          letterSpacing: "1px",
          transition: "border-color 0.15s ease",
          ...style,
        }}
        {...restProps}
      />

      {/* Clear Button */}
      {clearable && text && !disabled && (
        <button
          type="button"
          aria-label="پاک کردن"
          onClick={handleClear}
          className={clearButtonClassName}
          style={{
            position: "absolute",
            insetInlineEnd: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.colors.textSecondary,
            fontSize: "14px",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2px",
            ...clearButtonStyle,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
