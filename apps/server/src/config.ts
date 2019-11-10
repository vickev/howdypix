// Load env variables
require("dotenv").config();

const config = {
  rabbitMq: {
    url: process.env.RABBITMQ_URL ?? "amqp://localhost"
  },
  serverHttp: {
    baseUrl: "",
    port: parseInt(process.env.HTTP_PORT as string) ?? 3004
  },
  serverApollo: {
    port: parseInt(process.env.APOLLO_PORT as string) ?? 4005
  },
  auth: {
    code: {
      secret: "secret_code_string",
      expiry: "2h"
    },
    token: {
      secret: "secret_token_string",
      expiry: "4h"
    },
    refreshToken: {
      secret: "secret_refresh_string",
      expiry: "30d"
    }
  }
};

config.serverHttp.baseUrl =
  process.env.HTTP_BASE_URL ?? `http://localhost:${config.serverHttp.port}`;

export default config;
