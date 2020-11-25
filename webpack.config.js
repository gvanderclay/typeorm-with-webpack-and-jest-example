const path = require("path");
const nodeExternals = require("webpack-node-externals");

const entry = { dist: "./index.ts" };

module.exports = {
  mode: process.env.NODE_ENV ? process.env.NODE_ENV : "development",
  target: "node",
  devtool: "inline-source-map",
  entry: entry,
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
      },
    ],
  },
};
