const WorkerPlugin = require("worker-plugin");

module.exports = {
  entry: "src/index",
  reactRefresh: true,
  plugins: [
    {
      resolve: "@poi/plugin-pwa",
      options: {
        workboxOptions: {
          clientsClaim: true,
          skipWaiting: true,
        },
      },
    },
  ],
  configureWebpack: {
    output: { globalObject: "self" },
    node: {
      fs: "empty",
    },
    plugins: [new WorkerPlugin()],
  },
  devServer: {
    proxy: {
      "/api": {
        target: "https://careapi.coronasafe.network",
        changeOrigin: true,
      },
    },
  },
};
