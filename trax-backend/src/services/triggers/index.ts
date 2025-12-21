import { triggerRepository } from "../../repositories/triggers-dto";
import { ITrigger, ITriggerDoc, TriggerModel } from "../../model/trigger.model";
import { connectDatabase, disconnectDatabase } from "../../utils/database";

export const triggerService = {
  async CreateTrigger(data: ITrigger): Promise<ITriggerDoc> {
    const trigger = await triggerRepository.createTriggerData(data);
    return trigger as ITriggerDoc;
  },
  async aggregate(query: any[]): Promise<any[]> {
    try {
      await connectDatabase();
      return await TriggerModel.aggregate(query);
    } catch (error) {
      throw new Error("Error in trigger service aggregate");
    } finally {
      await disconnectDatabase();
    }
  },
  async getAllUserTriggers(userId: string): Promise<ITriggerDoc[]> {
    try {
      await connectDatabase();
      const triggers = await TriggerModel.find({
        userId: userId,
      });
      return triggers as ITriggerDoc[];
    } catch (error) {
      throw new Error("Error in trigger service getAllTriggers");
    } finally {
      await disconnectDatabase();
    }
  },

  async setTriggerInActive(
    triggerId: string,
    userId: string
  ): Promise<ITriggerDoc | null> {
    try {
      await connectDatabase();
      const updatedTrigger = await TriggerModel.findOneAndUpdate(
        { _id: triggerId, userId: userId },
        { isActive: false },
        { new: true }
      );
      return updatedTrigger as ITriggerDoc;
    } catch (error) {
      throw new Error("Error in trigger service setTriggerInActive");
    } finally {
      await disconnectDatabase();
    }
  },
};
