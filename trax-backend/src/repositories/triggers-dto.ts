import { Types } from "mongoose";
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
  async getTriggersReadyForCheck(): Promise<ITriggerDoc[]> {
    try {
      await connectDatabase();
      const currentTime = new Date();
      const triggers = await TriggerModel.find({
        nextCheck: { $lt: currentTime },
        isActive: true,
      }).exec();
      return triggers;
    } catch (error) {
      throw new Error("Error fetching triggers ready for check");
    } finally {
      disconnectDatabase();
    }
  },
  async fetchTriggerById(
    triggerId: Types.ObjectId
  ): Promise<ITriggerDoc | null> {
    try {
      await connectDatabase();
      const trigger = await TriggerModel.findById(triggerId).exec();
      return trigger;
    } catch (error) {
      throw new Error("Error fetching trigger by ID");
    } finally {
      disconnectDatabase();
    }
  },
};
