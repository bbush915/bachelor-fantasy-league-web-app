const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./index.html", "./src/**/*.vue"],
  darkMode: false,
  theme: {
    extend: {},
    colors: {
      ...colors,
      gray: {
        darkest: "#2f3542",
        dark: "#383f51",
        DEFAULT: "#414a5e",
      },
      red: "#e21c34",
      pink: "#ff8695",
      green: "#429634",
    },
    fontFamily: {
      sans: ["Spartan", "sans-serif"],
      accent: ["Rock Salt", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
