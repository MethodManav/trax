import mongoose, { mongo, Types } from "mongoose";

export interface JobQueueModel {
  _id: Types.ObjectId;
  triggerId: Types.ObjectId;
  status: "pending" | "processing" | "done" | "failed";
  createdAt: Date;
  lockedAt?: Date;
}

export const JobQueueSchema = new mongoose.Schema<JobQueueModel>({
  _id: { type: Types.ObjectId, required: true, auto: true },
  triggerId: { type: Types.ObjectId, required: true, ref: "Trigger" },
  status: {
    type: String,
    enum: ["pending", "processing", "done", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  lockedAt: { type: Date, default: null },
}).index({ status: 1, createdAt: 1 });

export const jobQueue = mongoose.model<JobQueueModel>(
  "JobQueue",
  JobQueueSchema
);
