
import {
  triggerRepository,
} from "../../repositories/triggers-dto";
import type {
  CreateMobileTriggerBody,
} from "../../api/triggers/create-trigger.step";
import { ITrigger, ITriggerDoc } from "../../model/trigger.model";

export const triggerService = {


  async CreateTrigger(data: CreateMobileTriggerBody): Promise<ITriggerDoc> {
    const trigger = await triggerRepository.create({
      eventType: data.eventType,
      config: data.config,
      isActive: true,
    } as ITrigger);

    return trigger as ITriggerDoc;
  }
};  