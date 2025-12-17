import mongoose from "mongoose";
import EnvParser from "./CustomEnv";

let isConnected = false;
export async function connectDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }
  const mongoUri = "mongodb+srv://pulsar:OpLAIa9sV7F3PzrY@cluster0.mojbb3o.mongodb.net/"
  console.log("Connecting to MongoDB at:", mongoUri);

  try {
    await mongoose.connect(mongoUri,{dbName:'trax'});
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
