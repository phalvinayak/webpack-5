const commonConfig = require("./webpack.common.config");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const glob = require("glob");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(commonConfig, {
  output: {
    filename: "js/[name].[contenthash:12].js",
    publicPath: "/static/",
  },
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["imagemin-mozjpeg", { quality: 40 }],
              [
                "imagemin-pngquant",
                {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
              ],
              ["imagemin-gifsicle", { interlaced: true }],
              [
                "imagemin-svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
        // generator: [
        //   {
        //     type: "asset",
        //     preset: "webp-custom-name",
        //     implementation: ImageMinimizerPlugin.imageminGenerate,
        //     options: {
        //       plugins: ["imagemin-webp"],
        //     },
        //   },
        // ],
      }),
    ],
    splitChunks: {
      chunks: "all",
      maxSize: Infinity,
      minSize: 2000,
      cacheGroups: {
        jquery: {
          test: /[\\/]node_modules[\\/]jquery[\\/]/,
          name: "jquery",
        },
        bootstrap: {
          test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
          name: "bootstrap",
        },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
          name: "lodash-es",
        },
        node_modules: {
          test: /[\\/]node_modules[\\/]/,
          name: "node_modules",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[hash:base64]",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "./images/[name].[contenthash:12][ext]",
        },
        /*use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                quality: 40,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],*/
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash:12].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "../src")}/**/*`, {
        nodir: true,
      }),
    }),
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css)$/,
    }),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css)$/,
      compressionOptions: { level: 11 },
    }),
  ],
});
