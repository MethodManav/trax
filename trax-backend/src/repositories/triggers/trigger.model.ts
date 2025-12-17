import mongoose, { Schema, Document } from "mongoose";

export interface ITrigger extends Document {
  name: string;
  eventType: "mobile" | "flight";
  isActive: boolean;
  config: Record<string, unknown>;
  expectedPrice: number;
  timeDuration: number;
  nextCheck: number;
  createdAt: Date;
  updatedAt: Date;
}

const TriggerSchema = new Schema<ITrigger>({
  name: {
    type: String,
    required: true,
    trim: true,
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
  timeDuration: {
    type: Number,
    default: 0,
  },
  nextCheck: {
    type: Number,
    default: 0,
  },
});

// Indexes for common queries
TriggerSchema.index({ eventType: 1, isActive: 1 });
TriggerSchema.index({ createdAt: -1 });

export const TriggerModel = mongoose.model<ITrigger>("Trigger", TriggerSchema);
