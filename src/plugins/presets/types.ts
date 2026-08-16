import type { JalaliDate } from "../../core/types";
import type { JalaliDateRange } from "../../hooks/types";

import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../../theme/style-slots";

/**
 * Supported preset target value types (single date or date range).
 */
export type PresetValue = JalaliDate | JalaliDateRange;

/**
 * Definition of an individual preset shortcut.
 */
export interface DatePickerPreset {
  /** Unique identifier for keying and active state checks. */
  id: string;
  /** Display label (e.g., 'امروز', 'این هفته', '۳۰ روز گذشته'). */
  label: string;
  /** Dynamic getter function returning the date or range. */
  getValue: () => PresetValue;
}

/**
 * Configuration props for the PresetsBar component.
 */
export interface PresetsBarProps {
  /** Custom list of presets. If omitted, default Persian presets are used. */
  presets?: DatePickerPreset[];
  /** Callback fired when a preset button is clicked. */
  onSelectPreset: (value: PresetValue) => void;
  /** Currently selected value to compute active highlight state. */
  selectedValue?: PresetValue | null;
  /** Visual placement orientation of the presets bar. */
  orientation?: "vertical" | "horizontal";
  /** Digit formatting for default preset labels if applicable. */
  digitType?: "persian" | "latin";
  /** Whether preset selection is disabled. */
  disabled?: boolean;

  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}
