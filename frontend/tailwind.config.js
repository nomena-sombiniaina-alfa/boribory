/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
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
        canvas: "#faf9f6",
        surface: "#ffffff",
        ink: {
          900: "#1a1a1a",
          700: "#3a3a3a",
          500: "#737373",
          300: "#c8c8c8",
          200: "#e6e4de",
          100: "#efeee8",
        },
        accent: {
          DEFAULT: "#5d4fff",
          soft: "#ece9ff",
        },
      },
    },
  },
  plugins: [],
};
