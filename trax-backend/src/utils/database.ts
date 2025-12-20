import mongoose from "mongoose";

let isConnected = false;
export async function connectDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }
  const mongoUri = process.env.DB_URL ?? " ";
  console.log("Connecting to MongoDB at:", mongoUri);

  try {
    await mongoose.connect(mongoUri, { dbName: "trax" });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    throw error;
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
