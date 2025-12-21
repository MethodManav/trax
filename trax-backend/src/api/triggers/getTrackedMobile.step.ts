import { ApiMiddleware, ApiRouteConfig, Handlers } from "motia";
import { authenticateToken } from "../../middleware/auth.middleware";
import { TriggerModel } from "../../model/trigger.model";
import { connectDatabase } from "../../utils/database";
import { Types } from "mongoose";
import { z } from "zod";

export const config: ApiRouteConfig = {
  name: "Get Tracked Mobile Triggers",
  type: "api",
  path: "/triggers/mobile/tracked",
  method: "GET",
  description: "Get all tracked mobile triggers for the logged-in user",
  emits: [],
  flows: ["trigger-management"],
  middleware: [authenticateToken as ApiMiddleware],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      triggers: z.array(z.any()),
    }),
    500: z.object({
      error: z.string(),
    }),
  },
};

export const handler: Handlers["Get Tracked Mobile Triggers"] = async (
  req,
  { logger }
) => {
  try {
    // Ensure database is connected
    await connectDatabase();

    // @ts-ignore - userId is set by authenticateToken middleware
    const userId = req.userId;

    if (!userId) {
      logger.error("User ID is required");
      return {
        status: 401,
        body: { error: "Unauthorized" },
      };
    }

    logger.info("Fetching tracked mobile triggers for user", {
      userId,
    });

    // Fetch triggers where eventType = "mobile" and isTracked = true
    const triggers = await TriggerModel.find({
      userId: new Types.ObjectId(userId),
      eventType: "mobile",
      isTracked: true,
    })
      .sort({ createdAt: -1 })
      .exec();

    logger.info("Tracked mobile triggers fetched successfully", {
      userId,
      count: triggers.length,
    });

    // Transform the triggers to include string IDs
    const transformedTriggers = triggers.map((trigger) => ({
      _id: trigger._id.toString(),
      userId: trigger.userId.toString(),
      eventType: trigger.eventType,
      isActive: trigger.isActive,
      config: trigger.config,
      expectedPrice: trigger.expectedPrice,
      timeDuration: trigger.timeDuration,
      isTracked: trigger.isTracked,
      nextCheck: trigger.nextCheck?.toISOString(),
      lastFetchedPrice: trigger.lastFetchedPrice,
      createdAt: trigger.createdAt?.toISOString(),
      updatedAt: trigger.updatedAt?.toISOString(),
    }));

    return {
      status: 200,
      body: {
        success: true,
        triggers: transformedTriggers,
      },
    };
  } catch (error) {
    logger.error("Error fetching tracked mobile triggers", { error });
    if (error instanceof Error) {
      return {
        status: 500,
        body: { error: error.message },
      };
    }
    return {
      status: 500,
      body: { error: "Failed to fetch tracked mobile triggers" },
    };
  }
};
