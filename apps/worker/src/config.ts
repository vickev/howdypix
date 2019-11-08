// Load env variables
require("dotenv").config();

const config = {
  rabbitMq: {
    url: process.env.RABBITMQ_URL || "amqp://localhost"
  }
};

export default config;
