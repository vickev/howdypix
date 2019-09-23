import { client as WebSocketClient, connection } from "websocket";
import { forEach } from "lodash";
import { wait } from "@howdypix/utils";

export type Outputs = Array<(msg: string) => any>;

export type State = {
  connected: boolean;
};

export type Options = {
  url: string;
  retrySeconds: number;
  onConnect?: (connection: connection) => void;
};

export function onError(
  err: Error,
  options: Options,
  outputs: Outputs = [console.log]
) {
  const { url, retrySeconds } = options;

  forEach(outputs, output =>
    output(
      `Impossible to connect to ${url}. Retrying in ${retrySeconds} seconds.\n${err}`
    )
  );

  connect(
    options,
    outputs,
    true
  );
}

export function onConnect(
  ws: WebSocketClient,
  resolve: (value: WebSocketClient) => void,
  connection: connection,
  options: Options,
  outputs: Outputs = [console.log]
) {
  connection.on("close", () =>
    onError(new Error("The server has closed."), options, outputs)
  );

  console.log(`Connected to ${options.url}.`);
  resolve(ws);
}

export async function connect(
  options: Options,
  outputs: Outputs = [console.log],
  initialWait: boolean = false
): Promise<WebSocketClient> {
  const { url, retrySeconds } = options;

  if (initialWait) {
    await wait(retrySeconds);
  }

  return new Promise(resolve => {
    const ws = new WebSocketClient();

    ws.on("connectFailed", err => onError(err, options, outputs));

    ws.on("connect", connection => {
      onConnect(ws, resolve, connection, options, outputs);

      if (options.onConnect) {
        options.onConnect(connection);
      }
    });

    ws.connect(url);
  });
}
