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
    const query = triggerRepository.fetchUserDashboardQuery(req.userId);
    const allTriggers = await triggerService.aggregate(query);
    logger.info("Fetched dashboard triggers successfully");
    const alerts = allTriggers.filter((alert) => alert.alerts);
    return {
      status: 200,
      body: {
        activeTriggers: allTriggers.filter((trigger) => trigger.isActive)
          .length,
        totalTriggers: allTriggers.length,
        alert: alerts.filter((a) => a.isReaded == true).length,
      },
    };
  } catch (error) {
    logger.error("Error creating trigger", { error });
    if (error instanceof Error) {
      return {
        status: 400,
        body: { message: error.message },
      };
    }
  }
};
