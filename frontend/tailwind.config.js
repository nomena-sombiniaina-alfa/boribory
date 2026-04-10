/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        sidebar: "rgb(var(--sidebar) / <alpha-value>)",
        ink: {
          100: "rgb(var(--ink-100) / <alpha-value>)",
          200: "rgb(var(--ink-200) / <alpha-value>)",
          300: "rgb(var(--ink-300) / <alpha-value>)",
          400: "rgb(var(--ink-400) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          soft: "rgb(var(--primary-soft) / <alpha-value>)",
          fg: "rgb(var(--primary-fg) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
        },
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      boxShadow: {
        card: "0 1px 2px rgb(var(--shadow-rgb) / 0.08), 0 1px 3px rgb(var(--shadow-rgb) / 0.06)",
        input:
          "0 1px 2px rgb(var(--shadow-rgb) / 0.08), 0 2px 8px rgb(var(--shadow-rgb) / 0.06)",
        pop: "0 4px 16px rgb(var(--shadow-rgb) / 0.12), 0 2px 4px rgb(var(--shadow-rgb) / 0.08)",
        glow: "0 0 24px rgb(var(--primary) / 0.25)",
      },
    },
  },
  plugins: [],
};
