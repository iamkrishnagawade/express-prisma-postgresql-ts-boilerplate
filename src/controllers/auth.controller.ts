import { Request, Response } from "express";
import { sendResponse } from "../utils/apiResponse";
import {
  loginUserService,
  refreshAccessTokenService,
  registerUserService,
} from "../services/auth.service";
import { prisma } from "../config/prisma";
import { collectDeviceTrackingInfo } from "../utils/auth";

export const registerUser = async (req: Request, res: Response) => {
  const device_tracking_info = collectDeviceTrackingInfo(req);
  const { access_token, refresh_token } = await registerUserService(
    req.body,
    device_tracking_info
  );
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
  const device_tracking_info = collectDeviceTrackingInfo(req);
  const { access_token, refresh_token } = await loginUserService(
    req.body,
    device_tracking_info
  );
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
  const device_tracking_info = collectDeviceTrackingInfo(req);

  const { newAccessToken, newRefreshToken } = await refreshAccessTokenService(
    token,
    device_tracking_info
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return sendResponse(res, 200, "Token refreshed", { newAccessToken });
};

// Logout user
export const logoutUser = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  await prisma.refreshToken.update({
    where: {
      token,
    },
    data: {
      revoked: true,
    },
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: true,
  });

  return sendResponse(res, 200, "Logout successful");
};
