import type { ApiMiddleware, ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { triggerService } from "../../services/triggers/index";
import { ITriggerDoc } from "../../model/trigger.model";
import { authRepository } from "../../repositories/auth-dto";
import { authenticateToken } from "../../middleware/auth.middleware";

const createMobileTriggerBodySchema = z.object({
  eventType: z.literal("mobile"),
  config: z.object({
    brandName: z.string().min(1, "Name is required"),
    modelName: z.string().min(1, "Model name is required"),
    ram: z.number().min(256, "RAM must be at least 256MB"),
    rom: z.number().min(1024, "ROM must be at least 1GB"),
  }),
  expectedPrice: z.number().min(0, "Expected price must be non-negative"),
  timeDuration: z.string().min(1, "Track timing is required"),
});

export type CreateMobileTriggerBody = z.infer<
  typeof createMobileTriggerBodySchema
>;
export type CreateTrigger = CreateMobileTriggerBody;

export const config: ApiRouteConfig = {
  name: "CreateTrigger",
  type: "api",
  path: "/triggers",
  method: "POST",
  description: "Create a new trigger",
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
    const parsedBody = createMobileTriggerBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      throw new Error("Validation failed: " + parsedBody.error.message);
    }
    // @ts-ignore
    req.body.userId = req.userId;
    console.log("Request Body with UserID:", req.body);
    const newTrigger: ITriggerDoc = await triggerService.CreateTrigger(
      req.body as any
    );
    logger.info("Trigger created successfully", { triggerId: newTrigger._id });
    return {
      status: 201,
      body: newTrigger,
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
