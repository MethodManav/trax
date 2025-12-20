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
};
