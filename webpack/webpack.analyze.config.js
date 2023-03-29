const production = require("./webpack.prod.config");
const { merge } = require("webpack-merge");
const BundleAnalyzePlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(production, {
  plugins: [
    new BundleAnalyzePlugin({
      analyzerMode: "server",
      openAnalyzer: true,
    }),
  ],
});
