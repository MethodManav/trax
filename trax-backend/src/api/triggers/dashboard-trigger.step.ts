import { ApiMiddleware, ApiRouteConfig, Handlers } from "motia";
import { authenticateToken } from "../../middleware/auth.middleware";
import { triggerRepository } from "../../repositories/triggers-dto";
import { triggerService } from "../../services/triggers/index";

export const config: ApiRouteConfig = {
  name: "Dashboard  Trigger",
  type: "api",
  path: "/dashboard/triggers",
  method: "GET",
  description: "Get all dashboard triggers",
  emits: [],
  flows: ["trigger-management"],
  middleware: [authenticateToken as ApiMiddleware],
  includeFiles: [
    "../../services/triggers/index.ts",
    "../../repositories/triggers/index.ts",
    "../../middleware/auth.middleware.ts",
  ],
};

export const handler: Handlers["Dashboard  Trigger"] = async (
  req,
  { logger }
) => {
  try {
    // @ts-ignore
    const allTrigger = await triggerService.getAllUserTriggers(req.userId);
    // @ts-ignore
    const userId = req.userId;
    const recentAlerts = await triggerRepository.getRecentNotifications(
      userId,
      5
    );
    return {
      status: 200,
      body: {
        totalTrigger: allTrigger.length,
        activeTrigger: allTrigger.filter((t) => t.isActive).length,
        inactiveTrigger: allTrigger.filter((t) => !t.isActive).length,
        recentAlerts: recentAlerts,
      },
    };
  } catch (error) {
    logger.error("Error dashboard trigger", { error });
    if (error instanceof Error) {
      return {
        status: 400,
        body: { message: error.message },
      };
    }
  }
};
