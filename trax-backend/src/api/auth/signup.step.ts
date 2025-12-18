
import { z, ZodError } from "zod";
import { authService } from "../../services/auth-service/index";
import { ApiRouteConfig, Handlers } from "motia";

export const config: ApiRouteConfig = {
  name: "Signup User",
  type: "api",
  path: "/auth/signup",
  method: "POST",
  description: "Sign up a new user",
  emits: [],
  flows: ["auth-management"],
  includeFiles: [
    "../../services/auth-service/index.ts",
    "../../repositories/auth-dto.ts",
  ],
};


export const handler: Handlers["Signup User"] = async (req, { logger }) => {
  logger.info("Signing up user", { body: req.body });
  const validatedData = signUpUserBodySchema.safeParse(req.body);
  if (!validatedData.success) {
    logger.error("Validation failed", { errors: validatedData.error });
    throw new Error("Invalid request data");
  }
  const user = await authService.signUpUser(validatedData.data);
  return {
    token: user.token,
    userId: user.userId,
  };
};


const signUpUserBodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  mobile: z.string().min(10).max(10),
  password: z.string().min(6),
});

export type SignUpUserBody = z.infer<typeof signUpUserBodySchema>;