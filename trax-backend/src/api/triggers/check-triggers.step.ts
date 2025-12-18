import type { CronConfig, Handlers } from "motia";
import { triggerRepository } from "../../repositories/triggers-dto";
export const config: CronConfig = {
  name: "CheckTriggers",
  type: "cron",
  cron: "*/10 * * * *", // Run every 10 minutes
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
      const triggerData = {
        triggerId: trigger._id.toString(),
        nextCheck: trigger.nextCheck.toISOString(),
      };

      await Promise.all(
        triggers.map((trigger) =>
          emit({
            topic: "trigger-ready",
            data: {
              triggerId: trigger._id.toString(),
              nextCheck: trigger.nextCheck.toISOString(),
            },
          })
        )
      );

      logger.info("Emitted trigger to queue", {
        triggerId: trigger._id.toString(),
      });
    }

    logger.info("Completed trigger check cron job", {
      processedCount: triggers.length,
    });
  } catch (error) {
    logger.error("Error in trigger check cron job", { error });
    throw error;
  }
};
