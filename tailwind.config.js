const windmill = require("@windmill/react-ui/config");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = windmill({
  purge: [
    "src/**/*.js",
    "node_modules/@windmill/react-ui/lib/defaultTheme.js",
    "node_modules/@windmill/react-ui/dist/index.js",
  ],
  theme: {
    extend: {
      fontSize: {
        xxxs: ".45rem",
        xxs: ".65rem",
      },
      width: {
        800: "800px",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
      colors: {
        primary: {
          100: "#def7ec",
          200: "#bcf0da",
          300: "#84e1bc",
          400: "#31c48d",
          500: "#0e9f6e",
          600: "#057a55",
          700: "#046c4e",
          800: "#03543f",
          900: "#014737",
        },
        gray: {
          100: "#FBFAFC",
          200: "#F7F5FA",
          300: "#F1EDF7",
          400: "#DFDAE8",
          500: "#BFB8CC",
          600: "#9187A1",
          700: "#7D728F",
          800: "#6A5F7A",
          900: "#453C52",
        },
      },
    },
  },
  variants: {
    boxShadow: ["responsive", "hover", "focus", "dark:focus", "focus-within"],
    outline: ["responsive", "focus", "hover", "active", "focus-within"],
  },
  experimental: {
    applyComplexClasses: true,
  },
  plugins: [
    require("tailwind-css-variables")({
      colors: "color",
      screens: false,
      fontFamily: false,
      fontSize: false,
      fontWeight: false,
      lineHeight: false,
      letterSpacing: false,
      backgroundSize: false,
      borderWidth: false,
      borderRadius: false,
      width: false,
      height: false,
      minWidth: false,
      minHeight: false,
      maxWidth: false,
      maxHeight: false,
      padding: false,
      margin: false,
      boxShadow: false,
      zIndex: false,
      opacity: false,
    }),
  ],
});
