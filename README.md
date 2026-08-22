# @mngh/jalali-datepicker

A modern, headless-friendly Jalali (Persian/Shamsi) Date & Time Picker for React — zero date-library runtime dependencies, fully typed with native `Date` objects, WAI-ARIA accessible, and themeable with Tailwind CSS or CSS variables.

[![npm version](https://img.shields.io/npm/v/@mngh/jalali-datepicker.svg)](https://www.npmjs.com/package/@mngh/jalali-datepicker)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@mngh/jalali-datepicker)](https://bundlephobia.com/package/@mngh/jalali-datepicker)
[![license](https://img.shields.io/npm/l/@mngh/jalali-datepicker.svg)](https://github.com/mngh/jalali-datepicker/blob/main/LICENSE)
[![types](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://github.com/mngh/jalali-datepicker)

> **Repository:** [github.com/mngh/jalali-datepicker](https://github.com/mngh/jalali-datepicker)
> **Bundle size:** ~38 kB (CJS, unminified) / ~51 kB (ESM, unminified), highly tree-shakeable
> **Peer dependencies:** React 18 or 19

---

## 🌐 Live Interactive Demo

Try all features, props, themes, and picker modes interactively in your browser:

👉 **[Explore Live Demo & Playground](https://mngh-27.github.io/jalali-datepicker-package/)**

## Table of Contents

1. [Introduction & Quick Start](#1-introduction--quick-start)
2. [Core Concepts & Data Flow](#2-core-concepts--data-flow)
3. [Display Variants & Selection Modes](#3-display-variants--selection-modes)
4. [Built-in Plugins & Advanced Features](#4-built-in-plugins--advanced-features)
5. [Headless Hook Architecture](#5-headless-hook-architecture-usejalalidatepicker)
6. [Complete API Reference](#6-complete-api-reference)
7. [Theming & Styling](#7-theming--styling-integration)
8. [Accessibility & Keyboard Shortcuts](#8-accessibility--keyboard-shortcuts)

---

## 1. Introduction & Quick Start

### Why `@mngh/jalali-datepicker`?

- **Zero date-library overhead** — no Moment.js, no date-fns, no dayjs. The Jalali/Gregorian conversion math is implemented internally with plain arithmetic.
- **Native `Date` in, native `Date` out** — every prop and callback speaks standard JavaScript `Date` objects. You never touch a custom calendar object.
- **Three display variants** — inline, popover, and modal — and three selection modes — single, range, and multiple.
- **Headless-first** — the entire UI is built on top of a public hook (`useJalaliDatePicker`) that you can use to build your own component from scratch.
- **Accessible by default** — full keyboard navigation, roving tabindex, and ARIA roles (`grid`, `gridcell`, `dialog`) out of the box.
- **Themeable** — Tailwind CSS class slots and CSS custom properties, with a built-in `DatePickerThemeProvider` for light/dark mode.

### Installation

```bash
npm install @mngh/jalali-datepicker
```

```bash
pnpm add @mngh/jalali-datepicker
```

```bash
yarn add @mngh/jalali-datepicker
```

```bash
bun add @mngh/jalali-datepicker
```

### Quick Start

```tsx
import { useState } from "react";
import {
  JalaliDatePicker,
  DatePickerThemeProvider,
} from "@mngh/jalali-datepicker";

export default function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePickerThemeProvider mode="light">
      <JalaliDatePicker
        variant="popover"
        mode="single"
        value={date}
        onChange={setDate}
        placeholder="Select a date"
      />
    </DatePickerThemeProvider>
  );
}
```

That's it — `date` is always a plain JavaScript `Date` object (or `null`). No conversion helpers, no adapters.
The package ships with self-contained component styles, so there is no separate CSS file to import.

---

## 2. Core Concepts & Data Flow

### Standard JavaScript `Date` only

`@mngh/jalali-datepicker` never asks the consumer to construct or parse a custom Jalali object. Every value that crosses the public API boundary — `value`, `defaultValue`, `minDate`, `maxDate`, the `onChange` payload — is a native `Date`, or one of the following shapes depending on `mode`:

| `mode`       | Value shape                    | Example                                         |
| ------------ | ------------------------------ | ----------------------------------------------- |
| `'single'`   | `Date \| null`                 | `new Date(2026, 2, 21)`                         |
| `'range'`    | `[Date \| null, Date \| null]` | `[new Date(2026, 2, 21), new Date(2026, 3, 1)]` |
| `'multiple'` | `Date[]`                       | `[new Date(2026, 2, 21), new Date(2026, 5, 1)]` |

Internally, the picker converts a `Date` to a Jalali year/month/day triple purely for rendering the grid, and converts back to `Date` the instant a value leaves the component. The consumer's state never has to know Jalali math exists.

### Under-the-hood math

The Jalali↔Gregorian conversion is implemented with a self-contained arithmetic algorithm (based on the 33-year leap-year cycle of the Jalali calendar), so there's no dependency on `Intl`, ICU data, or a third-party calendar library. This keeps the bundle small and behavior consistent across browsers and server-side rendering environments.

### Digit presentation

Calendar cells, headers, and the masked text input can render either Persian (`۰-۹`) or Latin (`0-9`) digits:

```tsx
<JalaliDatePicker digitType="persian" /> // ۱۴۰۵/۰۱/۰۱
<JalaliDatePicker digitType="latin" />   // 1405/01/01
```

`digitType` defaults to `'persian'`.

---

## 3. Display Variants & Selection Modes

### Display variants (`variant`)

#### `'inline'`

Renders the calendar permanently in the page flow — ideal for embedding inside a form or sidebar without a trigger input.

```tsx
<JalaliDatePicker
  variant="inline"
  mode="single"
  value={date}
  onChange={setDate}
/>
```

#### `'popover'`

The default — a text input that opens a floating calendar panel on focus/click and closes on outside click or `Escape`.

```tsx
<JalaliDatePicker
  variant="popover"
  mode="single"
  value={date}
  onChange={setDate}
  placeholder="YYYY/MM/DD"
/>
```

#### `'modal'`

Opens the calendar in a full-screen dialog with a backdrop blur, scroll locking on `<body>`, and an `Escape` key listener that closes the dialog and returns focus to the trigger.

```tsx
<JalaliDatePicker
  variant="modal"
  mode="single"
  value={date}
  onChange={setDate}
/>
```

### Selection modes (`mode`)

#### `'single'`

```tsx
const [date, setDate] = useState<Date | null>(null);

<JalaliDatePicker mode="single" value={date} onChange={setDate} />;
```

#### `'range'`

Start/end selection with a live hover preview that highlights the would-be range as the pointer moves before the end date is confirmed.

```tsx
const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

<JalaliDatePicker
  mode="range"
  value={range}
  onChange={setRange}
  numberOfMonths={2}
/>;
```

#### `'multiple'`

Select any number of non-contiguous dates; clicking a selected date removes it.

```tsx
const [dates, setDates] = useState<Date[]>([]);

<JalaliDatePicker mode="multiple" value={dates} onChange={setDates} />;
```

---

## 4. Built-in Plugins & Advanced Features

### Dual month view

```tsx
<JalaliDatePicker
  mode="range"
  numberOfMonths={2}
  value={range}
  onChange={setRange}
/>
```

Renders two synchronized month grids side by side (or stacked on narrow viewports), sharing a single hover-preview state — the standard pattern for range pickers.

### Time picker integration

```tsx
const [date, setDate] = useState<Date | null>(null);
const [time, setTime] = useState<{
  hour: number;
  minute: number;
  second?: number;
}>({
  hour: 12,
  minute: 0,
});

<JalaliDatePicker
  mode="single"
  value={date}
  onChange={setDate}
  enableTime
  timeValue={time}
  onTimeChange={setTime}
  hourStep={1}
  minuteStep={5}
  showSeconds={false}
/>;
```

When `enableTime` is set, the resolved `Date` passed to `onChange` already has the selected hour/minute/second merged in — you don't need to combine `date` and `time` yourself.

| Prop           | Type                                                | Default     | Description                                     |
| -------------- | --------------------------------------------------- | ----------- | ----------------------------------------------- |
| `enableTime`   | `boolean`                                           | `false`     | Shows the time picker panel below the calendar. |
| `timeValue`    | `{ hour: number; minute: number; second?: number }` | `undefined` | Controlled time value.                          |
| `defaultTimeValue` | `{ hour: number; minute: number; second?: number }` | Date/current time | Initial uncontrolled time.              |
| `onTimeChange` | `(time) => void`                                    | `undefined` | Fires when the time inputs change.              |
| `hourStep`     | `number`                                            | `1`         | Increment for the hour control.                 |
| `minuteStep`   | `number`                                            | `1`         | Increment for the minute control.               |
| `secondStep`   | `number`                                            | `1`         | Increment for the seconds control.              |
| `showSeconds`  | `boolean`                                           | `false`     | Shows a seconds column.                         |

### Live masked input

```tsx
<JalaliDatePicker
  variant="popover"
  mode="single"
  value={date}
  onChange={setDate}
  useMaskedInput
/>
```

`useMaskedInput` turns the trigger `<input>` into a real-time Persian date mask: digits are inserted into the correct segment as the user types, slashes are auto-inserted, and an invalid segment (e.g. month `13`) is rejected without corrupting the rest of the string.

### Iranian solar holidays & Fridays

```tsx
<JalaliDatePicker
  mode="single"
  value={date}
  onChange={setDate}
  showHolidays
  customHolidays={[
    {
      date: { year: 1405, month: 0, day: 1 },
      title: "شرکت تعطیل است",
      isOff: true,
    },
  ]}
/>
```

When `showHolidays` is enabled, official Iranian solar-calendar holidays and every Friday are rendered in red with a hover/focus tooltip describing the occasion. `customHolidays` merges additional organization-specific dates into the same highlighting and tooltip system.

### Calendar events & badges

```tsx
<JalaliDatePicker
  mode="single"
  value={date}
  onChange={setDate}
  events={[
    {
      id: "standup",
      date: { year: 1405, month: 0, day: 1 },
      color: "blue",
      title: "Team standup",
    },
    {
      id: "deadline",
      date: { year: 1405, month: 0, day: 5 },
      color: "red",
      title: "Deadline",
    },
  ]}
/>
```

Each entry in `events` renders a small colored dot under the corresponding day cell. Its title is included in the cell's accessible label and native tooltip. Up to three event dots are shown per day.

### Footer status & action buttons

```tsx
<JalaliDatePicker
  mode="single"
  value={date}
  onChange={setDate}
  showFooter
  showStatusText
  showActions
  onConfirm={(value) => console.log("confirmed:", value)}
/>
```

| Prop             | Type              | Default                    | Description                                                                                                                                                               |
| ---------------- | ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `showFooter`     | `boolean`         | `false`                    | Master switch for the footer row.                                                                                                                                         |
| `showStatusText` | `boolean`         | `true` (when footer shown) | Shows a human-readable summary of the current selection, e.g. "5 days selected".                                                                                          |
| `showActions`    | `boolean`         | `true` (when footer shown) | Shows the **Today**, **Clear**, and **Confirm** buttons.                                                                                                                  |
| `onConfirm`      | `(value) => void` | `undefined`                | Fires when **Confirm** is clicked, with the currently pending selection. Useful when you want selection to be provisional until confirmed, especially in `modal` variant. |

---

## 5. Headless Hook Architecture (`useJalaliDatePicker`)

For teams that need a completely custom UI — a bespoke calendar layout, a non-standard interaction pattern, or integration into an existing design system — `@mngh/jalali-datepicker` exposes the same state machine that powers its default components as a standalone hook.

```tsx
import { useJalaliDatePicker } from "@mngh/jalali-datepicker";

function CustomCalendar() {
  const {
    viewYear,
    viewMonth,
    grid,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    setHoverDate,
    clear,
  } = useJalaliDatePicker({
    mode: "single",
    value: null,
    onChange: (date) => console.log(date),
  });

  return (
    <div role="grid" aria-label={`${viewYear}/${viewMonth + 1}`}>
      <header>
        <button onClick={goToPrevMonth} aria-label="Previous month">
          ‹
        </button>
        <span>
          {viewYear}/{viewMonth + 1}
        </span>
        <button onClick={goToNextMonth} aria-label="Next month">
          ›
        </button>
      </header>

      <div className="grid grid-cols-7">
        {grid.map((cell) => (
          <button
            key={`${cell.jalali.year}-${cell.jalali.month}-${cell.jalali.day}`}
            role="gridcell"
            disabled={cell.isDisabled || !cell.isCurrentMonth}
            aria-selected={cell.isSelected}
            data-today={cell.isToday}
            onMouseEnter={() => setHoverDate(cell.jalali)}
            onMouseLeave={() => setHoverDate(null)}
            onClick={() => selectDate(cell.jalali)}
          >
            {cell.dayNumber}
          </button>
        ))}
      </div>

      <footer>
        <button onClick={goToToday}>Today</button>
        <button onClick={clear}>Clear</button>
      </footer>
    </div>
  );
}
```

### Hook return values

| Value                             | Type                           | Description                                                                                                  |
| --------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `viewYear`                        | `number`                       | The Jalali year currently displayed.                                                                         |
| `viewMonth`                       | `number`                       | The Jalali month (0-indexed) currently displayed.                                                            |
| `grid`                            | `JalaliCalendarCell[]`         | Flattened 42-cell array, including leading/trailing adjacent-month days.                                     |
| `selected`                        | `InternalSelectedValue`        | Current Jalali selection, shaped according to `mode`.                                                        |
| `hoverDate`                       | `JalaliDate \| null`           | Date currently under the pointer, used for range-preview rendering.                                         |
| `goToPrevMonth` / `goToNextMonth` | `() => void`                   | Step the view by one month.                                                                                  |
| `goToToday`                       | `() => void`                   | Reset the view to the month containing today.                                                                |
| `setView`                         | `(year, month) => void`        | Jump to a specific Jalali year and zero-based month.                                                         |
| `selectDate`                      | `(date: JalaliDate) => void`  | Commit a date into the current selection according to `mode`.                                                |
| `setHoverDate`                    | `(date: JalaliDate \| null) => void` | Update the hover-preview date (used for range mode).                                                  |
| `clear`                           | `() => void`                   | Reset the selection to its empty state (`null`, `[null, null]`, or `[]`).                                    |

---

## 6. Complete API Reference

### `JalaliDatePickerProps`

| Prop                 | Type                                                     | Default                        | Description                                                 |
| -------------------- | -------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------- |
| `variant`            | `'inline' \| 'popover' \| 'modal'`                       | `'inline'`                     | How the calendar is presented.                              |
| `mode`               | `'single' \| 'range' \| 'multiple'`                      | `'single'`                     | Selection strategy.                                         |
| `value`              | `Date \| null \| [Date \| null, Date \| null] \| Date[]` | —                              | Controlled value, shaped by `mode`.                         |
| `defaultValue`       | same as `value`                                          | `null` / `[null, null]` / `[]` | Uncontrolled initial value.                                 |
| `onChange`           | `(value) => void`                                        | —                              | Fires whenever the selection changes.                       |
| `minDate`            | `Date`                                                   | `undefined`                    | Earliest selectable date.                                   |
| `maxDate`            | `Date`                                                   | `undefined`                    | Latest selectable date.                                     |
| `isDateDisabled`     | `(date: Date) => boolean`                                | `undefined`                    | Custom predicate to disable arbitrary dates.                |
| `digitType`          | `'persian' \| 'latin'`                                   | `'persian'`                    | Digit glyphs used throughout the UI.                        |
| `direction`          | `'rtl' \| 'ltr'`                                         | `'rtl'`                        | Layout and horizontal keyboard direction.                   |
| `firstDayOfWeek`     | `0 \| 1 \| ... \| 6`                                    | `0` (Saturday)                 | First day shown in each week.                               |
| `initialViewDate`    | `Date \| JalaliDate`                                     | selected date / today          | Initial visible Jalali month.                               |
| `numberOfMonths`     | `1 \| 2`                                                 | `1`                            | Number of side-by-side month grids.                         |
| `enableTime`         | `boolean`                                                | `false`                        | Enables the time picker panel.                              |
| `timeValue`          | `JalaliTime \| null`                                     | `undefined`                    | Controlled time-of-day value; `null` resolves to `00:00`.   |
| `defaultTimeValue`   | `JalaliTime`                                             | date time / current time       | Initial uncontrolled time value.                            |
| `onTimeChange`       | `(time: JalaliTime) => void`                             | `undefined`                    | Fires when the time changes.                                |
| `hourStep`           | `number`                                                 | `1`                            | Hour increment step.                                        |
| `minuteStep`         | `number`                                                 | `1`                            | Minute increment step.                                      |
| `secondStep`         | `number`                                                 | `1`                            | Second increment step.                                      |
| `showSeconds`        | `boolean`                                                | `false`                        | Show a seconds column in the time picker.                   |
| `useMaskedInput`     | `boolean`                                                | `false`                        | Enables the live typing mask on the trigger input.          |
| `showHolidays`       | `boolean`                                                | `false`                        | Highlights official holidays and Fridays.                   |
| `customHolidays`     | `CustomHolidayRule[]`                                    | `[]`                           | Additional holiday rules to highlight.                      |
| `events`             | `CalendarEvent[]`                                        | `[]`                           | Event dots/badges rendered on matching day cells.           |
| `showFooter`         | `boolean`                                                | `false`                        | Shows the footer row.                                       |
| `showStatusText`     | `boolean`                                                | `true`                         | Shows the selection-summary text in the footer.             |
| `showActions`        | `boolean`                                                | `true`                         | Shows Today/Clear/Confirm buttons in the footer.            |
| `onConfirm`          | `(value) => void`                                        | `undefined`                    | Fires when Confirm is pressed.                              |
| `placeholder`        | `string`                                                 | `'انتخاب تاریخ...'`            | Placeholder text for the trigger input (`popover`/`modal`). |
| `closeOnOutsideClick`| `boolean`                                                | `true`                         | Closes popover/modal when its outside area is clicked.      |
| `closeOnEscape`      | `boolean`                                                | `true`                         | Closes popover/modal when Escape is pressed.                |
| `onOpenChange`       | `(open: boolean) => void`                                | `undefined`                    | Reports open-state changes.                                 |
| `className` / `style`| `string` / `CSSProperties`                               | `undefined`                    | Root wrapper overrides.                                     |
| `classNames`         | `DatePickerClassNames`                                   | `{}`                           | Per-slot class names.                                       |
| `styles`             | `DatePickerStyles`                                       | `{}`                           | Per-slot inline style overrides.                            |

### Style slots (`classNames` & `styles`)

Both `classNames` and `styles` accept the same set of slot keys, letting you target any part of the picker with Tailwind classes or inline styles respectively.

| Slot key | Targets |
| -------- | ------- |
| `root` | Outermost wrapper element. |
| `input`, `inputWrapper`, `inputClearButton` | Trigger input and masked-input controls. |
| `calendar`, `calendarBody`, `calendarPanes`, `calendarPane`, `paneDivider` | Calendar panel and one/two-month layout. |
| `header`, `headerTitle`, `navButton` | Month/year header controls. |
| `weekdays`, `weekdayCell`, `grid` | Weekday row and date grid. |
| `dayCell`, `outsideMonthCell`, `todayCell`, `selectedCell`, `disabledCell`, `holidayCell` | Base and state-specific day cells. |
| `rangeBetweenCell`, `rangeStartCell`, `rangeEndCell` | Range-selection states. |
| `eventBadges`, `eventBadge` | Event indicator wrapper and dots. |
| `monthYearPicker`, `yearList`, `yearButton`, `selectedYearButton` | Year picker elements. |
| `monthGrid`, `monthButton`, `selectedMonthButton` | Month picker elements. |
| `timePicker`, `timeLabel`, `timeControls`, `timeSelect`, `timeSeparator` | Time-picker elements. |
| `footer`, `footerStatus`, `footerActions` | Footer layout and status. |
| `todayButton`, `clearButton`, `confirmButton` | Footer action buttons. |
| `modalBackdrop`, `closeButton` | Modal backdrop and close control. |

```tsx
<JalaliDatePicker
  classNames={{
    root: "font-sans",
    input: "rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500",
    selectedCell: "bg-blue-600 text-white",
    todayCell: "ring-1 ring-blue-400",
    holidayCell: "text-red-500",
  }}
/>
```

### Exported TypeScript interfaces & types

```ts
export type SelectedDateValue =
  | Date
  | null
  | [Date | null, Date | null]
  | Date[];

export type DateRange = [Date | null, Date | null];

export interface JalaliDate {
  year: number;
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  day: number;
}

export interface JalaliTime {
  hour: number;
  minute: number;
  second?: number;
}

export interface CalendarEvent {
  id: string;
  date: JalaliDate;
  title: string;
  description?: string;
  color?: string;
}

export interface CustomHolidayRule {
  date: JalaliDate;
  title: string;
  isOff?: boolean;
}

export interface JalaliCalendarCell {
  jalali: JalaliDate;
  gregorianDate: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
}

export type DatePickerClassNames = DatePickerSlots<string>;
export type DatePickerStyles = DatePickerSlots<React.CSSProperties>;
```

---

## 7. Theming & Styling Integration

### `DatePickerThemeProvider`

Wrap your app (or just the picker) in `DatePickerThemeProvider` to switch between light and dark palettes:

```tsx
import { DatePickerThemeProvider } from "@mngh/jalali-datepicker";

<DatePickerThemeProvider mode="dark">
  <JalaliDatePicker mode="single" value={date} onChange={setDate} />
</DatePickerThemeProvider>;
```

| Prop          | Type                 | Default   | Description                              |
| ------------- | -------------------- | --------- | ---------------------------------------- |
| `mode`        | `'light' \| 'dark'`  | `'light'` | Selects the built-in color palette.      |
| `customTheme` | `DeepPartial<Theme>` | `undefined` | Overrides colors, radii, or shadows.   |

### Sizing variables

The root exposes three layout variables. Override them with `style` or `styles.root` to resize the date grid without breaking its column math:

```css
.large-picker {
  --pdp-cell-size: 42px;
  --pdp-cell-gap: 5px;
  --pdp-calendar-pane-width: 324px; /* 7 × 42 + 6 × 5 */
}
```

Use `customTheme` for palette changes:

```tsx
<DatePickerThemeProvider
  customTheme={{
    colors: { primary: "#0f766e", primaryHover: "#115e59" },
    radii: { lg: "12px" },
  }}
>
  <JalaliDatePicker className="large-picker" />
</DatePickerThemeProvider>
```

### Tailwind CSS via `classNames`

Every meaningful element has a class slot for Tailwind or regular CSS. Built-in defaults are inline styles, so use `styles` when overriding the same CSS property; use `classNames` for selectors, states, and properties not already set inline.

```tsx
<JalaliDatePicker
  classNames={{
    calendar: "shadow-xl border border-slate-200 rounded-2xl p-4",
    header: "flex items-center justify-between mb-2",
    dayCell: "h-9 w-9 rounded-full hover:bg-slate-100 transition-colors",
    selectedCell: "bg-indigo-600 text-white hover:bg-indigo-600",
  }}
/>
```

---

## 8. Accessibility & Keyboard Shortcuts

The calendar grid uses `role="grid"` / `role="gridcell"` with a roving `tabindex`. Escape closes popover/modal variants and restores focus to the trigger.

| Key                                 | Action                                                                                                   |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `Arrow Left` / `Arrow Right`        | Move focus one day (respects the `direction` prop).                                                       |
| `Arrow Up` / `Arrow Down`           | Move focus one week.                                                                                     |
| `Page Up` / `Page Down`             | Move focus to the same day in the previous/next month.                                                   |
| `Home`                              | Move focus to the first day of the current month.                                                        |
| `End`                               | Move focus to the last day of the current month.                                                         |
| `Enter` / `Space`                   | Select the focused date.                                                                                 |
| `Escape`                            | Close the `popover` or `modal` panel and return focus to the trigger.                                    |
| `Tab` / `Shift + Tab`               | Move focus through the available controls in document order.                                            |

> **Note:** With `direction="rtl"`, `Arrow Left`/`Arrow Right` are swapped automatically so the keys match visual travel.

> **Tip:** `modal` variant applies `aria-modal="true"` and `role="dialog"`, and locks background scroll via a `overflow: hidden` toggle on `<body>` while open.
