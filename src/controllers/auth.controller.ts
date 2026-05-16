import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/apiResponse";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";
import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import { env } from "../config/env";
import { generateAccessToken } from "../utils/auth";

export const registerUser = async (req: Request, res: Response) => {
  const { access_token, refresh_token } = await registerUserService(req.body);
  res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  return sendResponse(res, 201, "User registered successfully", {
    access_token,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { access_token, refresh_token } = await loginUserService(req.body);
  res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  return sendResponse(res, 201, "login successfully", { access_token });
};

// Protected controller
export const getMe = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return sendResponse(res, 200, "User fetched successfully", user);
};

// Admin controller
export const adminDashboard = async (req: Request, res: Response) => {
  return sendResponse(res, 200, "Welcome Admin", {
    user: req.user,
  });
};

// Refresh access token
export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError("Refresh token missing", 401);
  }

  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET!) as {
    userId: string;
    role: string;
  };

  const accessToken = generateAccessToken({
    userId: decoded.userId,
    role: decoded.role,
  });

  return sendResponse(res, 200, "Token refreshed", { accessToken });
};

// Logout user
export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: true,
  });

  return sendResponse(res, 200, "Logout successful");
};
