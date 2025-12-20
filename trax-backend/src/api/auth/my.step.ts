import { z } from "zod";
import { authService } from "../../services/auth-service/index";
import { ApiMiddleware, ApiRouteConfig, Handlers } from "motia";
import { authenticateToken } from "../../middleware/auth.middleware";
export const config: ApiRouteConfig = {
  name: "User",
  type: "api",
  path: "/auth/my",
  method: "GET",
  description: "Get a user",
  middleware: [authenticateToken as ApiMiddleware],
  emits: [],
  flows: ["auth-management"],
  includeFiles: [
    "../../services/auth-service/index.ts",
    "../../repositories/auth-dto.ts",
  ],
};

export const handler: Handlers["User"] = async (req, { logger }) => {
  try {
    logger.info("Logging in user", { body: req.body });
    // @ts-ignore
    const { userId } = req;
    const user = await authService.getUserById(userId);
    return {
      status: 200,
      body: {
        user: user,
      },
    };
  } catch (error) {
    logger.error("Error logging in user", { error });
    if (error instanceof Error) {
      return {
        status: 500,
        body: { error: error.message || "Internal server error" },
      };
    }
  }
};

const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
