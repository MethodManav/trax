import Redis from "ioredis";

export const redis = new Redis({
  username: "default",
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

const QUEUE_NAME = "fifo-events";
redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export const pushEvent = async (eventData: any) => {
  await redis.lpush(QUEUE_NAME, JSON.stringify(eventData));
};
