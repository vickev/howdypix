import { promisify } from "util";
import redis, { ClientOpts } from "redis";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const asyncRedis = (options?: ClientOpts, redisClient = redis) => {
  const client = redisClient.createClient(options);

  const get = promisify(client.get).bind(client);
  const set = promisify(client.set).bind(client);
  const flushdb = promisify(client.flushdb).bind(client);

  const getJson = <T>(arg1: string): Promise<T | null> =>
    get(arg1).then((str) => (str ? (JSON.parse(str) as T) : null));
  const setJson = <T>(arg1: string, arg2: T): Promise<unknown> =>
    set(arg1, JSON.stringify(arg2));

  return {
    get,
    set,
    flushdb,
    getJson,
    setJson,
  };
};

export type AsyncRedis = ReturnType<typeof asyncRedis>;
