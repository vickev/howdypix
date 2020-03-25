import { MessageProcess, ProcessData, QueueName } from "@howdypix/shared-types";
import {
  appError,
  appDebug,
  assertQueue,
  consume,
  hjoin,
  sendToQueue,
} from "@howdypix/utils";
import { connectToRabbitMq } from "@howdypix/utils/dist/rabbitMq";
import { process } from "./process";

export async function startRabbitMq(url: string): Promise<void> {
  const connection = await connectToRabbitMq(url);

  try {
    const channel = await connection.createChannel();

    await assertQueue(channel, QueueName.TO_PROCESS);
    await assertQueue(channel, QueueName.PROCESSED);

    await consume<MessageProcess>(
      channel,
      QueueName.TO_PROCESS,
      async (msg) => {
        if (msg) {
          appDebug("toProcess")(hjoin(msg.data.hfile).toString());
          channel.ack(msg);

          try {
            const data = await process(
              msg.data.thumbnailsDir,
              msg.data.root,
              msg.data.hfile
            );

            await sendToQueue<ProcessData>(channel, QueueName.PROCESSED, data);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }
      }
    );
  } catch (e) {
    appError(`An error occured: ${e}`);
  }
}
