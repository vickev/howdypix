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
  }
};

config.serverHttp.baseUrl =
  process.env.HTTP_BASE_URL ?? `http://localhost:${config.serverHttp.port}`;

export default config;
