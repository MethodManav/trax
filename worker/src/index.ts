import Redis from "ioredis";
import { connectDatabase } from "./database";

const redis = new Redis();
const QUEUE_NAME = "fifo-events";

const processEvent = async (event: any) => {
  await new Promise((res) => setTimeout(res, 1000));
};

const startWorker = async () => {
  while (true) {
    await connectDatabase();
    const eventData = await redis.rpop(QUEUE_NAME); // Get the first item
    if (eventData) {
      try {
        await processEvent(JSON.parse(eventData));
      } catch (err) {
        console.error("Error processing event:", err);
        // Optional: push back to queue for retry
        await redis.lpush(QUEUE_NAME, eventData);
      }
    } else {
      // Queue empty, wait a bit
      await new Promise((res) => setTimeout(res, 500));
    }
  }
};

startWorker();
