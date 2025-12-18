import type { EventConfig, Handlers } from "motia";
import { triggerRepository } from "../repositories/triggers-dto";
import { googleChat } from "../repositories/google-dto";
import { enqueue } from "../repositories/job-dto";

export const config: EventConfig = {
  name: "ProcessTrigger",
  type: "event",
  description: "Process trigger that is ready for checking",
  subscribes: ["trigger-ready"],
  emits: [],
  flows: ["trigger-management"],
};

export const handler: Handlers["ProcessTrigger"] = async (
  input,
  { logger }
) => {
  try {
    logger.info("Processing trigger", { triggerId: input.triggerId });
    await enqueue(input.triggerId);
  } catch (error) {
    logger.error("Error processing trigger", {
      error,
      triggerId: input.triggerId,
    });
    throw error;
  }
};
