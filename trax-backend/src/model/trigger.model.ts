import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITrigger extends Document {
  userId: Types.ObjectId;
  eventType: "mobile" | "flight";
  isActive: boolean;
  config: Record<string, unknown>;
  expectedPrice: number;
  timeDuration: string;
  nextCheck: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface ITriggerDoc extends ITrigger, Document {}

const TriggerSchema = new Schema<ITrigger>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: ["mobile", "flight"],
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  config: {
    type: Schema.Types.Mixed,
    default: {},
  },
  expectedPrice: {
    type: Number,
    default: 0,
  },
  nextCheck: {
    type: Date,
    default: new Date(),
  },
});

// Indexes for common queries
TriggerSchema.index({ eventType: 1, isActive: 1 });
TriggerSchema.index({ createdAt: -1 });

export const TriggerModel = mongoose.model<ITrigger>("Trigger", TriggerSchema);
