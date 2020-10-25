module.exports = {
  plugins: [
    require("tailwindcss"),
    require("postcss-flexbugs-fixes"),
    require("postcss-preset-env")({
      autoprefixer: {
        flexbox: "no-2009",
      },
      features: {
        "custom-properties": false,
      },
      stage: 3,
    }),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
