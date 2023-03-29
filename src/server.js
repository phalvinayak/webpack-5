const path = require("path");
const express = require("express");
const expressStaticGzip = require("express-static-gzip");
const app = express();

if (process.env.NODE_ENV === "dev") {
  console.log("Development Mode");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const configuration = require("../webpack/webpack.dev.config");
  const webpack = require("webpack");
  const webpackCompiler = webpack(configuration);

  app.use(
    webpackDevMiddleware(webpackCompiler, configuration.devServer.devMiddleware)
  );

  app.use(
    webpackDevMiddleware(webpackCompiler, configuration.devServer.devMiddleware)
  );
}

app.get("/", (req, res) => {
  const absolutePathToHtmlFile = path.resolve(__dirname, "../dist/index.html");
  res.sendFile(absolutePathToHtmlFile);
});

app.use(
  "/static",
  expressStaticGzip(path.resolve(__dirname, "../dist"), {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
  })
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Application is running on http://localhost:${PORT}/`);
});
