const WorkerPlugin = require("worker-plugin");

module.exports = {
  entry: "src/index",
  plugins: [
    {
      resolve: "@poi/plugin-pwa",
      options: {},
    },
  ],
  configureWebpack: {
    node: {
      fs: "empty",
    },
    plugins: [new WorkerPlugin()],
  },
};
