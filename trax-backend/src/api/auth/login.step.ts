import { z } from "zod";
import { authService } from "../../services/auth-service/index";
import { ApiRouteConfig, Handlers } from "motia";
export const config: ApiRouteConfig = {
  name: "Login User",
  type: "api",
  path: "/auth/login",
  method: "POST",
  description: "Login a user",
  emits: [],
  flows: ["auth-management"],
  includeFiles: [
    "../../services/auth-service/index.ts",
    "../../repositories/auth-dto.ts",
  ],
};

export const handler: Handlers["Login User"] = async (req, { logger }) => {
  try {
    logger.info("Logging in user", { body: req.body });
    const validatedData = loginUserBodySchema.safeParse(req.body);
    if (!validatedData.success) {
      throw new Error("Validation failed");
    }
    const user = await authService.loginUser(validatedData.data);
    return {
      status: 200,
      body: {
        token: user.token,
        userId: user.userId,
      },
    };
  } catch (error) {
    logger.error("Error logging in user", { error });
    if (error instanceof Error) {
      return {
        status: 500,
        body: { error: error },
      };
    }
  }
};

const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
