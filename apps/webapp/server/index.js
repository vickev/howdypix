const express = require("express");
const nextI18NextMiddleware = require("next-i18next/middleware").default;
const nextI18next = require("./i18n");
const next = require("next");
const proxy = require("http-proxy-middleware");
const { serverRuntimeConfig } = require("../next.config");

const port = serverRuntimeConfig.port;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));

  server.use(
    "/graphql",
    proxy({ target: serverRuntimeConfig.serverApollo.url, changeOrigin: true })
  );

  server.get("*", (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
