import { IUserDoc, User } from "../model/user.model";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Types } from "mongoose";
import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "../utils/database";

dotenv.config();

export const authRepository = {
  async findByEmail(email: string) {
    try {
      await connectDatabase();
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new Error("Error finding user by email");
    } finally {
      await disconnectDatabase();
    }
  },

  async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  },

  async generateToken(userId: string | Types.ObjectId): Promise<string> {
    return jwt.sign({ userId }, (process.env.JWT_SECRET as string) ?? "test", {
      expiresIn: "1h",
    });
  },

  async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, (process.env.JWT_SECRET as string) ?? "test");
  },

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    password: string;
  }): Promise<IUserDoc> {
    try {
      await connectDatabase();
      const newUser = await User.create(data);
      return newUser;
    } catch (error) {
      throw new Error("Error creating user");
    } finally {
      await disconnectDatabase();
    }
  },
};
