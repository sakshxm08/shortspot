/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7fafc", // Light background
        text: "#2d3748", // Text color
        primary: {
          50: "#f0fdf9",
          100: "#cdfaec",
          200: "#9cf3da",
          300: "#62e6c5",
          400: "#32cfad",
          500: "#1abc9c",
          600: "#11907a",
          700: "#127362",
          800: "#135c51",
          900: "#154c44",
          950: "#052e29",
        },
      },
      boxShadow: {
        custom: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      },
    },
  },
  plugins: [],
};
