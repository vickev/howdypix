// Load env variables
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
require("dotenv").config();

export type AppConfig = {
  rabbitMQ: {
    url: string;
    retry: boolean;
  };
  processing: {
    nbThreads: number;
  };
};

type Config = {
  app: AppConfig;
};

// eslint-disable-next-line
const config: Config = require("config");

export const appConfig = config.app;
