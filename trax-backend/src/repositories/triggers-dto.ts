import {
  ITriggerDoc,
  TriggerModel,
  type ITrigger,
} from "../model/trigger.model";
import { connectDatabase, disconnectDatabase } from "../utils/database";

export const triggerRepository = {
  async createTriggerData(data: ITrigger): Promise<ITriggerDoc> {
    try {
      await connectDatabase();
      const trigger = await TriggerModel.create(data);
      return trigger;
    } catch (error) {
      throw new Error("Error creating trigger in repository");
    } finally {
      disconnectDatabase();
    }
  },
};
