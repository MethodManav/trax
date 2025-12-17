
import { ITriggerDoc, TriggerModel, type ITrigger } from "../model/trigger.model";

export const triggerRepository = {
  async create(data: ITrigger): Promise<ITriggerDoc> {
    const trigger = new TriggerModel({
      eventType: data.eventType,
      isActive: data.isActive ?? true,
      config: data.config || {},
    });

    const savedTrigger = await trigger.save();
    return savedTrigger as ITriggerDoc;
  },
};

  