import { z } from "zod";
import { ApiRouteConfig, Handlers } from "motia";
import { NotificationModel } from "../../model/notificayion.model";
import { authenticateToken } from "../../middleware/auth.middleware";
import { connectDatabase } from "../../utils/database";
import { Types } from "mongoose";

export const config: ApiRouteConfig = {
  name: "Get User Notifications",
  type: "api",
  path: "/notifications",
  method: "GET",
  description: "Get all notifications for the logged-in user",
  emits: [],
  flows: ["notification-management"],
  middleware: [authenticateToken],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      notifications: z.array(
        z.object({
          _id: z.string(),
          userId: z.string(),
          triggerId: z.string(),
          message: z.string(),
          createdAt: z.string(),
          read: z.boolean(),
        })
      ),
    }),
    500: z.object({
      error: z.string(),
    }),
  },
};

export const handler: Handlers["Get User Notifications"] = async (
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

    logger.info("Fetching notifications for user", {
      userId,
    });

    // Fetch all notifications for the user, sorted by creation date (newest first)
    const notifications = await NotificationModel.find({
      userId: new Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .exec();

    logger.info("Notifications fetched successfully", {
      userId,
      count: notifications.length,
    });

    // Transform the notifications to include string IDs
    const transformedNotifications = notifications.map((notification) => ({
      _id: notification._id.toString(),
      userId: notification.userId.toString(),
      triggerId: notification.triggerId.toString(),
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
      read: notification.read,
    }));

    return {
      status: 200,
      body: {
        success: true,
        notifications: transformedNotifications,
      },
    };
  } catch (error) {
    logger.error("Error fetching notifications", { error });
    if (error instanceof Error) {
      return {
        status: 500,
        body: { error: error.message },
      };
    }
    return {
      status: 500,
      body: { error: "Failed to fetch notifications" },
    };
  }
};
