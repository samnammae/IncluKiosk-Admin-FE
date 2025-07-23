/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // 다크모드 활성화 (class 방식)
  theme: {
    extend: {
      colors: {
        // 메인 브랜드 컬러 (파란색 계열)
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // 기본 파란색
          600: "#2563eb", // 조금 진한 파란색
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // 중성 컬러 (그레이 계열)
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // 성공/에러/경고 컬러
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
        },
        error: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
    },
  },
  plugins: [],
};
