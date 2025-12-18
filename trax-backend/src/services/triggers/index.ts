import { triggerRepository } from "../../repositories/triggers-dto";
import { ITrigger, ITriggerDoc } from "../../model/trigger.model";

export const triggerService = {
  async CreateTrigger(data: ITrigger): Promise<ITriggerDoc> {
    const trigger = await triggerRepository.createTriggerData(data);
    return trigger as ITriggerDoc;
  },
};
