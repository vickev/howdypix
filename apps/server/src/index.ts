import "reflect-metadata";
import { EventEmitter } from "events";
import express from "express";
import { applyAuthMiddleware } from "./modules/auth";
import { appConfig, userConfig } from "./lib/config";
import { applyApolloMiddleware } from "./modules/graphql";
import { startCacheDB, startFileScan, startRabbitMq } from "./services";
import { Events } from "./lib/eventEmitter";
import { staticHandler } from "./modules/static";
import { emailListHandler, emailViewHandler } from "./modules/email";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { createAppStore, initializeStore } from "./datastore/state";
import { initializeDatabase } from "./datastore/database/initialize";
import { initializeLowDb } from "./datastore/lowdb";

async function main(): Promise<void> {
  const event: Events = new EventEmitter();

  // eslint-disable-next-line no-console
  console.log("User Configuration loaded:");
  // eslint-disable-next-line no-console
  console.log(userConfig);
  // eslint-disable-next-line no-console
  console.log(appConfig);

  // Create App Store
  const store = createAppStore();

  // Open the DB connection
  const connection = initializeDatabase(appConfig.database, store, event);
  await connection.connect();

  // Initialize the store
  await initializeStore(store, connection, initializeLowDb());

  /**
   * Start the mandatory services
   */
  await startCacheDB(event, userConfig, connection);
  await startRabbitMq(event, userConfig, appConfig.rabbitMQ);
  await startFileScan(event, userConfig);

  /**
   * Start the API
   */
  const app = express();

  app.use(express.json());

  app.get("/files/*", staticHandler);

  // Only when we develop: it's easier to check the email templates
  // and develop them.
  app.get("/email", emailListHandler);
  app.get("/email/*", emailViewHandler);

  // Authentication routes
  applyAuthMiddleware(app);

  // Attach the Apollo middlewares
  applyApolloMiddleware(app, appConfig, userConfig, connection, store);

  app.listen({ port: appConfig.api.port }, () => {
    // eslint-disable-next-line no-console
    console.log(`API server started on port ${appConfig.api.port}.`);
  });
}

main();
