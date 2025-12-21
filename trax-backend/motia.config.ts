import { defineConfig } from "@motiadev/core";
import endpointPlugin from "@motiadev/plugin-endpoint/plugin";
import logsPlugin from "@motiadev/plugin-logs/plugin";
import observabilityPlugin from "@motiadev/plugin-observability/plugin";
import statesPlugin from "@motiadev/plugin-states/plugin";
import bullmqPlugin from "@motiadev/plugin-bullmq/plugin";

const getRedisConfig = () => {
  const useExternalRedis =
    process.env.USE_REDIS === "true" ||
    (process.env.USE_REDIS !== "false" &&
      process.env.NODE_ENV === "production");

  if (!useExternalRedis) {
    // Use Motia's built-in in-memory Redis for development
    return { useMemoryServer: true as const };
  }

  // Parse Redis URL for production
  const redisUrl = process.env.REDIS_PRIVATE_URL || process.env.REDIS_URL;

  if (redisUrl) {
    try {
      const url = new URL(redisUrl);
      return {
        useMemoryServer: false as const,
        host: url.hostname,
        port: parseInt(url.port || "6379", 10),
        password: url.password || undefined,
        username: url.username || undefined,
      };
    } catch (e) {
      console.error("[motia] Failed to parse REDIS_URL:", e);
    }
  }

  // Fallback to individual env vars
  return {
    useMemoryServer: false as const,
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
  };
};

export default defineConfig({
  plugins: [
    observabilityPlugin,
    statesPlugin,
    endpointPlugin,
    logsPlugin,
    bullmqPlugin,
  ],
  // app: (app) => {
  //   app.use((req, res, next) => {
  //     const origin = req.headers.origin;

  //     if (origin) {
  //       res.setHeader("Access-Control-Allow-Origin", origin); // echo the request origin
  //       res.setHeader("Vary", "Origin");
  //     }

  //     res.setHeader("Access-Control-Allow-Credentials", "true");

  //     if (req.method === "OPTIONS") {
  //       res.setHeader(
  //         "Access-Control-Allow-Headers",
  //         "Content-Type, Authorization, x-auth-token"
  //       );
  //       res.setHeader(
  //         "Access-Control-Allow-Methods",
  //         "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  //       );
  //       return res.sendStatus(204);
  //     }

  //     next();
  //   });
  // },

  redis: getRedisConfig(),
});
