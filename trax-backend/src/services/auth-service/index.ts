import { authRepository } from "../../repositories/auth-dto";
import type { SignUpUserBody } from "../../api/auth/signup.step";

export const authService = {
  async loginUser(data: {
    email: string;
    password: string;
  }): Promise<{ token: string; userId: string }> {
    const user = await authRepository.findByEmail(data.email);
    console.log("User found:", user);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await authRepository.comparePassword(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = await authRepository.generateToken(user._id);

    return { token, userId: user._id.toString() };
  },

  async signUpUser(
    data: SignUpUserBody
  ): Promise<{ token: string; userId: string }> {
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await authRepository.hashPassword(data.password);
    const user = await authRepository.createUser({
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });

    const token = await authRepository.generateToken(user._id);

    return { token, userId: user._id.toString() };
  },
  async getUserById(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  },
};
