// src/components/MonthYearPicker.tsx
import React, { useState } from 'react';
import { PERSIAN_MONTH_NAMES } from '../core/constants';
import { toPersianDigits } from '../formatters/persian-digits';
import type { JalaliMonthIndex } from '../core/types';
import type { DatePickerClassNames, DatePickerStyles } from '../theme/style-slots';

export interface MonthYearPickerProps {
  currentYear: number;
  currentMonth: number;
  yearRangeCount?: number;
  onSelectMonth: (month: JalaliMonthIndex) => void;
  onSelectYear: (year: number) => void;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  currentYear,
  currentMonth,
  yearRangeCount = 100,
  onSelectMonth,
  onSelectYear,
  classNames,
  styles,
}) => {
  const [viewMode, setViewMode] = useState<'months' | 'years'>('months');

  // Page size for years view grid (12 years per view)
  const PAGE_SIZE = 12;

  // Calculate page start year anchored around the current year
  const [pageStartYear, setPageStartYear] = useState<number>(() => {
    return Math.floor(currentYear / PAGE_SIZE) * PAGE_SIZE;
  });

  const minYear = currentYear - Math.floor(yearRangeCount / 2);
  const maxYear = currentYear + Math.floor(yearRangeCount / 2);

  const handlePrevYearPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPageStartYear((prev) => Math.max(minYear, prev - PAGE_SIZE));
  };

  const handleNextYearPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPageStartYear((prev) => Math.min(maxYear - PAGE_SIZE, prev + PAGE_SIZE));
  };

  const yearsList = Array.from({ length: PAGE_SIZE }, (_, i) => pageStartYear + i);

  return (
    <div
      className={classNames?.calendar}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '8px',
        width: '100%',
        height: '245px', // Fixed height matching the day grid
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        ...styles?.calendar,
      }}
    >
      {/* Top Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 4px',
          borderBottom: '1px solid var(--pdp-surface-border, #e2e8f0)',
          minHeight: '32px',
        }}
      >
        <button
          type="button"
          onClick={handlePrevYearPage}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            color: 'var(--pdp-text-primary, #0f172a)',
            fontSize: '14px',
            fontWeight: 700,
          }}
          aria-label="Previous Years"
        >
          ❯
        </button>

        {/* Mode Toggle Button */}
        <button
          type="button"
          onClick={() => setViewMode((prev) => (prev === 'months' ? 'years' : 'months'))}
          style={{
            background: 'var(--pdp-surface-subtle, #f1f5f9)',
            border: '1px solid var(--pdp-surface-border, #e2e8f0)',
            borderRadius: '6px',
            padding: '4px 10px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--pdp-text-primary, #0f172a)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>
            {viewMode === 'months'
              ? toPersianDigits(currentYear)
              : `${toPersianDigits(pageStartYear)} - ${toPersianDigits(pageStartYear + PAGE_SIZE - 1)}`}
          </span>
          <span style={{ fontSize: '10px', opacity: 0.6 }}>
            {viewMode === 'months' ? '▼' : '▲'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleNextYearPage}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            color: 'var(--pdp-text-primary, #0f172a)',
            fontSize: '14px',
            fontWeight: 700,
          }}
          aria-label="Next Years"
        >
          ❮
        </button>
      </div>

      {/* Grid Content: 12 Items (3x4 Matrix) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '6px',
          flex: 1,
        }}
      >
        {viewMode === 'months'
          ? PERSIAN_MONTH_NAMES.map((name, index) => {
              const isSelected = index === currentMonth;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onSelectMonth(index as JalaliMonthIndex)}
                  style={{
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? 'var(--pdp-primary, #4f46e5)' : 'var(--pdp-surface-subtle, #f1f5f9)',
                    color: isSelected ? '#ffffff' : 'var(--pdp-text-primary, #0f172a)',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {name}
                </button>
              );
            })
          : yearsList.map((year) => {
              const isSelected = year === currentYear;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    onSelectYear(year);
                    setViewMode('months');
                  }}
                  style={{
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? 'var(--pdp-primary, #4f46e5)' : 'var(--pdp-surface-subtle, #f1f5f9)',
                    color: isSelected ? '#ffffff' : 'var(--pdp-text-primary, #0f172a)',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {toPersianDigits(year)}
                </button>
              );
            })}
      </div>
    </div>
  );
};
