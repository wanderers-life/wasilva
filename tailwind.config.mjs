/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sinhala: [
          '"Noto Sans Sinhala"',
          "Iskoola Pota",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#fdf8f0",
          100: "#f9edda",
          200: "#f2d8b0",
          300: "#e9be7d",
          400: "#e0a34e",
          500: "#d88c2c",
          600: "#c97721",
          700: "#a75d1e",
          800: "#864b20",
          900: "#6d3e1d",
          950: "#3b1f0e",
        },
        ink: {
          50: "#f7f5f0",
          100: "#eae5d8",
          200: "#d5ccb3",
          300: "#bcae89",
          400: "#a89467",
          500: "#9a8354",
          600: "#846e48",
          700: "#6b573d",
          800: "#594837",
          900: "#4d3e32",
          950: "#2b211a",
        },
        cream: {
          50: "#fefcf5",
          100: "#fdf7e6",
          200: "#f9edc4",
          300: "#f4df98",
          400: "#edcc63",
          500: "#e7b838",
          600: "#daa12a",
          700: "#b57e21",
          800: "#906520",
          900: "#75531f",
          950: "#402d0e",
        },
      },
    },
  },
  plugins: [],
};
