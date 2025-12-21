import { model, Schema, Types } from "mongoose";

export interface Notification {
  userId: Types.ObjectId;
  triggerId: Types.ObjectId;
  message: string;
  createdAt: Date;
  read: boolean;
}

const NotificationSchema = new Schema<Notification>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  triggerId: { type: Schema.Types.ObjectId, required: true, ref: "Trigger" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export const NotificationModel = model<Notification>(
  "Notification",
  NotificationSchema
);
