// vite.config.demo.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "demo"),
  resolve: {
    alias: {
      "@mngh/jalali-datepicker": path.resolve(__dirname, "src/index.ts"),
    },
  },
  server: {
    port: 5173,
    open: true,
    watch: {
      usePolling: true, // اطمینان از تشخیص تغییرات فایل‌ها در لینوکس
    },
    fs: {
      allow: [
        // اجازه دسترسی و واچ به کل پوشه پروژه و سورس‌ها
        path.resolve(__dirname),
      ],
    },
  },
  optimizeDeps: {
    // جلوگیری از کش شدن پکیج داخلی
    exclude: ["@mngh/jalali-datepicker"],
  },
});
