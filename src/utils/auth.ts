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

export const generateAccessToken = (payload: {
  userId: string;
  role: string;
}) => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not define.");
  }

  return jwt.sign(
    payload,
    env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions,
  );
};

export const generateRefreshToken = (payload: {
  userId: string;
  role: string;
}) => {
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not define.");
  }

  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET as jwt.Secret,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions,
  );
};
