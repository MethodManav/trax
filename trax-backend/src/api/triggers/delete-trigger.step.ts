import type { ApiMiddleware, ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { triggerService } from "../../services/triggers/index";
import { ITriggerDoc } from "../../model/trigger.model";
import { authenticateToken } from "../../middleware/auth.middleware";

export const config: ApiRouteConfig = {
  name: "Delete Trigger",
  type: "api",
  path: "/triggers",
  method: "PATCH",
  description: "Delete a trigger",
  emits: [],
  flows: ["trigger-management"],
  middleware: [authenticateToken as ApiMiddleware],
  includeFiles: [
    "../../services/triggers/index.ts",
    "../../repositories/triggers/index.ts",
    "../../middleware/auth.middleware.ts",
  ],
};

export const handler: Handlers["CreateTrigger"] = async (req, { logger }) => {
  try {
    const { triggerId } = req.body;
    if (!triggerId) {
      throw new Error("Trigger ID is required");
    }
    // @ts-ignore
    const userId = req.userId;
    const setInActive = await triggerService.setTriggerInActive(
      triggerId as string,
      userId
    );
    logger.info("Trigger deleted successfully", { triggerId: triggerId });
    return {
      status: 200,
      body: setInActive,
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
