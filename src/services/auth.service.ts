import { env } from "../config/env";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth";

export const registerUserService = async (
  payload: {
    name: string;
    email: string;
    password: string;
  },
  device_tracking_info: {
    ipAddress: string | undefined;
    userAgent: string | undefined;
    fingerprint: string;
  },
) => {
  const { ipAddress, userAgent, fingerprint } = device_tracking_info;
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exist", 404);
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  const access_token = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refresh_token = generateRefreshToken({
    userId: user.id,
    role: user.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: refresh_token,
      userId: user.id,
      ipAddress,
      userAgent,
      fingerprint,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    access_token,
    refresh_token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUserService = async (
  payload: {
    email: string;
    password: string;
  },
  device_tracking_info: {
    ipAddress: string | undefined;
    userAgent: string | undefined;
    fingerprint: string;
  },
) => {
  const { ipAddress, userAgent, fingerprint } = device_tracking_info;
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordMatched = await comparePassword(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", 401);
  }

  const access_token = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refresh_token = generateRefreshToken({
    userId: user.id,
    role: user.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: refresh_token,
      userId: user.id,
      ipAddress,
      userAgent,
      fingerprint,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    access_token,
    refresh_token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const refreshAccessTokenService = async (
  token: string,
  device_tracking_info: {
    ipAddress: string | undefined;
    userAgent: string | undefined;
    fingerprint: string;
  },
) => {
  const { ipAddress, userAgent, fingerprint } = device_tracking_info;
  if (!token) {
    throw new AppError("Refresh token missing", 401);
  }

  const existingToken = await prisma.refreshToken.findUnique({
    where: {
      token: token,
    },
  });

  if (!existingToken || existingToken.revoked) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (existingToken.fingerprint !== fingerprint) {
    throw new AppError("Suspicious device", 401);
  }

  await prisma.refreshToken.update({
    where: {
      token: token,
    },
    data: {
      revoked: true,
    },
  });

  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET!) as {
    userId: string;
    role: string;
  };

  const newAccessToken = generateAccessToken({
    userId: decoded.userId,
    role: decoded.role,
  });

  const newRefreshToken = generateRefreshToken({
    userId: decoded.userId,
    role: decoded.role,
  });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.userId,
      ipAddress,
      userAgent,
      fingerprint,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    newAccessToken,
    newRefreshToken,
  };
};
