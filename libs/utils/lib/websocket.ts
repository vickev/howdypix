import WebSocket from "ws";
import { forEach } from "lodash";
import { wait } from "./utils";

export type Outputs = Array<(msg: string) => any>;

export type State = {
  connected: boolean;
};

export type Options = {
  url: string;
  retrySeconds: number;
};

export async function connect(
  options: Options,
  outputs: Outputs = [console.log],
  initialWait: boolean = false
): Promise<WebSocket> {
  const { url, retrySeconds } = options;

  if (initialWait) {
    await wait(retrySeconds);
  }

  return new Promise(resolve => {
    const ws = new WebSocket(url);
    ws.on("error", () => {
      forEach(outputs, output =>
        output(
          `Impossible to connect to ${url}. Retrying in ${retrySeconds} seconds.`
        )
      );

      connect(
        options,
        outputs,
        true
      );
    });

    ws.on("connection", () => {
      resolve(ws);
    });
  });
}
