export default {
  content: ["./src/views/**/*.ejs", "./src/client/**/*.{vue,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#0053b3",
          light: "#e90052",
          accent: "#ff9f1a",
        },
      },
    },
  },
  plugins: [],
};
