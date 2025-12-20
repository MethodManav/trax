import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
});

const QUEUE_NAME = "fifo-events";

export const pushEvent = async (eventData: any) => {
  await redis.lpush(QUEUE_NAME, JSON.stringify(eventData));
};
