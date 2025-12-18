import type { EventConfig, Handlers } from "motia";
import { triggerRepository } from "../repositories/triggers-dto";
import { googleChat } from "../repositories/google-dto";

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
    logger.info("Trigger processed successfully", {
      triggerId: input.triggerId,
    });
    const fetchTriggerData = await triggerRepository.fetchTriggerById(
      input.triggerId
    );
    if (!fetchTriggerData) {
      logger.warn("No trigger found with the given ID", {
        triggerId: input.triggerId,
      });
      return;
    }
    const fetchPriceFromGoogle = await googleChat(
      fetchTriggerData.config as any
    );
    console.log("Fetched Price from Google:", fetchPriceFromGoogle);
    // const addTrackerData= await triggerRepository.createTriggerData({
    //   triggerId: fetchTriggerData._id,
    //   userId: fetchTriggerData.userId,
    //   currentPrice: [
    //     {
    //       site: fetchPriceFromGoogle.,
    //       price: fetchPriceFromGoogle,
    //     },
    //   ],
    //   targetPrice: fetchTriggerData.targetPrice,
    // });
  } catch (error) {
    logger.error("Error processing trigger", {
      error,
      triggerId: input.triggerId,
    });
    throw error;
  }
};
