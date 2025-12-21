import { z } from "zod";
import { ApiRouteConfig, Handlers } from "motia";
import { NotificationModel } from "../../model/notificayion.model";
import { authenticateToken } from "../../middleware/auth.middleware";
import { connectDatabase } from "../../utils/database";

export const config: ApiRouteConfig = {
  name: "Update Notification",
  type: "api",
  path: "/notifications/:id",
  method: "PATCH",
  description: "Update notification read status to true",
  emits: [],
  flows: ["notification-management"],
  middleware: [authenticateToken],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
    404: z.object({
      error: z.string(),
    }),
    500: z.object({
      error: z.string(),
    }),
  },
};

export const handler: Handlers["Update Notification"] = async (
  req,
  { logger }
) => {
  try {
    // Ensure database is connected
    await connectDatabase();

    const notificationId = req.pathParams.id;
    // @ts-ignore - userId is set by authenticateToken middleware
    const userId = req.userId;

    if (!notificationId) {
      logger.error("Notification ID is required");
      return {
        status: 400,
        body: { error: "Notification ID is required" },
      };
    }

    logger.info("Updating notification", {
      notificationId,
      userId,
    });

    // Find and update the notification
    // Ensure the notification belongs to the authenticated user
    const notification = await NotificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        userId: userId,
      },
      {
        read: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      logger.warn("Notification not found or unauthorized", {
        notificationId,
        userId,
      });
      return {
        status: 404,
        body: { error: "Notification not found or unauthorized" },
      };
    }

    logger.info("Notification updated successfully", {
      notificationId,
      userId,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Notification marked as read",
      },
    };
  } catch (error) {
    logger.error("Error updating notification", { error });
    if (error instanceof Error) {
      return {
        status: 500,
        body: { error: error.message },
      };
    }
    return {
      status: 500,
      body: { error: "Failed to update notification" },
    };
  }
};
