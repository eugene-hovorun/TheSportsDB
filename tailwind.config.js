export default {
  content: ["./src/views/**/*.ejs", "./src/public/js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#38003c",
          light: "#e90052",
          accent: "#00ff87",
        },
      },
    },
  },
  plugins: [],
};
