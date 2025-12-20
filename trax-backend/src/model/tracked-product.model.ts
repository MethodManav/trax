import { model, Schema, Types } from "mongoose";

export enum SITE_SUPPORT {
  AMAZON = "amazon",
  FLIPKART = "flipkart",
}

export interface ITrackedProduct {
  triggerId: Types.ObjectId;
  userId: Types.ObjectId;
  chart: [
    {
      amazonPrice: number;
      flipkartPrice: number;
      time: Date;
    }
  ];
}

const TrackerProductSchema = new Schema<ITrackedProduct>({
  triggerId: {
    type: Schema.Types.ObjectId,
    ref: "Trigger",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chart: [
    {
      amazonPrice: { type: Number },
      flipkartPrice: { type: Number },
      time: { type: new Date() },
    },
  ],
});

export const TrackerModel = model<ITrackedProduct>(
  "Tracker",
  TrackerProductSchema
);
