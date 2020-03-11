import "reflect-metadata";
import EventEmitter from "events";
import express from "express";
import { createConnection } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { userConfig, appConfig } from "./config";
import { applyApolloMiddleware } from "./middleware/apollo";
import { startFileScan } from "./lib/startFileScan";
import { Events } from "./lib/eventEmitter";
import { startRabbitMq } from "./lib/startRabbitMq";
import { startCacheDB } from "./lib/startCacheDB";
import { staticHandler } from "./middleware/static";
import { emailListHandler, emailViewHandler } from "./middleware/email";
import { applyAuthMiddleware } from "./middleware/auth";
import ormConfig from "../ormconfig.json";

async function main(): Promise<void> {
  const event: Events = new EventEmitter();

  // eslint-disable-next-line no-console
  console.log("User Configuration loaded:");
  // eslint-disable-next-line no-console
  console.log(userConfig);
  console.log(appConfig);

  // Open the DB connection
  const connection = await createConnection({
    ...(ormConfig as SqliteConnectionOptions)
  });

  /**
   * Start the mandatory services
   */
  await startCacheDB(event, userConfig, connection);
  await startRabbitMq(event, userConfig, appConfig.rabbitMQ.url);
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
  applyApolloMiddleware(app, appConfig, userConfig, connection);

  app.listen({ port: appConfig.api.port }, () => {
    // eslint-disable-next-line no-console
    console.log(`API server started on port ${appConfig.api.port}.`);
  });
}

main();
