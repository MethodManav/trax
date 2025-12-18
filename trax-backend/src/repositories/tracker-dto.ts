import { ITracker, ITrackerDoc, TrackerModel } from "../model/tracker.model";
import { connectDatabase, disconnectDatabase } from "../utils/database";

export const trackerRepository = {
  async createTrackerData(data: ITracker): Promise<ITrackerDoc> {
    try {
      await connectDatabase();
      const tracker = await TrackerModel.create(data);
      return tracker;
    } catch (error) {
      throw new Error("Error creating tracker in repository");
    } finally {
      disconnectDatabase();
    }
  },
};
