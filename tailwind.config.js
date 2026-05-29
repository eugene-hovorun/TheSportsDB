export default {
  content: ["./src/views/**/*.ejs", "./src/client/**/*.{vue,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#005fcc",
          light: "#e90052",
          accent: "#0077FF",
        },
      },
    },
  },
  plugins: [],
};
