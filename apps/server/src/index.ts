import "reflect-metadata";
import config from "./config";
import { applyApolloMiddleware } from "./middleware/apollo";
import { loadUserConfig } from "./lib/loadUserConfig";
import { startFileScan } from "./lib/startFileScan";
import EventEmitter from "events";
import { Events } from "./lib/eventEmitter";
import { startRabbitMq } from "./lib/startRabbitMq";
import { startCacheDB } from "./lib/startCacheDB";
import express from "express";
import { staticHandler } from "./middleware/static";
import { emailListHandler, emailViewHandler } from "./middleware/email";
import { applyAuthMiddleware } from "./middleware/auth";

async function main() {
  const event: Events = new EventEmitter();

  const userConfig = loadUserConfig();
  console.log("User Configuration loaded:");
  console.log(userConfig);

  /**
   * Start the mandatory services
   */
  await startCacheDB(event, userConfig);
  await startRabbitMq(event, userConfig, config.rabbitMq.url);
  await startFileScan(event, userConfig);

  /**
   * Start the API
   */
  const app = express();

  app.use(express.json());

  app.get("/static/*", staticHandler);

  // Only when we develop: it's easier to check the email templates
  // and develop them.
  app.get("/email", emailListHandler);
  app.get("/email/*", emailViewHandler);

  // Authentication routes
  applyAuthMiddleware(app);

  // Attach the Apollo middlewares
  applyApolloMiddleware(app, userConfig);

  app.listen({ port: config.serverApi.port }, () => {
    console.log(`API server started on port ${config.serverApi.port}.`);
  });
}

main();
