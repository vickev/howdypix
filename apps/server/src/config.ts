// Load env variables
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
require("dotenv").config();

export type User = {
  email: string;
  name: string;
};

export type UserConfig = {
  photoDirs: { [sourceId: string]: string };
  thumbnailsDir: string;
  users: User[];
  emailSender: User;
};

export type AppConfig = {
  rabbitMQ: {
    url: string;
    retry: boolean;
  };
  api: {
    baseUrl: string;
    port: number;
  };
  webapp: {
    baseUrl: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    password: string;
    tls: boolean;
  };
  auth: {
    code: {
      secret: string;
      expiry: string;
    };
    token: {
      secret: string;
      expiry: string;
    };
    refreshToken: {
      secret: string;
      expiry: string;
    };
  };
};

type Config = {
  user: UserConfig;
  app: AppConfig;
};

// eslint-disable-next-line
const config: Config = require("config");

export const userConfig = config.user;
export const appConfig = config.app;
