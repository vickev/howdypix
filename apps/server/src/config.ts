// Load env variables
require("dotenv").config();

const config = {
  rabbitMq: {
    url: process.env.RABBITMQ_URL || "amqp://localhost"
  },
  serverApi: {
    baseUrl: "",
    port: parseInt(process.env.API_PORT as string) || 3004
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

config.serverApi.baseUrl =
  process.env.API_BASE_URL || `http://localhost:${config.serverApi.port}`;

export default config;
