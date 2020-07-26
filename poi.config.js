const WorkerPlugin = require("worker-plugin");

module.exports = {
  entry: "src/index",
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
};
