module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      gray: {
        darkest: "#2f3542",
        dark: "#383f51",
        DEFAULT: "#414a5e",
      },
      green: "#429634",
      pink: {
        dark: "#ff8695",
        DEFAULT: "#ffaab4",
      },
      red: "#e21c34",
      white: "#ffffff",
    },
    fontFamily: {
      sans: ["Spartan", "sans-serif"],
      accent: ["Rock Salt", "sans-serif"],
    },
  },
  plugins: [],
};
