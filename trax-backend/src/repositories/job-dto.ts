import { Types } from "mongoose";
import { jobQueue } from "../model/job-queue.model";
import { TriggerModel } from "../model/trigger.model";
import { connectDatabase, disconnectDatabase } from "../utils/database";

export async function enqueue(triggerId: string) {
  try {
    connectDatabase();
    const job = await jobQueue.create({
      triggerId,
      status: "pending",
      createdAt: new Date(),
    });
    await TriggerModel.updateOne(
      { _id: triggerId },
      { $set: { nextCheck: new Date(Date.now() + 10 * 60 * 1000) } }
    );
    return job;
  } catch (error) {
    throw new Error(`Failed to enqueue job: ${error}`);
  } finally {
    // Ensure database connection is closed after operation
    await disconnectDatabase();
  }
}

export async function getNextJob() {
  try {
    await connectDatabase();
    return await jobQueue.findOneAndUpdate(
      { status: "pending" },
      {
        $set: {
          status: "processing",
          lockedAt: new Date(),
        },
      },
      { sort: { createdAt: 1 }, new: true }
    );
  } catch (error) {
    throw new Error(`Failed to get next job: ${error}`);
  } finally {
    await disconnectDatabase();
  }
}

export async function markDone(jobId: Types.ObjectId) {
  return jobQueue.updateOne({ _id: jobId }, { $set: { status: "done" } });
}

export async function markFailed(jobId: Types.ObjectId, error: any) {
  return jobQueue.updateOne(
    { _id: jobId },
    { $set: { status: "failed", error } }
  );
}
