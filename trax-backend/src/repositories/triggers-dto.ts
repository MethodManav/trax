import { PipelineStage, Types } from "mongoose";
import {
  ITriggerDoc,
  TriggerModel,
  type ITrigger,
} from "../model/trigger.model";
import { connectDatabase, disconnectDatabase } from "../utils/database";
import { NotificationModel } from "../model/notificayion.model";

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

  fetchUserDashboardQuery(userId: string): PipelineStage[] {
    return [
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "alerts",
          localField: "userId",
          foreignField: "userId",
          as: "alerts",
        },
      },
    ];
  },

  async getRecentNotifications(userId: string, limit: number): Promise<any[]> {
    try {
      await connectDatabase();
      const data = await NotificationModel.find({
        userId: new Types.ObjectId(userId),
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
      return data;
    } catch (error) {
      throw new Error("Error fetching recent notifications");
    } finally {
      disconnectDatabase();
    }
  },
};
