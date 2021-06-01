import { HFile, QueueName } from "@howdypix/shared-types";
import { consume, sendToQueue } from "@howdypix/utils";
import { connectToRabbitMq } from "@howdypix/utils/dist/rabbitMq";
import { Channel, Connection } from "amqplib";
import { EventEmitter } from "events";
import { startRabbitMq } from "../src/lib/startRabbitMq";
import { Events, EventTypes } from "../src/lib/eventEmitter";
import { appConfig, UserConfig } from "../src/config";

describe("startRabbitMq", () => {
  let connection: Connection;
  let channel: Channel;
  let events: Events;

  const baseUserConfig: UserConfig = {
    photoDirs: {
      first: "./first",
      second: "./second",
    },
    thumbnailsDir: "/thumbnailsDir",
    users: [],
    emailSender: {
      email: "email@sender.com",
      name: "Sender",
    },
  };

  const baseHfile: HFile = {
    dir: "dir",
    file: "file",
    source: "source",
    name: "name",
  };

  const countMessages = async (queue: QueueName): Promise<number> =>
    (await channel.assertQueue(queue)).messageCount;

  const testSendMessageAgainstSnapshot = async <T extends keyof EventTypes>(
    eventName: T,
    data: EventTypes[T],
    queueName: QueueName,
    numberOfMessagesExpected: number
  ): Promise<void> =>
    new Promise((resolve) => {
      events.once(eventName, async () => {
        setTimeout(async () => {
          expect(await countMessages(queueName)).toEqual(
            numberOfMessagesExpected
          );

          consume(
            channel,
            queueName,
            (msg) => {
              expect(msg?.data).toMatchSnapshot();
            },
            { consumerTag: "consume" }
          )
            .then(() => channel.cancel("consume"))
            .then(() => channel.recover())
            .then(() => resolve());
        }, 100);
      });

      // @ts-ignore
      events.emit(eventName, data);
    });

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
    events = new EventEmitter();

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

  it("should send an event when receiving a RabbitMQ message", (done) => {
    // 1. Configure
    events.on("processedFile", (args) => {
      // 3. Test
      expect(args).toMatchSnapshot();
      done();
    });

    // 2. Act
    startRabbitMq(events, baseUserConfig, appConfig.rabbitMQ).then(() => {
      sendToQueue(channel, QueueName.PROCESSED, {
        root: "root",
        hfile: baseHfile,
        exif: {
          aperture: 1,
          createDate: 2,
          ISO: 3,
          make: "make",
          model: "model",
          shutter: 4,
        },
        stat: {
          birthtime: 1,
          ctime: 2,
          inode: 3,
          mtime: 4,
          size: 5,
        },
        thumbnails: [],
      });
    });
  });

  it("should send a rabbitMQ message when receiving `processFile` event", async () => {
    // ==============================
    // 1. Initialize
    // ==============================
    await startRabbitMq(events, baseUserConfig, appConfig.rabbitMQ);

    // ==============================
    // 2. Test
    // ==============================
    expect(await countMessages(QueueName.TO_PROCESS)).toEqual(0);

    await testSendMessageAgainstSnapshot(
      "processFile",
      { root: "/root", hfile: baseHfile },
      QueueName.TO_PROCESS,
      1
    );

    await testSendMessageAgainstSnapshot(
      "processFile",
      { root: "/root", hfile: { ...baseHfile, file: "file2" } },
      QueueName.TO_PROCESS,
      2
    );
  });

  it("should not send the same message twice if already in queue", async () => {
    // ==============================
    // 1. Configure
    // ==============================
    // We send the message to simulate that it's already in the queue
    sendToQueue(channel, QueueName.TO_PROCESS, {
      thumbnailsDir: "thumbnailsDir",
      root: "root",
      hfile: baseHfile,
    });

    await startRabbitMq(events, baseUserConfig, appConfig.rabbitMQ);

    // ==============================
    // 3. Test
    // ==============================
    await testSendMessageAgainstSnapshot(
      "processFile",
      { root: "/root", hfile: baseHfile },
      QueueName.TO_PROCESS,
      1
    );
  });
});
