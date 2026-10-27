import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  socket: {
    connectTimeout: 1_000,
    reconnectStrategy: () => false,
  },
});
redis.on("error", (error) => console.warn("Redis client error:", error.message));

let connecting: Promise<void> | undefined;

async function getConnectedRedis() {
  if (connecting) {
    await connecting;
  } else if (!redis.isReady) {
    connecting = redis.connect().then(() => undefined).finally(() => {
      connecting = undefined;
    });
    await connecting;
  }
  return redis;
}

export async function getRedisValue(key: string) {
  return (await getConnectedRedis()).get(key);
}

export async function setRedisValue(key: string, value: string, ttlSeconds: number) {
  await (await getConnectedRedis()).set(key, value, { EX: ttlSeconds });
}
