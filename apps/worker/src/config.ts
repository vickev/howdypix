import config from "config";

export default {
  rabbitMq: {
    url: (config.get("app.rabbitMQ.url") as string) || "amqp://localhost",
  },
  processing: {
    nbThreads: (config.get("app.processing.nbThreads") as number) || 1,
  },
};
