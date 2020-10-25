const defaultTheme = require("tailwindcss/defaultTheme");
const windmill = require("@saanuregh/react-ui/config");

module.exports = windmill({
  purge: [
    "src/**/*.js",
    "node_modules/@saanuregh/react-ui/lib/defaultTheme.js",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: ".65rem",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
    },
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
