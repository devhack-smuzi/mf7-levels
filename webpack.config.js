const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack');
const deps = require("./package.json").dependencies;
const env = process.env.NODE_ENV || 'development';

module.exports = {
  entry: "./src/index",
  cache: false,

  mode: "development",
  devtool: "source-map",

  optimization: {
    minimize: false,
  },

  output: {
    publicPath: env === 'production' ? '/widget/levels/' : 'auto',
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
        ],
      },
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "mf7Levels",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./MF7Levels": "./src/Levels",
        "./MF7Bundle": "./src/Bundle",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      chunks: ["main"],
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru|en-gb/),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};