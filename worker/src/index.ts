import Redis from "ioredis";
import { connectDatabase } from "./database";
import { TriggerModel } from "./model/trigger.model";
import { googleChat } from "./firecrawl";
import { NotificationModel } from "./model/notification.model";

// Handle uncaught exceptions - stop service immediately
process.on("uncaughtException", (err: Error) => {
  console.error("ERROR: Uncaught exception. Stopping service immediately.");
  console.error("Error details:", err);
  console.error("Error stack:", err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections - stop service immediately
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(
    "ERROR: Unhandled promise rejection. Stopping service immediately."
  );
  console.error("Reason:", reason);
  process.exit(1);
});

const redisOptions: any = {
  username: "default",
  port: 19902,
};

if (process.env.REDIS_PASSWORD !== undefined) {
  redisOptions.password = process.env.REDIS_PASSWORD;
}

if (process.env.REDIS_HOST !== undefined) {
  redisOptions.host = process.env.REDIS_HOST;
}

const redis = new Redis(redisOptions);

// Handle Redis connection errors
redis.on("error", (err: Error) => {
  console.error("ERROR: Redis connection error. Stopping service immediately.");
  console.error("Error details:", err);
  process.exit(1);
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});
const QUEUE_NAME = "fifo-events";

// Processing flag to ensure synchronous execution - only one item processed at a time
let isProcessing = false;

const startWorker = async () => {
  try {
    await connectDatabase();
  } catch (err: any) {
    console.error(
      "ERROR: Failed to connect to database. Stopping service immediately."
    );
    console.error("Error details:", err);
    process.exit(1);
  }

  // Synchronous processing loop - processes one item at a time, no parallel execution
  while (true) {
    // Wait if currently processing to ensure strict sequential execution
    while (isProcessing) {
      await new Promise((res) => setTimeout(res, 100));
    }

    let data;
    try {
      // brpop blocks until an item is available - ensures sequential processing
      data = await redis.brpop(QUEUE_NAME, 0);
    } catch (err: any) {
      console.error(
        "ERROR: Failed to fetch from Redis queue. Stopping service immediately."
      );
      console.error("Error details:", err);
      process.exit(1);
    }

    let queueData;
    try {
      queueData = JSON.parse(data?.[1] || "{}");
    } catch (err: any) {
      console.error(
        "ERROR: Failed to parse queue data. Stopping service immediately."
      );
      console.error("Error details:", err);
      process.exit(1);
    }

    if (data?.[1]) {
      // Set processing flag to prevent parallel execution
      isProcessing = true;
      try {
        console.log("Fetched from queue:", queueData);
        const triggerData = await TriggerModel.findById(queueData.triggerId);
        console.log("Processing event:", triggerData);
        if (!triggerData) {
          console.error("Trigger not found:", queueData._id);
          isProcessing = false;
          continue;
        }
        // Synchronous execution - await ensures this completes before next iteration
        const fetchPrice = await googleChat(triggerData.config as any);
        console.log("Fetched Price:", fetchPrice);
        //check if fetched price is close to expected price
        if (
          isPriceCloseToTarget(
            fetchPrice?.amazon?.price as number,
            triggerData.expectedPrice
          )
        ) {
          await NotificationModel.create({
            userId: triggerData.userId,
            triggerId: triggerData._id,
            message: `Price alert! The price on Amazon is close to your target of ₹${triggerData.expectedPrice}. Current price: ₹${fetchPrice?.amazon?.price}`,
            createdAt: new Date(),
            read: false,
          });
          console.log(
            `Trigger ${triggerData._id} met the expected price condition. Notification created.`
          );
        }
        if (
          isPriceCloseToTarget(
            fetchPrice?.flipkart?.price as number,
            triggerData.expectedPrice
          )
        ) {
          await NotificationModel.create({
            userId: triggerData.userId,
            triggerId: triggerData._id,
            message: `Price alert! The price on Flipkart is close to your target of ₹${triggerData.expectedPrice}. Current price: ₹${fetchPrice?.flipkart?.price}`,
            createdAt: new Date(),
            read: false,
          });
          console.log(
            `Trigger ${triggerData._id} met the expected price condition. Notification created.`
          );
        }
        // Update trigger with fetched price or any other logic
        triggerData.nextCheck = new Date(Date.now() + 60 * 60 * 1000); // Next check in 1 hour
        const amazonPrice = fetchPrice?.amazon?.price || Infinity;
        const flipkartPrice = fetchPrice?.flipkart?.price || Infinity;

        triggerData.lastFetchedPrice =
          amazonPrice !== undefined &&
          flipkartPrice !== undefined &&
          amazonPrice < flipkartPrice
            ? fetchPrice?.amazon
            : fetchPrice?.flipkart;
        await triggerData.save();
      } catch (err: any) {
        console.error(
          "ERROR: An error occurred. Stopping service immediately."
        );
        console.error("Error details:", err);
        console.error("Error stack:", err.stack);
        process.exit(1);
      } finally {
        // Always reset processing flag, even on error
        isProcessing = false;
      }
    } else {
      await new Promise((res) => setTimeout(res, 500));
    }
  }
};

const isPriceCloseToTarget = (
  fetchedPrice: number | null | undefined,
  targetPrice: number
): boolean => {
  if (fetchedPrice === null || fetchedPrice === undefined) {
    return false;
  }
  const difference = Math.abs(fetchedPrice - targetPrice);
  return difference <= 2000; // Check if the difference is within 2000
};

startWorker().catch((err: any) => {
  console.error("ERROR: Fatal error in worker. Stopping service immediately.");
  console.error("Error details:", err);
  console.error("Error stack:", err.stack);
  process.exit(1);
});

// const job = {
//   triggerId: "6946e821bccf93ea5dca45c8",
//   userId: "694580b2532794aba079d249",
// };
// redis
//   .rpush(QUEUE_NAME, JSON.stringify(job))
//   .then(() => {
//     console.log("Job pushed to queue");
//   })
//   .catch((err) => {
//     console.error("Error pushing job to queue:", err);
//   });
