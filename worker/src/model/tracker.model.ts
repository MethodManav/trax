import mongoose, { Types } from "mongoose";

export interface ITracker {
  triggerId: Types.ObjectId;
  userId: Types.ObjectId;
  currentPrice: [
    {
      site: string;
      price: number;
    }
  ];
  targetPrice: number;
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrackerDoc extends ITracker, mongoose.Document {}

const trackerSchema = new mongoose.Schema<ITracker>(
  {
    triggerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trigger",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentPrice: [
      {
        site: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    targetPrice: { type: Number, required: true },
    lastChecked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TrackerModel = mongoose.model<ITracker>("Tracker", trackerSchema);
