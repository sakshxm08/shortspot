/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a202c", // Dark gray
        secondary: "#2d3748", // Slightly lighter gray
        accent: "#4a5568", // Even lighter gray
        background: "#f7fafc", // Light background
        text: "#2d3748", // Text color
      },
      boxShadow: {
        custom: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      },
    },
  },
  plugins: [],
};
