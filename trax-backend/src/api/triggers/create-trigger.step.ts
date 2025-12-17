import type { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { ZodError } from "zod";
import { triggerService } from "../../services/triggers/index";
import { ITriggerDoc } from "src/model/trigger.model";

const createMobileTriggerBodySchema =z.object({
  eventType: z.literal("mobile"),
  config: z.object({
    brandName: z.string().min(1, "Name is required"),
    modelName: z.string().min(1, "Model name is required"),
    ram: z.number().min(256, "RAM must be at least 256MB"),
    rom: z.number().min(1024, "ROM must be at least 1GB"),
  }),
  expectedPrice: z.number().min(0, "Expected price must be non-negative"),
  trackTiming: z.string().min(1, "Track timing is required"),
});

// const createFlightTriggerBodySchema = z.object({
//   eventType: z.literal("flight"),
 
//   config: z.record(z.string(), z.unknown()).optional().default({}),
//   isActive: z.boolean().optional().default(true),
// });

export type CreateMobileTriggerBody = z.infer<
  typeof createMobileTriggerBodySchema
>;
// export type CreateFlightTriggerBody = z.infer<
//   typeof createFlightTriggerBodySchema
// >;
export type CreateTrigger = CreateMobileTriggerBody ;

export const config: ApiRouteConfig = {
  name: "CreateTrigger",
  type: "api",
  path: "/triggers",
  method: "POST",
  description: "Create a new trigger",
  emits: [],
  flows: ["trigger-management"],
  includeFiles: [
    "../../services/triggers/index.ts",
    "../../repositories/triggers/index.ts",
  ],
  responseSchema: {
    201: z.object({
      id: z.string(),
      eventType: z.string(),
      isActive: z.boolean(),
      config: z.record(z.string(), z.unknown()),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    400: z.object({
      error: z.string(),
    }),
    500: z.object({
      error: z.string(),
    }),
  },
};

export const handler: Handlers["CreateTrigger"] = async (req, { logger }) => {
  try {
    logger.info("Creating new trigger", { body: req.body });
    let trigger:ITriggerDoc;
    switch (req.body.eventType) {
      case "mobile":
        const mobileValidatedData = createMobileTriggerBodySchema.safeParse(req.body);
        if (!mobileValidatedData.success) {
          throw new ZodError(mobileValidatedData.error.errors);
        }
         trigger = await triggerService.CreateTrigger(mobileValidatedData.data);
        break;
        // case "flight":
        //   const flightValidatedData = createFlightTriggerBodySchema.safeParse(req.body);
        //   if (!flightValidatedData.success) {
        //     throw new ZodError(flightValidatedData.error.errors);
        //   }
        // trigger = await triggerService.CreateTrigger(flightValidatedData.data);
        // break;
      default:
        logger.warn("Unknown event type", { eventType: req.body.eventType });
        throw new Error("Unsupported event type");
    }

    logger.info("Trigger created successfully", { triggerId: trigger });

    return {
      status: 201,
      body: trigger,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("Validation error creating trigger", { error: error.errors });
      return {
        status: 400,
        body: { error: "Validation failed", details: error.errors },
      };
    }

    logger.error("Failed to create trigger", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      status: 500,
      body: {
        error:
          error instanceof Error ? error.message : "Failed to create trigger",
      },
    };
  }
};
