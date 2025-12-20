import { ApiRouteConfig, Handlers } from "motia";

export const config: ApiRouteConfig = {
  name: "Test Server",
  type: "api",
  path: "/test",
  method: "GET",
  description: "Test the server",
  emits: [],
  flows: ["system-health"],
};

export const handler: Handlers["User"] = async (req, { logger }) => {
  return {
    status: 200,
    body: { message: "Server is running!" },
  };
};
