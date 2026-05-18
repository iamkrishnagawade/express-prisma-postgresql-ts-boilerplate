import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Request } from "express";
import crypto from "crypto";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
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
    } as jwt.SignOptions
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
    } as jwt.SignOptions
  );
};

export const collectDeviceTrackingInfo = (req: Request) => {
  // Collect device tracking information
  const ipAddress = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const fingerprint = crypto
    .createHash("sha256")
    .update(`${ipAddress}-${userAgent}`)
    .digest("hex");

  return {
    ipAddress,
    userAgent,
    fingerprint,
  };
};
