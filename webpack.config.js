const path = require("path");
module.exports = (env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",

  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: "./src/index.ts",

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
    ],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] },

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"), // Compile into a folder called "dist"
  },
});
