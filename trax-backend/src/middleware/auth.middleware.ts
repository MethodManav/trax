import { ApiMiddleware } from "motia";
import { authRepository } from "../repositories/auth-dto";

//token authentication middleware
const authenticateToken: ApiMiddleware = async (req, ctx, next) => {
  const authHeader = req.headers["x-auth-token"];
  console.log("Auth Header:", authHeader);
  if (!authHeader || typeof authHeader !== "string") {
    return { status: 401, body: { message: "No token provided" } };
  }
  try {
    const decoded = await authRepository.verifyToken(authHeader);
    console.info("Token verified:", decoded);
    // @ts-ignore
    req.userId = decoded.userId;
    return await next();
  } catch (error) {
    return { status: 401, body: { message: "Invalid token" } };
  }
};
export { authenticateToken };
