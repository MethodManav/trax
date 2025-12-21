import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITrigger extends Document {
  userId: Types.ObjectId;
  eventType: "mobile" | "flight";
  isActive: boolean;
  config: Record<string, unknown>;
  expectedPrice: number;
  timeDuration: number;
  isTracked: boolean;
  nextCheck: Date;
  lastFetchedPrice: Record<string, unknown>;
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
  timeDuration: {
    type: Number,
    default: 0,
  },
  lastFetchedPrice: {
    type: Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  nextCheck: {
    type: Date,
    default: function (this: ITrigger) {
      return new Date(Date.now() + this.timeDuration);
    },
  },
  isTracked: {
    type: Boolean,
    default: false,
  },
});

// Indexes for common queries
TriggerSchema.index({ eventType: 1, isActive: 1 });
TriggerSchema.index({ createdAt: -1 });

export const TriggerModel = mongoose.model<ITrigger>("Trigger", TriggerSchema);
