import { consume, sendToQueue } from "@howdypix/utils";
import { connectToRabbitMq } from "@howdypix/utils/dist/rabbitMq";
import { HFile, QueueName } from "@howdypix/shared-types";
import { Channel, Connection } from "amqplib";
import waitForExpect from "wait-for-expect";
import { startRabbitMq } from "../src/libs/startRabbitMq";
import { process } from "../src/libs/process";
import { appConfig } from "../src/config";

jest.mock("../src/libs/process", () => ({
  process: jest.fn(),
}));

describe("startRabbitMq", () => {
  let connection: Connection;
  let channel: Channel;

  const baseHfile: HFile = {
    dir: "dir",
    file: "file",
    source: "source",
    name: "name",
  };

  beforeAll(async () => {
    connection = await connectToRabbitMq(appConfig.rabbitMQ.url);
    channel = await connection.createChannel();

    // Remove all queues
    try {
      await channel.deleteQueue(QueueName.TO_PROCESS);
      await channel.deleteQueue(QueueName.PROCESSED);
    } catch (e) {
      // do nothing
    }

    // Create new queues
    try {
      await channel.assertQueue(QueueName.TO_PROCESS);
      await channel.assertQueue(QueueName.PROCESSED);
    } catch (e) {
      // do nothing
    }
  });

  beforeEach(async () => {
    try {
      await channel.purgeQueue(QueueName.PROCESSED);
      await channel.purgeQueue(QueueName.TO_PROCESS);
    } catch (e) {
      // do nothing
    }
  });

  afterAll(async () => {
    await channel.close();
    await connection.close();
  });

  describe("when receiving a message from RabbitMQ", () => {
    beforeEach(async () => {
      // Initialize
      (process as jest.Mock).mockImplementation(() => {
        return Promise.resolve({ data: 1 });
      });

      // Run
      await startRabbitMq(appConfig.rabbitMQ);
      await sendToQueue(channel, QueueName.TO_PROCESS, {
        thumbnailsDir: "thumbnailsDir",
        hfile: baseHfile,
        root: "/root",
      });
    });

    it("should process the file when receiving a message from RabbitMQ", async () => {
      // Test
      await waitForExpect(() => {
        expect(process).toHaveBeenCalled();
      });
      expect((process as jest.Mock).mock.calls[0]).toMatchSnapshot();
    });

    it("should send a message back to RabbitMQ", async (done) => {
      consume(channel, QueueName.PROCESSED, (msg) => {
        waitForExpect(() => {
          expect(msg?.data).toMatchSnapshot();
        }).then(done);
      });
    });
  });

  it("when having an error processing, should not fail", async () => {
    // Initialize
    (process as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error("error"));
    });

    jest.spyOn(console, "error").mockImplementationOnce(() => {});

    // Run
    await startRabbitMq(appConfig.rabbitMQ);
    await sendToQueue(channel, QueueName.TO_PROCESS, {
      thumbnailsDir: "thumbnailsDir",
      hfile: baseHfile,
      root: "/root",
    });

    // Test
    await waitForExpect(() => {
      expect(process).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
