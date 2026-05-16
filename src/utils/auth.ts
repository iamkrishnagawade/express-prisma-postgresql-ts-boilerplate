import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: { userId: string; role: string }) => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not define.");
  }
  const expiresIn = env.JWT_EXPIRES_IN || "7d"; // string

  return jwt.sign(
    payload,
    env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions,
  );
};
