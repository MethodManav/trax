import type { CronConfig, Handlers } from "motia";
import { triggerRepository } from "../../repositories/triggers-dto";
import { pushEvent } from "../../queue/createQueue";
export const config: CronConfig = {
  name: "CheckTriggers",
  type: "cron",
  cron: "0/5 * * * *", // Run every 5 minutes
  description: "Check triggers ready for processing and push them to queue",
  emits: ["trigger-ready"],
  flows: ["trigger-management"],
  includeFiles: ["../../repositories/triggers-dto.ts"],
};

export const handler: Handlers["CheckTriggers"] = async ({ logger, emit }) => {
  try {
    logger.info("Starting trigger check cron job");

    // Fetch triggers where nextCheck < current time and isActive = true
    const triggers = await triggerRepository.getTriggersReadyForCheck();
    if (triggers.length === 0) {
      logger.info("No triggers found ready for processing");
      return;
    }
    logger.info(`Found ${triggers.length} triggers ready for processing`);
    for (const trigger of triggers) {
      try {
        // Push each trigger to the queue for processing
        await pushEvent({ triggerId: trigger._id });
        logger.info(`Pushed trigger ${trigger._id} to processing queue`);
      } catch (err) {
        logger.error(`Error pushing trigger ${trigger._id} to queue`, {
          error: err,
        });
      }
    }
    logger.info("Completed trigger check cron job");
  } catch (error) {
    logger.error("Error in trigger check cron job", { error });
    throw error;
  }
};
