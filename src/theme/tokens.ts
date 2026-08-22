// src/theme/tokens.ts
import type { Theme } from './types';

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#4f46e5',              // Indigo-600
    primaryHover: '#4338ca',         // Indigo-700
    primaryText: '#ffffff',          // متن سفید روی رنگ اصلی
    background: '#ffffff',          // پس‌زمینه اصلی تقویم و اینپوت
    backgroundHover: '#f1f5f9',      // Slate-100 برای هاور دکمه‌ها
    surface: '#f8fafc',              // Slate-50 برای فوتر و کادرهای فرعی
    border: '#e2e8f0',               // Slate-200 برای خطوط و بردرها
    textPrimary: '#0f172a',          // Slate-900 (مشکی تیره برای روزها و عناوین)
    textSecondary: '#64748b',        // Slate-500 (خاکستری برای نام روزهای هفته و متون کمکی)
    textDisabled: '#cbd5e1',         // Slate-300 (برای روزهای ماه قبل و بعد)
    holiday: '#e11d48',              // Rose-600 (رنگ جمعه‌ها و روزهای تعطیل)
    holidayBackground: '#fff1f2',    // Rose-50 (هاور روزهای تعطیل)
    rangeBackground: '#e0e7ff',      // Indigo-100 (پس‌زمینه بازه انتخاب‌شده)
    todayBorder: '#4f46e5',          // حاشیه دور روز جاری
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryText: '#ffffff',
    background: '#0f172a',
    backgroundHover: '#1e293b',
    surface: '#1e293b',
    border: '#334155',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textDisabled: '#475569',
    holiday: '#fb7185',
    holidayBackground: '#4c0519',
    rangeBackground: '#312e81',
    todayBorder: '#818cf8',
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  },
};
